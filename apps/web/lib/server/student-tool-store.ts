import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { getStudyDatabase } from "./cloudflare-db";

export type EventTone = "medium" | "light" | "orange" | "navy";

export type StudyCalendarEvent = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  subtitle: string;
  tone: EventTone;
  createdAt: string;
};

export type StudyNote = {
  id: string;
  title: string;
  course: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type StudentToolsFile = {
  calendarEvents: (StudyCalendarEvent & { studentId: string })[];
  notes: (StudyNote & { studentId: string })[];
};

type CalendarEventRow = {
  id: string;
  event_date: string;
  start_time: string;
  end_time: string;
  title: string;
  subtitle: string;
  tone: EventTone;
  created_at: string;
};

type NoteRow = {
  id: string;
  title: string;
  course: string;
  content: string;
  created_at: string;
  updated_at: string;
};

type CreateCalendarEventInput = {
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  subtitle: string;
};

type CreateNoteInput = {
  title: string;
  course: string;
  content: string;
};

const TEMP_DATA_FILE = path.join(os.tmpdir(), "studybyeapa", "student-tools.json");

function getPreferredDataFilePath() {
  const cwd = process.cwd();

  if (path.basename(cwd) === "web") {
    return path.join(cwd, "data/student-tools.json");
  }

  return path.join(cwd, "apps/web/data/student-tools.json");
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
    await fs.writeFile(
      writableDataFile,
      JSON.stringify({ calendarEvents: [], notes: [] }, null, 2),
      "utf8",
    );
  }

  return writableDataFile;
}

async function readStudentToolsFile(): Promise<StudentToolsFile> {
  const dataFile = await resolveWritableDataFile();
  const raw = await fs.readFile(dataFile, "utf8");

  try {
    const parsed = JSON.parse(raw) as StudentToolsFile;

    return {
      calendarEvents: Array.isArray(parsed.calendarEvents) ? parsed.calendarEvents : [],
      notes: Array.isArray(parsed.notes) ? parsed.notes : [],
    };
  } catch {
    return { calendarEvents: [], notes: [] };
  }
}

async function writeStudentToolsFile(data: StudentToolsFile) {
  const dataFile = await resolveWritableDataFile();
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf8");
}

function sanitizeTone(tone: string): EventTone {
  return tone === "light" || tone === "orange" || tone === "navy" ? tone : "medium";
}

function rowToCalendarEvent(row: CalendarEventRow): StudyCalendarEvent {
  return {
    id: row.id,
    date: row.event_date,
    startTime: row.start_time,
    endTime: row.end_time,
    title: row.title,
    subtitle: row.subtitle,
    tone: sanitizeTone(row.tone),
    createdAt: row.created_at,
  };
}

function rowToNote(row: NoteRow): StudyNote {
  return {
    id: row.id,
    title: row.title,
    course: row.course,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listCalendarEvents(studentId: string) {
  const db = getStudyDatabase();

  if (db) {
    const { results = [] } = await db
      .prepare(
        `SELECT id, event_date, start_time, end_time, title, subtitle, tone, created_at
        FROM student_calendar_events
        WHERE student_id = ?
        ORDER BY event_date ASC, start_time ASC`,
      )
      .bind(studentId)
      .all<CalendarEventRow>();

    return results.map(rowToCalendarEvent);
  }

  const data = await readStudentToolsFile();

  return data.calendarEvents
    .filter((event) => event.studentId === studentId)
    .map(({ studentId: _studentId, ...event }) => event)
    .sort((left, right) => `${left.date}${left.startTime}`.localeCompare(`${right.date}${right.startTime}`));
}

export async function createCalendarEvent(studentId: string, input: CreateCalendarEventInput) {
  const now = new Date().toISOString();
  const event: StudyCalendarEvent = {
    id: randomUUID(),
    date: input.date.trim(),
    startTime: input.startTime.trim() || "08:00",
    endTime: input.endTime.trim() || "09:00",
    title: input.title.trim(),
    subtitle: input.subtitle.trim(),
    tone: "medium",
    createdAt: now,
  };

  const db = getStudyDatabase();

  if (db) {
    await db
      .prepare(
        `INSERT INTO student_calendar_events
        (id, student_id, event_date, start_time, end_time, title, subtitle, tone, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        event.id,
        studentId,
        event.date,
        event.startTime,
        event.endTime,
        event.title,
        event.subtitle,
        event.tone,
        event.createdAt,
      )
      .run();

    return event;
  }

  const data = await readStudentToolsFile();
  data.calendarEvents.push({ ...event, studentId });
  await writeStudentToolsFile(data);

  return event;
}

export async function deleteCalendarEvent(studentId: string, eventId: string) {
  const db = getStudyDatabase();

  if (db) {
    await db
      .prepare("DELETE FROM student_calendar_events WHERE student_id = ? AND id = ?")
      .bind(studentId, eventId)
      .run();

    return;
  }

  const data = await readStudentToolsFile();
  data.calendarEvents = data.calendarEvents.filter(
    (event) => event.studentId !== studentId || event.id !== eventId,
  );
  await writeStudentToolsFile(data);
}

export async function listStudyNotes(studentId: string) {
  const db = getStudyDatabase();

  if (db) {
    const { results = [] } = await db
      .prepare(
        `SELECT id, title, course, content, created_at, updated_at
        FROM student_notes
        WHERE student_id = ?
        ORDER BY updated_at DESC`,
      )
      .bind(studentId)
      .all<NoteRow>();

    return results.map(rowToNote);
  }

  const data = await readStudentToolsFile();

  return data.notes
    .filter((note) => note.studentId === studentId)
    .map(({ studentId: _studentId, ...note }) => note)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function createStudyNote(studentId: string, input: CreateNoteInput) {
  const now = new Date().toISOString();
  const note: StudyNote = {
    id: randomUUID(),
    title: input.title.trim(),
    course: input.course.trim() || "General",
    content: input.content.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const db = getStudyDatabase();

  if (db) {
    await db
      .prepare(
        `INSERT INTO student_notes
        (id, student_id, title, course, content, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        note.id,
        studentId,
        note.title,
        note.course,
        note.content,
        note.createdAt,
        note.updatedAt,
      )
      .run();

    return note;
  }

  const data = await readStudentToolsFile();
  data.notes.push({ ...note, studentId });
  await writeStudentToolsFile(data);

  return note;
}

export async function deleteStudyNote(studentId: string, noteId: string) {
  const db = getStudyDatabase();

  if (db) {
    await db
      .prepare("DELETE FROM student_notes WHERE student_id = ? AND id = ?")
      .bind(studentId, noteId)
      .run();

    return;
  }

  const data = await readStudentToolsFile();
  data.notes = data.notes.filter(
    (note) => note.studentId !== studentId || note.id !== noteId,
  );
  await writeStudentToolsFile(data);
}
