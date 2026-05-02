import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { courses, type StudentAccount, type StudentDevice } from "@academia/shared";
import { getStudyDatabase, type StudyDatabase } from "./cloudflare-db";

type StoredStudent = StudentAccount & {
  passwordHash: string;
};

type StudentRow = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  status: StudentAccount["status"];
  university: string | null;
  profile_note: string | null;
  enrolled_course_slugs: string | null;
  subscriptions: string | null;
  devices: string | null;
  password_hash: string;
};

type CreateStudentInput = {
  fullName: string;
  email: string;
  password: string;
};

type UpdateStudentProfileInput = {
  fullName: string;
  university: string;
  profileNote: string;
};

type RegisterStudentDeviceInput = {
  studentId: string;
  deviceId: string;
  userAgent: string;
};

function getPreferredDataFilePath() {
  const cwd = process.cwd();

  if (path.basename(cwd) === "web") {
    return path.join(cwd, "data/students.json");
  }

  return path.join(cwd, "apps/web/data/students.json");
}

const DATA_FILE_CANDIDATES = [
  getPreferredDataFilePath(),
  path.join(process.cwd(), "data/students.json"),
  path.join(process.cwd(), "apps/web/data/students.json"),
];

const TEMP_DATA_FILE = path.join(os.tmpdir(), "studybyeapa", "students.json");

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function parseJsonArray<T>(value: string | null | undefined): T[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function normalizeStoredStudent(student: StoredStudent) {
  return {
    ...student,
    university: student.university ?? "",
    profileNote: student.profileNote ?? "",
    enrolledCourseSlugs: student.enrolledCourseSlugs ?? [],
    subscriptions: student.subscriptions ?? [],
    devices: student.devices ?? [],
  } satisfies StoredStudent;
}

function sanitizeStudent(student: StoredStudent): StudentAccount {
  const normalizedStudent = normalizeStoredStudent(student);

  return {
    id: normalizedStudent.id,
    fullName: normalizedStudent.fullName,
    email: normalizedStudent.email,
    createdAt: normalizedStudent.createdAt,
    status: normalizedStudent.status,
    university: normalizedStudent.university,
    profileNote: normalizedStudent.profileNote,
    enrolledCourseSlugs: normalizedStudent.enrolledCourseSlugs,
    subscriptions: normalizedStudent.subscriptions,
    devices: normalizedStudent.devices,
  };
}

function rowToStoredStudent(row: StudentRow): StoredStudent {
  return normalizeStoredStudent({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    createdAt: row.created_at,
    status: row.status,
    university: row.university ?? "",
    profileNote: row.profile_note ?? "",
    enrolledCourseSlugs: parseJsonArray<string>(row.enrolled_course_slugs),
    subscriptions: parseJsonArray<StudentAccount["subscriptions"][number]>(
      row.subscriptions,
    ),
    devices: parseJsonArray<StudentDevice>(row.devices),
    passwordHash: row.password_hash,
  });
}

async function resolveDataFile() {
  for (const candidate of DATA_FILE_CANDIDATES) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {}
  }

  return getPreferredDataFilePath();
}

async function readBundledSeedFile() {
  for (const candidate of DATA_FILE_CANDIDATES) {
    try {
      const raw = await fs.readFile(candidate, "utf8");
      return raw.trim() ? raw : "[]";
    } catch {}
  }

  return "[]";
}

async function canWriteFile(filePath: string) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const handle = await fs.open(filePath, "a");
    await handle.close();
    return true;
  } catch {
    return false;
  }
}

async function ensureDataFile() {
  const preferredDataFile = await resolveDataFile();
  const writableDataFile = (await canWriteFile(preferredDataFile))
    ? preferredDataFile
    : TEMP_DATA_FILE;

  await fs.mkdir(path.dirname(writableDataFile), { recursive: true });

  try {
    await fs.access(writableDataFile);
  } catch {
    const seedContents =
      writableDataFile === TEMP_DATA_FILE
        ? await readBundledSeedFile()
        : "[]";

    await fs.writeFile(writableDataFile, seedContents, "utf8");
  }

  return writableDataFile;
}

