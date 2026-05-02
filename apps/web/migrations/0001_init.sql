CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  university TEXT NOT NULL DEFAULT '',
  profile_note TEXT NOT NULL DEFAULT '',
  enrolled_course_slugs TEXT NOT NULL DEFAULT '[]',
  subscriptions TEXT NOT NULL DEFAULT '[]',
  devices TEXT NOT NULL DEFAULT '[]',
  password_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_students_email ON students (email);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students (created_at);

CREATE TABLE IF NOT EXISTS lesson_materials (
  lesson_id TEXT PRIMARY KEY,
  source_title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lesson_materials_updated_at ON lesson_materials (updated_at);
