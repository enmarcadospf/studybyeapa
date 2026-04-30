"use client";

import type { Lesson } from "@academia/shared";
import { useMemo, useState } from "react";

type AssistantResponse =
  | {
      title: string;
      answer: string;
    }
  | {
      title: string;
      module: string | null;
      cards: Array<{
        question: string;
        answer: string;
      }>;
    }
  | {
      title: string;
      module: string | null;
      questions: Array<{
        prompt: string;
        level: string;
      }>;
    }
  | {
      title: string;
      module: string | null;
      exam: {
        format: string;
        focus: string[];
      };
    };

type StudyAssistantProps = {
  courseSlug: string;
  lessons: Lesson[];
};

function isCardsResponse(
  payload: AssistantResponse,
): payload is Extract<AssistantResponse, { cards: { question: string; answer: string }[] }> {
  return "cards" in payload;
}

function isQuizResponse(
  payload: AssistantResponse,
): payload is Extract<AssistantResponse, { questions: { prompt: string; level: string }[] }> {
  return "questions" in payload;
}

function isExamResponse(
  payload: AssistantResponse,
): payload is Extract<AssistantResponse, { exam: { format: string; focus: string[] } }> {
  return "exam" in payload;
}

export function StudyAssistant({
  courseSlug,
  lessons,
}: StudyAssistantProps) {
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0]?.id ?? "");
  const [question, setQuestion] = useState("");
  const [difficulty, setDifficulty] = useState("intermedio");
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [loadingAction, setLoadingAction] = useState("");
  const [error, setError] = useState("");

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === selectedLessonId) ?? null,
    [lessons, selectedLessonId],
  );

  async function sendAction(action: "ask" | "flashcards" | "quiz" | "exam") {
    setLoadingAction(action);
    setError("");

    const result = await fetch("/api/ai/study", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseSlug,
        lessonId: selectedLessonId || undefined,
        action,
        question,
        difficulty,
      }),
    });

    const payload = (await result.json()) as AssistantResponse & { message?: string };

    if (!result.ok) {
      setError(payload.message ?? "No se pudo generar el contenido.");
      setLoadingAction("");
      return;
    }

    setResponse(payload);
    setLoadingAction("");
  }

  return (
    <section className="study-assistant-card">
      <div className="study-assistant-grid">
        <div className="study-assistant-controls">
          <div className="section-heading">
            <span>IA del curso</span>
            <h2>Pregunta, repasa y genera contenido</h2>
          </div>

          <label className="assistant-label">
            Leccion
            <select
              className="assistant-select"
              onChange={(event) => setSelectedLessonId(event.target.value)}
              value={selectedLessonId}
            >
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.order}. {lesson.title}
                </option>
              ))}
            </select>
          </label>

          <label className="assistant-label">
            Dificultad del quiz
            <select
              className="assistant-select"
              onChange={(event) => setDifficulty(event.target.value)}
              value={difficulty}
            >
              <option value="basico">Basico</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
              <option value="residente">Residente</option>
            </select>
          </label>

          <label className="assistant-label">
            Escribe tu duda
            <textarea
              className="assistant-textarea"
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ejemplo: hazme un resumen de esta leccion y luego un quiz residente."
              rows={6}
              value={question}
            />
          </label>

          <div className="assistant-action-row">
            <button
              className="eapa-button"
              onClick={() => sendAction("ask")}
              type="button"
            >
              {loadingAction === "ask" ? "Pensando..." : "Preguntar"}
            </button>
            <button
              className="eapa-button eapa-button-secondary"
              onClick={() => sendAction("flashcards")}
              type="button"
            >
              {loadingAction === "flashcards" ? "Generando..." : "Crear flashcards"}
            </button>
            <button
              className="eapa-button eapa-button-secondary"
              onClick={() => sendAction("quiz")}
              type="button"
            >
              {loadingAction === "quiz" ? "Preparando..." : "Crear quiz"}
            </button>
            <button
              className="eapa-button eapa-button-ghost"
              onClick={() => sendAction("exam")}
              type="button"
            >
              {loadingAction === "exam" ? "Armando..." : "Modo residente"}
            </button>
          </div>

          {selectedLesson ? (
            <p className="assistant-meta-copy">
              Leccion seleccionada: <strong>{selectedLesson.title}</strong>
            </p>
          ) : null}
          {error ? <p className="form-message form-message-error">{error}</p> : null}
        </div>

        <div className="study-assistant-output">
          {response ? (
            <article className="assistant-result-card">
              <p className="course-category">{response.title}</p>
              {"answer" in response ? <p>{response.answer}</p> : null}

              {isCardsResponse(response) ? (
                <div className="assistant-list">
                  {response.cards.map((card) => (
                    <article className="assistant-list-item" key={card.question}>
                      <strong>{card.question}</strong>
                      <p>{card.answer}</p>
                    </article>
                  ))}
                </div>
              ) : null}

              {isQuizResponse(response) ? (
                <div className="assistant-list">
                  {response.questions.map((item, index) => (
                    <article className="assistant-list-item" key={item.prompt}>
                      <strong>
                        {index + 1}. {item.prompt}
                      </strong>
                      <p>Nivel: {item.level}</p>
                    </article>
                  ))}
                </div>
              ) : null}

              {isExamResponse(response) ? (
                <div className="assistant-list">
                  <article className="assistant-list-item">
                    <strong>{response.exam.format}</strong>
                    {response.exam.focus.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </article>
                </div>
              ) : null}
            </article>
          ) : (
            <article className="assistant-result-card assistant-result-card-empty">
              <p className="course-category">Asistente listo</p>
              <h3>Usa la IA del curso desde aqui</h3>
              <p>
                Puedes escribir una pregunta, pedir un resumen, generar
                flashcards o crear un quiz desde la leccion seleccionada.
              </p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
