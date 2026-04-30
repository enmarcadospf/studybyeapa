import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { StudentAccount } from "@academia/shared";

type StoredStudent = StudentAccount & {
  passwordHash: string;
};

type CreateStudentInput = {
  fullName: string;
  email: string;
  password: string;
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

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function sanitizeStudent(student: StoredStudent): StudentAccount {
  return {
    id: student.id,
    fullName: student.fullName,
    email: student.email,
    createdAt: student.createdAt,
    status: student.status,
    enrolledCourseSlugs: student.enrolledCourseSlugs,
  };
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

async function ensureDataFile() {
  const dataFile = await resolveDataFile();
  await fs.mkdir(path.dirname(dataFile), { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, "[]", "utf8");
  }

  return dataFile;
}

async function readStoredStudents() {
  const dataFile = await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf8");

  try {
    return JSON.parse(raw) as StoredStudent[];
  } catch {
    return [];
  }
}

async function writeStoredStudents(students: StoredStudent[]) {
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
    enrolledCourseSlugs: [],
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
