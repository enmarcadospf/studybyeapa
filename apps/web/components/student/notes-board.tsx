"use client";

import { type FormEvent, useState } from "react";

type StudyNote = {
  id: string;
  title: string;
  course: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type NotesBoardProps = {
  initialNotes: StudyNote[];
};

const starterNotes: StudyNote[] = [
  {
    id: "starter-anatomia",
    title: "Tórax y costillas",
    course: "Anatomía",
    content: "Repasar límites, relaciones y correlación clínica con dolor torácico.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function NotesBoard({ initialNotes }: NotesBoardProps) {
  const [notes, setNotes] = useState<StudyNote[]>(
    initialNotes.length ? initialNotes : starterNotes,
  );
  const [selectedNoteId, setSelectedNoteId] = useState(
    (initialNotes[0] ?? starterNotes[0])?.id ?? "",
  );
  const [message, setMessage] = useState("");
  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? notes[0] ?? null;

  async function handleAddNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const course = String(formData.get("course") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    if (!title || !content) {
      setMessage("Completa título y contenido.");
      return;
    }

    const response = await fetch("/api/student/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        course: course || "General",
        content,
      }),
    });
    const payload = (await response.json()) as {
      note?: StudyNote;
      message?: string;
    };

    if (!response.ok || !payload.note) {
      setMessage(payload.message ?? "No se pudo guardar la nota.");
      return;
    }

    setNotes((current) => [payload.note as StudyNote, ...current]);
    setSelectedNoteId(payload.note.id);
    setMessage("Nota guardada en tu cuenta.");
    event.currentTarget.reset();
  }

  async function deleteSelectedNote() {
    if (!selectedNote) {
      return;
    }

    if (selectedNote.id.startsWith("starter-")) {
      const remainingNotes = notes.filter((note) => note.id !== selectedNote.id);
      setNotes(remainingNotes);
      setSelectedNoteId(remainingNotes[0]?.id ?? "");
      return;
    }

    setMessage("");
    const response = await fetch("/api/student/notes", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ noteId: selectedNote.id }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { message?: string };
      setMessage(payload.message ?? "No se pudo eliminar la nota.");
      return;
    }

    const remainingNotes = notes.filter((note) => note.id !== selectedNote.id);
    setNotes(remainingNotes);
    setSelectedNoteId(remainingNotes[0]?.id ?? "");
    setMessage("Nota eliminada.");
  }

  return (
    <section className="student-tool-grid-eapa">
      <aside className="soft-card student-tool-list-eapa">
        <h2>Mis notas</h2>
        <div className="student-note-list-eapa">
          {notes.map((note) => (
            <button
              className={note.id === selectedNote?.id ? "is-active" : ""}
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              type="button"
            >
              <strong>{note.title}</strong>
              <span>{note.course}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="soft-card student-tool-detail-eapa">
        {selectedNote ? (
          <>
            <span className="courses-eyebrow-eapa">{selectedNote.course}</span>
            <h2>{selectedNote.title}</h2>
            <p>{selectedNote.content}</p>
            <button className="secondary-btn small-pill-eapa" onClick={() => void deleteSelectedNote()} type="button">
              Eliminar nota
            </button>
          </>
        ) : (
          <div className="calendar-empty-eapa">
            <strong>Sin notas todavía.</strong>
            <p>Crea tu primera nota de estudio para verla aquí.</p>
          </div>
        )}
      </section>

      <form className="soft-card student-tool-form-eapa" onSubmit={(event) => void handleAddNote(event)}>
        <h2>Nueva nota</h2>
        <label>
          Título
          <input name="title" placeholder="Ej. Antibióticos beta-lactámicos" />
        </label>
        <label>
          Curso
          <input name="course" placeholder="Ej. Infectología" />
        </label>
        <label>
          Contenido
          <textarea name="content" placeholder="Escribe tu apunte..." />
        </label>
        <button className="primary-btn" type="submit">Guardar nota</button>
        {message ? <p className="form-message form-message-success">{message}</p> : null}
      </form>
    </section>
  );
}
