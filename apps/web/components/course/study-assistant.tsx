"use client";

import type { Lesson } from "@academia/shared";
import { useMemo, useState } from "react";

type AskResponse = {
  title: string;
  answer: string;
};

type FlashcardsResponse = {
  title: string;
  module: string | null;
  cards: Array<{
    question: string;
    answer: string;
  }>;
};

type QuizQuestion = {
  prompt: string;
  level: string;
  options: string[];
  correctOption: string;
  explanation: string;
};

type QuizResponse = {
  title: string;
  module: string | null;
  questions: QuizQuestion[];
};

type AssistantResponse = AskResponse | FlashcardsResponse | QuizResponse;

type StudyAssistantProps = {
  courseSlug: string;
  lessons: Lesson[];
};

function isFlashcardsResponse(
  payload: AssistantResponse,
): payload is FlashcardsResponse {
  return "cards" in payload;
}

function isQuizResponse(
  payload: AssistantResponse,
): payload is QuizResponse {
  return "questions" in payload;
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
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === selectedLessonId) ?? null,
    [lessons, selectedLessonId],
  );

  async function sendAction(action: "ask" | "flashcards" | "quiz" | "exam") {
    setLoadingAction(action);
    setError("");
    setFlippedCards({});
    setSelectedOptions({});

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

  function toggleCard(index: number) {
    setFlippedCards((current) => ({
      ...current,
      [index]: !current[index],
    }));
  }

  function chooseOption(questionIndex: number, option: string) {
    setSelectedOptions((current) => ({
      ...current,
      [questionIndex]: option,
    }));
  }

  return (
    <section className="study-assistant-card">
      <div className="study-assistant-grid">
        <div className="study-assistant-controls">
          <div className="section-heading">
            <span>IA del curso</span>
            <h2>Pregunta, repasa y genera contenido real</h2>
          </div>

          <label className="assistant-label">
            Lección
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
            Dificultad del banco de preguntas
            <select
              className="assistant-select"
              onChange={(event) => setDifficulty(event.target.value)}
              value={difficulty}
            >
              <option value="basico">Básico</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
              <option value="residente">Residente</option>
            </select>
          </label>

          <label className="assistant-label">
            Pregunta o instrucción
            <textarea
              className="assistant-textarea"
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ejemplo: resúmeme este tema, genera flashcards o crea preguntas estilo residente."
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
              {loadingAction === "flashcards" ? "Generando..." : "Generar flashcards"}
            </button>
            <button
              className="eapa-button eapa-button-secondary"
              onClick={() => sendAction("quiz")}
              type="button"
            >
              {loadingAction === "quiz" ? "Creando..." : "Banco de preguntas"}
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
              Lección seleccionada: <strong>{selectedLesson.title}</strong>
            </p>
          ) : null}
          {error ? <p className="form-message form-message-error">{error}</p> : null}
        </div>

        <div className="study-assistant-output">
          {response ? (
            <article className="assistant-result-card">
              <p className="course-category">{response.title}</p>

              {"answer" in response ? (
                <div className="assistant-answer-block">
                  <p>{response.answer}</p>
                </div>
              ) : null}

              {isFlashcardsResponse(response) ? (
                <div className="flashcards-grid">
                  {response.cards.map((card, index) => {
                    const isFlipped = flippedCards[index] ?? false;

                    return (
                      <button
                        className={isFlipped ? "flashcard-item is-flipped" : "flashcard-item"}
                        key={`${card.question}-${index}`}
                        onClick={() => toggleCard(index)}
                        type="button"
                      >
                        <span className="flashcard-face-label">
                          {isFlipped ? "Respuesta" : "Pregunta"}
                        </span>
                        <strong>{isFlipped ? card.answer : card.question}</strong>
                        <small>Toca para girar</small>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {isQuizResponse(response) ? (
                <div className="assistant-list">
                  {response.questions.map((item, index) => {
                    const selectedOption = selectedOptions[index];
                    const reveal = Boolean(selectedOption);
                    const correct = selectedOption === item.correctOption;

                    return (
                      <article className="assistant-list-item assistant-question-card" key={`${item.prompt}-${index}`}>
                        <strong>
                          {index + 1}. {item.prompt}
                        </strong>
                        <p>Nivel: {item.level}</p>
                        <div className="question-options-grid">
                          {item.options.map((option) => {
                            const isCorrectOption = option === item.correctOption;
                            const isChosen = selectedOption === option;
                            const className = reveal
                              ? isCorrectOption
                                ? "question-option is-correct"
                                : isChosen
                                  ? "question-option is-wrong"
                                  : "question-option"
                              : "question-option";

                            return (
                              <button
                                className={className}
                                disabled={reveal}
                                key={option}
                                onClick={() => chooseOption(index, option)}
                                type="button"
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                        {reveal ? (
                          <div className={correct ? "question-feedback is-correct" : "question-feedback is-wrong"}>
                            <p>
                              <strong>Correcta:</strong> {item.correctOption}
                            </p>
                            <p>{item.explanation}</p>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              ) : null}
            </article>
          ) : (
            <article className="assistant-result-card assistant-result-card-empty">
              <p className="course-category">Asistente listo</p>
              <h3>Usa OpenAI dentro del curso</h3>
              <p>
                Puedes hacer preguntas, generar flashcards que se voltean,
                crear bancos de preguntas con opciones y usar modo residente
                con preguntas más complejas.
              </p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
