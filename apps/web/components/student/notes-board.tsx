"use client";

import { type FormEvent, useEffect, useState } from "react";

type StudyNote = {
  id: string;
  title: string;
  course: string;
  content: string;
  createdAt: string;
};

const storageKey = "studybyeapa_notes";

const starterNotes: StudyNote[] = [
  {
    id: "starter-anatomia",
    title: "Tórax y costillas",
    course: "Anatomía",
    content: "Repasar límites, relaciones y correlación clínica con dolor torácico.",
    createdAt: new Date().toISOString(),
  },
];

export function NotesBoard() {
  const [notes, setNotes] = useState<StudyNote[]>(starterNotes);
  const [selectedNoteId, setSelectedNoteId] = useState(starterNotes[0]?.id ?? "");

  useEffect(() => {
    try {
      const storedNotes = window.localStorage.getItem(storageKey);

      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes) as StudyNote[];
        if (Array.isArray(parsedNotes) && parsedNotes.length) {
          setNotes(parsedNotes);
          setSelectedNoteId(parsedNotes[0].id);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch {}
  }, [notes]);

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? notes[0] ?? null;

  function handleAddNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const course = String(formData.get("course") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    if (!title || !content) {
      return;
    }

    const nextNote = {
      id: `note-${Date.now()}`,
      title,
      course: course || "General",
      content,
      createdAt: new Date().toISOString(),
    };

    setNotes((current) => [nextNote, ...current]);
    setSelectedNoteId(nextNote.id);
    event.currentTarget.reset();
  }

  function deleteSelectedNote() {
    if (!selectedNote) {
      return;
    }

    const remainingNotes = notes.filter((note) => note.id !== selectedNote.id);
    setNotes(remainingNotes);
    setSelectedNoteId(remainingNotes[0]?.id ?? "");
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
            <button className="secondary-btn small-pill-eapa" onClick={deleteSelectedNote} type="button">
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

      <form className="soft-card student-tool-form-eapa" onSubmit={handleAddNote}>
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
      </form>
    </section>
  );
}
