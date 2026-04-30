import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

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
  const dataFile = await resolveWritableDataFile();
  const raw = await fs.readFile(dataFile, "utf8");

  try {
    return JSON.parse(raw) as LessonMaterial[];
  } catch {
    return [];
  }
}

async function writeMaterials(materials: LessonMaterial[]) {
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