async function readStoredStudents() {
  const db = getStudyDatabase();

  if (db) {
    const { results = [] } = await db
      .prepare(
        `SELECT
          id,
          full_name,
          email,
          created_at,
          status,
          university,
          profile_note,
          enrolled_course_slugs,
          subscriptions,
          devices,
          password_hash
        FROM students
        ORDER BY created_at DESC`,
      )
      .all<StudentRow>();

    return results.map(rowToStoredStudent);
  }

  const dataFile = await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf8");

  try {
    return (JSON.parse(raw) as StoredStudent[]).map(normalizeStoredStudent);
  } catch {
    return [];
  }
}

async function upsertD1Student(db: StudyDatabase, student: StoredStudent) {
  await db
    .prepare(
      `INSERT INTO students (
        id,
        full_name,
        email,
        created_at,
        status,
        university,
        profile_note,
        enrolled_course_slugs,
        subscriptions,
        devices,
        password_hash
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        full_name = excluded.full_name,
        email = excluded.email,
        created_at = excluded.created_at,
        status = excluded.status,
        university = excluded.university,
        profile_note = excluded.profile_note,
        enrolled_course_slugs = excluded.enrolled_course_slugs,
        subscriptions = excluded.subscriptions,
        devices = excluded.devices,
        password_hash = excluded.password_hash`,
    )
    .bind(
      student.id,
      student.fullName,
      student.email,
      student.createdAt,
      student.status,
      student.university,
      student.profileNote,
      JSON.stringify(student.enrolledCourseSlugs),
      JSON.stringify(student.subscriptions),
      JSON.stringify(student.devices),
      student.passwordHash,
    )
    .run();
}

async function writeStoredStudents(students: StoredStudent[]) {
  const db = getStudyDatabase();

  if (db) {
    for (const student of students) {
      await upsertD1Student(db, normalizeStoredStudent(student));
    }

    return;
  }

  const dataFile = await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify(students, null, 2), "utf8");
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const incomingHash = scryptSync(password, salt, 64);
  const storedHashBuffer = Buffer.from(storedHash, "hex");

  if (incomingHash.length !== storedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(incomingHash, storedHashBuffer);
}

function getExtraDeviceFeeUsd(student: StoredStudent) {
  const activeSubscriptions = student.subscriptions.filter(
    (subscription) => subscription.status === "active",
  );

  if (!activeSubscriptions.length) {
    return 0;
  }

  return Math.max(
    ...activeSubscriptions.map((subscription) => subscription.extraDeviceFeeUsd),
  );
}

function buildDeviceLabel(userAgent: string, count: number) {
  const normalizedAgent = userAgent.toLowerCase();
  const browser = normalizedAgent.includes("safari") && !normalizedAgent.includes("chrome")
    ? "Safari"
    : normalizedAgent.includes("chrome")
      ? "Chrome"
      : normalizedAgent.includes("firefox")
        ? "Firefox"
        : normalizedAgent.includes("edg")
          ? "Edge"
          : "Navegador";

  const os = normalizedAgent.includes("iphone") || normalizedAgent.includes("ipad")
    ? "iOS"
    : normalizedAgent.includes("android")
      ? "Android"
      : normalizedAgent.includes("mac os")
        ? "macOS"
        : normalizedAgent.includes("windows")
          ? "Windows"
          : "Equipo";

  return `${browser} · ${os} ${count}`;
}

