"use client";

import { useEffect, useMemo, useState } from "react";

type MaterialRow = {
  lessonId: string;
  lessonTitle: string;
  courseSlug: string;
  moduleId: string;
  courseTitle: string;
  moduleTitle: string;
  lessonOrder: number;
  contentType: "video" | "reading";
  sourceTitle: string;
  content: string;
  updatedAt: string | null;
};

type MaterialManagerProps = {
  lessons: MaterialRow[];
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function MaterialManager({ lessons }: MaterialManagerProps) {
  const [courseFilter, setCourseFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState(
    lessons[0]?.lessonId ?? "",
  );
  const [drafts, setDrafts] = useState<Record<string, MaterialRow>>(
    Object.fromEntries(lessons.map((lesson) => [lesson.lessonId, lesson])),
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  const courses = useMemo(() => {
    const uniqueCourses = new Map<string, string>();

    lessons.forEach((lesson) => {
      uniqueCourses.set(lesson.courseSlug, lesson.courseTitle);
    });

    return Array.from(uniqueCourses, ([slug, title]) => ({ slug, title }));
  }, [lessons]);

  const modules = useMemo(() => {
    const uniqueModules = new Map<string, { id: string; title: string; courseSlug: string }>();

    lessons.forEach((lesson) => {
      if (courseFilter !== "all" && lesson.courseSlug !== courseFilter) {
        return;
      }

      uniqueModules.set(lesson.moduleId, {
        id: lesson.moduleId,
        title: lesson.moduleTitle,
        courseSlug: lesson.courseSlug,
      });
    });

    return Array.from(uniqueModules.values());
  }, [courseFilter, lessons]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredLessons = useMemo(
    () =>
      lessons
        .filter((lesson) => {
          const draftLesson = drafts[lesson.lessonId] ?? lesson;
          const matchesCourse = courseFilter === "all" || lesson.courseSlug === courseFilter;
          const matchesModule = moduleFilter === "all" || lesson.moduleId === moduleFilter;
          const matchesQuery = normalizedQuery
            ? `${lesson.courseTitle} ${lesson.moduleTitle} ${lesson.lessonTitle} ${draftLesson.sourceTitle}`
                .toLowerCase()
                .includes(normalizedQuery)
            : true;

          return matchesCourse && matchesModule && matchesQuery;
        })
        .sort((left, right) => {
          if (left.courseTitle !== right.courseTitle) {
            return left.courseTitle.localeCompare(right.courseTitle);
          }

          if (left.moduleTitle !== right.moduleTitle) {
            return left.moduleTitle.localeCompare(right.moduleTitle);
          }

          return left.lessonOrder - right.lessonOrder;
        }),
    [courseFilter, drafts, lessons, moduleFilter, normalizedQuery],
  );

  const selectedLesson = useMemo(
    () =>
      lessons.find((lesson) => lesson.lessonId === selectedLessonId) ??
      filteredLessons[0] ??
      lessons[0] ??
      null,
    [filteredLessons, lessons, selectedLessonId],
  );
  const draft = selectedLesson
    ? (drafts[selectedLesson.lessonId] ?? selectedLesson)
    : null;
  const materialStats = useMemo(() => {
    const readyLessons = Object.values(drafts).filter(
      (lesson) => lesson.content.trim().length >= 80,
    ).length;
    const savedLessons = Object.values(drafts).filter((lesson) => lesson.updatedAt).length;
    const percentage = lessons.length
      ? Math.round((readyLessons / lessons.length) * 100)
      : 0;

    return {
      readyLessons,
      savedLessons,
      percentage,
    };
  }, [drafts, lessons.length]);
  const selectedWordCount = draft
    ? draft.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  useEffect(() => {
    if (!filteredLessons.length) {
      return;
    }

    if (!filteredLessons.some((lesson) => lesson.lessonId === selectedLessonId)) {
      setSelectedLessonId(filteredLessons[0].lessonId);
    }
  }, [filteredLessons, selectedLessonId]);

  useEffect(() => {
    setModuleFilter("all");
  }, [courseFilter]);

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

  async function importTextFile(file: File | null) {
    if (!file || !selectedLesson) {
      return;
    }

    if (!file.name.match(/\.(txt|md|markdown)$/i)) {
      setSaveState("error");
      setMessage("Por ahora importa archivos .txt o .md. Los PDF los conectamos en el próximo paso.");
      return;
    }

    const text = await file.text();

    setDrafts((current) => ({
      ...current,
      [selectedLesson.lessonId]: {
        ...(current[selectedLesson.lessonId] ?? selectedLesson),
        sourceTitle:
          current[selectedLesson.lessonId]?.sourceTitle?.trim() ||
          file.name.replace(/\.(txt|md|markdown)$/i, ""),
        content: text,
      },
    }));
    setSaveState("idle");
    setMessage(`Importado "${file.name}". Revisa el texto y guarda para activar la IA.`);
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
    setMessage("Material guardado. La IA ya lo usará para esta lección.");
  }

  if (!selectedLesson || !draft) {
    return (
      <p className="empty-copy">
        Todavia no hay lecciones disponibles para cargar material.
      </p>
    );
  }

  return (
    <div className="material-manager material-manager-pro-eapa">
      <div className="material-overview-eapa">
        <article>
          <span>Lecciones listas</span>
          <strong>{materialStats.readyLessons}/{lessons.length}</strong>
          <div className="material-progress-eapa" aria-hidden="true">
            <i style={{ width: `${materialStats.percentage}%` }} />
          </div>
        </article>
        <article>
          <span>Guardadas en base</span>
          <strong>{materialStats.savedLessons}</strong>
          <small>D1 Cloudflare</small>
        </article>
        <article>
          <span>Uso de IA</span>
          <strong>Flashcards · Quiz · Residente</strong>
          <small>Basado en tu material real</small>
        </article>
      </div>

      <div className="material-manager-grid-eapa">
        <aside className="material-library-eapa">
          <div className="material-filter-stack-eapa">
            <label className="material-field">
              Curso
              <select
                className="material-input"
                onChange={(event) => setCourseFilter(event.target.value)}
                value={courseFilter}
              >
                <option value="all">Todos los cursos</option>
                {courses.map((course) => (
                  <option key={course.slug} value={course.slug}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="material-field">
              Módulo
              <select
                className="material-input"
                onChange={(event) => setModuleFilter(event.target.value)}
                value={moduleFilter}
              >
                <option value="all">Todos los módulos</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="material-field">
              Buscar
              <input
                className="material-input"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar lección o fuente..."
                type="search"
                value={query}
              />
            </label>
          </div>

          <div className="material-lesson-list-eapa">
            {filteredLessons.length ? (
              filteredLessons.map((lesson) => {
                const lessonDraft = drafts[lesson.lessonId] ?? lesson;
                const isReady = lessonDraft.content.trim().length >= 80;
                const isSelected = lesson.lessonId === selectedLesson.lessonId;

                return (
                  <button
                    key={lesson.lessonId}
                    className={isSelected ? "is-active" : ""}
                    onClick={() => {
                      setSelectedLessonId(lesson.lessonId);
                      setSaveState("idle");
                      setMessage("");
                    }}
                    type="button"
                  >
                    <span>{lesson.courseTitle}</span>
                    <strong>{lesson.lessonOrder}. {lesson.lessonTitle}</strong>
                    <small>
                      {isReady ? "Material listo" : "Pendiente"} · {lesson.contentType === "video" ? "Video" : "Lectura"}
                    </small>
                  </button>
                );
              })
            ) : (
              <p className="empty-copy">No hay lecciones con esos filtros.</p>
            )}
          </div>
        </aside>

        <section className="material-editor-eapa">
          <div className="material-status-card material-editor-head-eapa">
            <div>
              <span>{selectedLesson.courseTitle}</span>
              <strong>{selectedLesson.moduleTitle}</strong>
              <small>
                {draft.updatedAt
                  ? `Actualizado ${new Date(draft.updatedAt).toLocaleDateString("es-DO")}`
                  : "Sin material guardado"}
              </small>
            </div>
            <b>{selectedLesson.contentType === "video" ? "Video" : "Lectura"}</b>
          </div>

          <label className="material-field">
            Título o fuente del material
            <input
              className="material-input"
              onChange={(event) => updateDraft("sourceTitle", event.target.value)}
              placeholder="Ejemplo: Guía de antibióticos, clase 1, lectura oficial..."
              value={draft.sourceTitle}
            />
          </label>

          <label className="material-field">
            Material real de la lección
            <textarea
              className="material-textarea material-textarea-large-eapa"
              onChange={(event) => updateDraft("content", event.target.value)}
              placeholder="Pega aquí tus apuntes, guía, transcripción del video, resumen docente o lectura. La IA usará este contenido para generar flashcards y preguntas."
              value={draft.content}
            />
          </label>

          <div className="material-actions material-actions-between-eapa">
            <div className="material-import-eapa">
              <label>
                Importar .txt/.md
                <input
                  accept=".txt,.md,.markdown,text/plain,text/markdown"
                  onChange={(event) => {
                    void importTextFile(event.target.files?.[0] ?? null);
                    event.target.value = "";
                  }}
                  type="file"
                />
              </label>
              <span className="material-counter">
                {draft.content.trim().length.toLocaleString("es-DO")} caracteres · {selectedWordCount.toLocaleString("es-DO")} palabras
              </span>
            </div>

            <button
              className="primary-action"
              disabled={saveState === "saving"}
              onClick={saveMaterial}
              type="button"
            >
              {saveState === "saving" ? "Guardando..." : "Guardar material para IA"}
            </button>
          </div>

          <div className="material-ai-readiness-eapa">
            <span className={draft.content.trim().length >= 80 ? "is-ready" : ""}>
              Flashcards con giro
            </span>
            <span className={draft.content.trim().length >= 80 ? "is-ready" : ""}>
              Banco de preguntas
            </span>
            <span className={draft.content.trim().length >= 80 ? "is-ready" : ""}>
              Modo residente
            </span>
          </div>
        </section>
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
