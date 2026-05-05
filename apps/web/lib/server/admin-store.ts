import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { getStudyDatabase, type StudyDatabase } from "./cloudflare-db";

export type AdminAccess = {
  isAdmin: boolean;
  isOwner: boolean;
};

export type AdminUser = {
  email: string;
  role: "owner" | "admin";
  source: "server" | "database";
  createdAt: string;
  createdBy: string;
};

type AdminUserRow = {
  email: string;
  created_at: string;
  created_by: string;
};

function getPreferredDataFilePath() {
  const cwd = process.cwd();

  if (path.basename(cwd) === "web") {
    return path.join(cwd, "data/admin-users.json");
  }

  return path.join(cwd, "apps/web/data/admin-users.json");
}

const DATA_FILE_CANDIDATES = [
  getPreferredDataFilePath(),
  path.join(process.cwd(), "data/admin-users.json"),
  path.join(process.cwd(), "apps/web/data/admin-users.json"),
];

const TEMP_DATA_FILE = path.join(os.tmpdir(), "studybyeapa", "admin-users.json");

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getOwnerEmails() {
  const rawOwnerEmails =
    process.env.ADMIN_OWNER_EMAILS ?? process.env.ADMIN_EMAILS ?? "";

  return rawOwnerEmails
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);
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

async function resolveWritableDataFile() {
  const preferredDataFile = getPreferredDataFilePath();
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

async function readStoredAdminUsers() {
  const db = getStudyDatabase();

  if (db) {
    const { results = [] } = await db
      .prepare(
        `SELECT email, created_at, created_by
        FROM admin_users
        ORDER BY created_at DESC`,
      )
      .all<AdminUserRow>();

    return results.map((row) => ({
      email: normalizeEmail(row.email),
      role: "admin" as const,
      source: "database" as const,
      createdAt: row.created_at,
      createdBy: row.created_by,
    }));
  }

  const dataFile = await resolveWritableDataFile();
  const raw = await fs.readFile(dataFile, "utf8");

  try {
    const parsed = JSON.parse(raw) as AdminUser[];

    return parsed
      .map((admin) => ({
        ...admin,
        email: normalizeEmail(admin.email),
        role: "admin" as const,
        source: "database" as const,
      }))
      .filter((admin) => admin.email);
  } catch {
    return [];
  }
}

async function writeStoredAdminUsers(admins: AdminUser[]) {
  const db = getStudyDatabase();
  const databaseAdmins = admins.filter((admin) => admin.source === "database");

  if (db) {
    for (const admin of databaseAdmins) {
      await db
        .prepare(
          `INSERT INTO admin_users (email, created_at, created_by)
          VALUES (?, ?, ?)
          ON CONFLICT(email) DO UPDATE SET
            created_at = excluded.created_at,
            created_by = excluded.created_by`,
        )
        .bind(admin.email, admin.createdAt, admin.createdBy)
        .run();
    }

    return;
  }

  const dataFile = await resolveWritableDataFile();
  await fs.writeFile(dataFile, JSON.stringify(databaseAdmins, null, 2), "utf8");
}

export async function listAdminUsers() {
  const now = new Date().toISOString();
  const ownerEmails = getOwnerEmails();
  const storedAdmins = await readStoredAdminUsers();
  const ownerAdmins: AdminUser[] = ownerEmails.map((email) => ({
    email,
    role: "owner",
    source: "server",
    createdAt: now,
    createdBy: "Configuración segura",
  }));
  const ownerEmailSet = new Set(ownerEmails);
  const filteredStoredAdmins = storedAdmins.filter(
    (admin) => !ownerEmailSet.has(admin.email),
  );

  return [...ownerAdmins, ...filteredStoredAdmins].sort((left, right) => {
    if (left.role !== right.role) {
      return left.role === "owner" ? -1 : 1;
    }

    return left.email.localeCompare(right.email);
  });
}

export async function getAdminAccessByEmail(email: string): Promise<AdminAccess> {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return { isAdmin: false, isOwner: false };
  }

  const ownerEmails = getOwnerEmails();

  if (ownerEmails.includes(normalizedEmail)) {
    return { isAdmin: true, isOwner: true };
  }

  const storedAdmins = await readStoredAdminUsers();
  const isAdmin = storedAdmins.some((admin) => admin.email === normalizedEmail);

  return { isAdmin, isOwner: false };
}

export async function addAdminUser(email: string, createdBy: string) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    throw new Error("Escribe un correo válido.");
  }

  const admins = await readStoredAdminUsers();
  const ownerEmails = getOwnerEmails();

  if (ownerEmails.includes(normalizedEmail)) {
    throw new Error("Ese correo ya es propietario.");
  }

  if (!admins.some((admin) => admin.email === normalizedEmail)) {
    admins.push({
      email: normalizedEmail,
      role: "admin",
      source: "database",
      createdAt: new Date().toISOString(),
      createdBy: normalizeEmail(createdBy),
    });
  }

  await writeStoredAdminUsers(admins);

  return listAdminUsers();
}

export async function removeAdminUser(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const ownerEmails = getOwnerEmails();

  if (ownerEmails.includes(normalizedEmail)) {
    throw new Error("No se puede quitar el correo propietario desde la web.");
  }

  const db = getStudyDatabase();

  if (db) {
    await db
      .prepare("DELETE FROM admin_users WHERE email = ?")
      .bind(normalizedEmail)
      .run();

    return listAdminUsers();
  }

  const admins = await readStoredAdminUsers();
  const nextAdmins = admins.filter((admin) => admin.email !== normalizedEmail);

  await writeStoredAdminUsers(nextAdmins);

  return listAdminUsers();
}