function addMonths(date: Date, months: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

export async function listStudents() {
  const students = await readStoredStudents();

  return students
    .map(sanitizeStudent)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getStudentById(id: string) {
  const students = await readStoredStudents();
  const student = students.find((entry) => entry.id === id);

  return student ? sanitizeStudent(student) : null;
}

export async function createStudent(input: CreateStudentInput) {
  const students = await readStoredStudents();
  const email = normalizeEmail(input.email);

  const existingStudent = students.find((entry) => entry.email === email);

  if (existingStudent) {
    throw new Error("Ya existe una cuenta con ese correo.");
  }

  const student: StoredStudent = {
    id: randomUUID(),
    fullName: input.fullName.trim(),
    email,
    createdAt: new Date().toISOString(),
    status: "active",
    university: "",
    profileNote: "",
    enrolledCourseSlugs: [],
    subscriptions: [],
    devices: [],
    passwordHash: hashPassword(input.password),
  };

  students.push(student);
  await writeStoredStudents(students);

  return sanitizeStudent(student);
}

export async function authenticateStudent(email: string, password: string) {
  const students = await readStoredStudents();
  const student = students.find(
    (entry) => entry.email === normalizeEmail(email),
  );

  if (!student) {
    return null;
  }

  if (!verifyPassword(password, student.passwordHash)) {
    return null;
  }

  return sanitizeStudent(student);
}

export async function updateStudentProfile(
  studentId: string,
  input: UpdateStudentProfileInput,
) {
  const students = await readStoredStudents();
  const student = students.find((entry) => entry.id === studentId);

  if (!student) {
    throw new Error("No encontramos la cuenta.");
  }

  student.fullName = input.fullName.trim();
  student.university = input.university.trim();
  student.profileNote = input.profileNote.trim();

  await writeStoredStudents(students);

  return sanitizeStudent(student);
}

export async function changeStudentPassword(
  studentId: string,
  currentPassword: string,
  nextPassword: string,
) {
  const students = await readStoredStudents();
  const student = students.find((entry) => entry.id === studentId);

  if (!student) {
    throw new Error("No encontramos la cuenta.");
  }

  if (!verifyPassword(currentPassword, student.passwordHash)) {
    throw new Error("La contrasena actual no coincide.");
  }

  student.passwordHash = hashPassword(nextPassword);
  await writeStoredStudents(students);

  return sanitizeStudent(student);
}

export async function registerStudentDevice(input: RegisterStudentDeviceInput) {
  const students = await readStoredStudents();
  const student = students.find((entry) => entry.id === input.studentId);

  if (!student) {
    return null;
  }

  const now = new Date().toISOString();
  const existingDevice = student.devices.find((device) => device.id === input.deviceId);

  if (existingDevice) {
    existingDevice.lastSeenAt = now;
    existingDevice.userAgent = input.userAgent;
  } else {
    const activeDevices = student.devices.filter((device) => device.status === "active");
    const exceedsLimit = activeDevices.length >= 4;
    const extraChargeUsd = exceedsLimit ? getExtraDeviceFeeUsd(student) : 0;

    const device: StudentDevice = {
      id: input.deviceId,
      label: buildDeviceLabel(input.userAgent, student.devices.length + 1),
      userAgent: input.userAgent,
      firstSeenAt: now,
      lastSeenAt: now,
      status: exceedsLimit ? "extra-charge" : "active",
      extraChargeUsd,
    };

    student.devices.push(device);
  }

  await writeStoredStudents(students);

  return sanitizeStudent(student);
}

export async function revokeStudentDevice(studentId: string, deviceId: string) {
  const students = await readStoredStudents();
  const student = students.find((entry) => entry.id === studentId);

  if (!student) {
    throw new Error("No encontramos la cuenta.");
  }

  student.devices = student.devices.filter((device) => device.id !== deviceId);
  await writeStoredStudents(students);

  return sanitizeStudent(student);
}

export async function activateCourseSubscription(studentId: string, courseSlug: string) {
  const students = await readStoredStudents();
  const student = students.find((entry) => entry.id === studentId);

  if (!student) {
    throw new Error("No encontramos la cuenta.");
  }

  const course = courses.find((item) => item.slug === courseSlug);

  if (!course) {
    throw new Error("No encontramos el curso.");
  }

  const startedAt = new Date();
  const expiresAt = addMonths(startedAt, 3);
  const extraDeviceFeeUsd = Number((course.priceUsd / 2).toFixed(2));
  const existingSubscription = student.subscriptions.find(
    (subscription) => subscription.courseSlug === courseSlug,
  );

  if (existingSubscription) {
    existingSubscription.startedAt = startedAt.toISOString();
    existingSubscription.expiresAt = expiresAt.toISOString();
    existingSubscription.status = "active";
    existingSubscription.priceUsd = course.priceUsd;
    existingSubscription.extraDeviceFeeUsd = extraDeviceFeeUsd;
  } else {
    student.subscriptions.push({
      id: `subscription-${courseSlug}`,
      courseSlug,
      courseTitle: course.title,
      startedAt: startedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: "active",
      priceUsd: course.priceUsd,
      cycleLabel: "3 meses",
      extraDeviceFeeUsd,
    });
  }

  if (!student.enrolledCourseSlugs.includes(courseSlug)) {
    student.enrolledCourseSlugs.push(courseSlug);
  }

  await writeStoredStudents(students);

  return sanitizeStudent(student);
}
