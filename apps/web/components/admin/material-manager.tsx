"use client";

import { useMemo, useState } from "react";

type MaterialRow = {
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  moduleTitle: string;
  sourceTitle: string;
  content: string;
  updatedAt: string | null;
};

type MaterialManagerProps = {
  lessons: MaterialRow[];
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function MaterialManager({ lessons }: MaterialManagerProps) {
  const [selectedLessonId, setSelectedLessonId] = useState(
    lessons[0]?.lessonId ?? "",
  );
  const selectedLesson = useMemo(
    () =>
      lessons.find((lesson) => lesson.lessonId === selectedLessonId) ??
      lessons[0] ??
      null,
    [lessons, selectedLessonId],
  );
  const [drafts, setDrafts] = useState<Record<string, MaterialRow>>(
    Object.fromEntries(lessons.map((lesson) => [lesson.lessonId, lesson])),
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  const draft = selectedLesson
    ? (drafts[selectedLesson.lessonId] ?? selectedLesson)
    : null;

  function updateDraft(field: "sourceTitle" | "content", value: string) {
    if (!selectedLesson) {
      return;
    }

    setDrafts((current) => ({
      ...current,
      [selectedLesson.lessonId]: {
        ...(current[selectedLesson.lessonId] ?? selectedLesson),
        [field]: value,
      },
    }));
    setSaveState("idle");
    setMessage("");
  }

  async function saveMaterial() {
    if (!draft) {
      return;
    }

    setSaveState("saving");
    setMessage("");

    const response = await fetch("/api/admin/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lessonId: draft.lessonId,
        sourceTitle: draft.sourceTitle,
        content: draft.content,
      }),
    });

    const payload = (await response.json()) as {
      material?: {
        sourceTitle: string;
        content: string;
        updatedAt: string;
      };
      message?: string;
    };

    if (!response.ok || !payload.material) {
      setSaveState("error");
      setMessage(payload.message ?? "No se pudo guardar el material.");
      return;
    }

    setDrafts((current) => ({
      ...current,
      [draft.lessonId]: {
        ...draft,
        sourceTitle: payload.material?.sourceTitle ?? draft.sourceTitle,
        content: payload.material?.content ?? draft.content,
        updatedAt: payload.material?.updatedAt ?? new Date().toISOString(),
      },
    }));
    setSaveState("saved");
    setMessage("Material guardado. La IA ya lo usara para esta leccion.");
  }

  if (!selectedLesson || !draft) {
    return (
      <p className="empty-copy">
        Todavia no hay lecciones disponibles para cargar material.
      </p>
    );
  }

  return (
    <div className="material-manager">
      <div className="material-manager-toolbar">
        <label className="material-field material-field-wide">
          Leccion
          <select
            className="material-input"
            onChange={(event) => {
              setSelectedLessonId(event.target.value);
              setSaveState("idle");
              setMessage("");
            }}
            value={selectedLesson.lessonId}
          >
            {lessons.map((lesson) => (
              <option key={lesson.lessonId} value={lesson.lessonId}>
                {lesson.courseTitle} · {lesson.lessonTitle}
              </option>
            ))}
          </select>
        </label>

        <div className="material-status-card">
          <span>{selectedLesson.courseTitle}</span>
          <strong>{selectedLesson.moduleTitle}</strong>
          <small>
            {draft.updatedAt
              ? `Actualizado ${new Date(draft.updatedAt).toLocaleDateString("es-DO")}`
              : "Sin material guardado"}
          </small>
        </div>
      </div>

      <label className="material-field">
        Titulo o fuente del material
        <input
          className="material-input"
          onChange={(event) => updateDraft("sourceTitle", event.target.value)}
          placeholder="Ejemplo: Guia de antibioticos, clase 1, lectura oficial..."
          value={draft.sourceTitle}
        />
      </label>

      <label className="material-field">
        Material real de la leccion
        <textarea
          className="material-textarea"
          onChange={(event) => updateDraft("content", event.target.value)}
          placeholder="Pega aqui tus apuntes, guia, transcripcion del video, resumen docente o lectura. La IA usara este contenido para generar flashcards y preguntas."
          value={draft.content}
        />
      </label>

      <div className="material-actions">
        <button
          className="primary-action"
          disabled={saveState === "saving"}
          onClick={saveMaterial}
          type="button"
        >
          {saveState === "saving" ? "Guardando..." : "Guardar material para IA"}
        </button>
        <span className="material-counter">
          {draft.content.trim().length.toLocaleString("es-DO")} caracteres
        </span>
      </div>

      {message ? (
        <p
          className={
            saveState === "error"
              ? "form-message form-message-error"
              : "form-message form-message-success"
          }
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
