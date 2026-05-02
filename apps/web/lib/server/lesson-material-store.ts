import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { getStudyDatabase, type StudyDatabase } from "./cloudflare-db";

export type LessonMaterial = {
  lessonId: string;
  sourceTitle: string;
  content: string;
  updatedAt: string;
};

type UpsertLessonMaterialInput = {
  lessonId: string;
  sourceTitle: string;
  content: string;
};

type LessonMaterialRow = {
  lesson_id: string;
  source_title: string;
  content: string;
  updated_at: string;
};

function getPreferredDataFilePath() {
  const cwd = process.cwd();

  if (path.basename(cwd) === "web") {
    return path.join(cwd, "data/lesson-materials.json");
  }

  return path.join(cwd, "apps/web/data/lesson-materials.json");
}

const DATA_FILE_CANDIDATES = [
  getPreferredDataFilePath(),
  path.join(process.cwd(), "data/lesson-materials.json"),
  path.join(process.cwd(), "apps/web/data/lesson-materials.json"),
];

const TEMP_DATA_FILE = path.join(os.tmpdir(), "studybyeapa", "lesson-materials.json");

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

async function readMaterials() {
  const db = getStudyDatabase();

  if (db) {
    const { results = [] } = await db
      .prepare(
        `SELECT lesson_id, source_title, content, updated_at
        FROM lesson_materials
        ORDER BY updated_at DESC`,
      )
      .all<LessonMaterialRow>();

    return results.map((row) => ({
      lessonId: row.lesson_id,
      sourceTitle: row.source_title,
      content: row.content,
      updatedAt: row.updated_at,
    }));
  }

  const dataFile = await resolveWritableDataFile();
  const raw = await fs.readFile(dataFile, "utf8");

  try {
    return JSON.parse(raw) as LessonMaterial[];
  } catch {
    return [];
  }
}

async function upsertD1Material(db: StudyDatabase, material: LessonMaterial) {
  await db
    .prepare(
      `INSERT INTO lesson_materials (lesson_id, source_title, content, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(lesson_id) DO UPDATE SET
        source_title = excluded.source_title,
        content = excluded.content,
        updated_at = excluded.updated_at`,
    )
    .bind(
      material.lessonId,
      material.sourceTitle,
      material.content,
      material.updatedAt,
    )
    .run();
}

async function writeMaterials(materials: LessonMaterial[]) {
  const db = getStudyDatabase();

  if (db) {
    for (const material of materials) {
      await upsertD1Material(db, material);
    }

    return;
  }

  const dataFile = await resolveWritableDataFile();
  await fs.writeFile(dataFile, JSON.stringify(materials, null, 2), "utf8");
}

export async function listLessonMaterials() {
  return readMaterials();
}

export async function getLessonMaterialByLessonId(lessonId: string) {
  const materials = await readMaterials();
  return materials.find((material) => material.lessonId === lessonId) ?? null;
}

export async function upsertLessonMaterial(input: UpsertLessonMaterialInput) {
  const materials = await readMaterials();
  const existingMaterial = materials.find(
    (material) => material.lessonId === input.lessonId,
  );
  const nextMaterial: LessonMaterial = {
    lessonId: input.lessonId,
    sourceTitle: input.sourceTitle.trim() || "Material de estudio",
    content: input.content.trim(),
    updatedAt: new Date().toISOString(),
  };

  if (existingMaterial) {
    existingMaterial.sourceTitle = nextMaterial.sourceTitle;
    existingMaterial.content = nextMaterial.content;
    existingMaterial.updatedAt = nextMaterial.updatedAt;
  } else {
    materials.push(nextMaterial);
  }

  await writeMaterials(materials);

  return nextMaterial;
}
