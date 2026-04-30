import {
  courses,
  lessons,
  modules,
  type Course,
  type Lesson,
} from "@academia/shared";
import { NextResponse } from "next/server";

type StudyAction = "ask" | "flashcards" | "quiz" | "exam";

type StudyRequest = {
  courseSlug?: string;
  lessonId?: string;
  action?: StudyAction;
  question?: string;
  difficulty?: "basico" | "intermedio" | "avanzado" | "residente";
};

type FlashcardsPayload = {
  title: string;
  module: string | null;
  cards: Array<{
    question: string;
    answer: string;
  }>;
};

type QuizPayload = {
  title: string;
  module: string | null;
  questions: Array<{
    prompt: string;
    level: string;
    options: string[];
    correctOption: string;
    explanation: string;
  }>;
};

type AskPayload = {
  title: string;
  answer: string;
};

function getCourseContext(courseSlug: string, lessonId?: string) {
  const course = courses.find((item) => item.slug === courseSlug) ?? null;
  const courseLesson = lessonId
    ? lessons.find((item) => item.id === lessonId && item.courseSlug === courseSlug) ?? null
    : null;
  const courseModule = courseLesson
    ? modules.find((item) => item.id === courseLesson.moduleId) ?? null
    : null;

  return { course, courseLesson, courseModule };
}

function buildContextBlock(course: Course, lesson: Lesson | null, moduleTitle: string | null) {
  return [
    `Curso: ${course.title}.`,
    `Resumen del curso: ${course.summary}.`,
    lesson ? `Leccion: ${lesson.title}.` : "Leccion no especificada.",
    moduleTitle ? `Modulo: ${moduleTitle}.` : "Modulo no especificado.",
    lesson ? `Tipo de contenido: ${lesson.contentType === "video" ? "video" : "lectura"}.` : null,
    lesson ? `Resumen de la leccion: ${lesson.summary}.` : null,
    lesson ? `Duracion estimada: ${lesson.durationMinutes} minutos.` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

async function createOpenAIResponse({
  instructions,
  input,
  schemaName,
  schema,
}: {
  instructions: string;
  input: string;
  schemaName: string;
  schema: Record<string, unknown>;
}) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Falta OPENAI_API_KEY en el servidor.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.5";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input,
      instructions,
      max_output_tokens: 1800,
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          strict: true,
          schema,
        },
      },
    }),
  });

  const payload = (await response.json()) as {
    output_text?: string;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "OpenAI devolvio un error.");
  }

  if (!payload.output_text) {
    throw new Error("OpenAI no devolvio contenido util.");
  }

  return JSON.parse(payload.output_text) as unknown;
}

async function generateAskPayload(course: Course, lesson: Lesson | null, moduleTitle: string | null, question: string) {
  const result = await createOpenAIResponse({
    instructions:
      "Eres el tutor IA de Study by EAPA. Explicas medicina de forma clara, amable, segura y educativa. No inventes datos concretos si el contexto es insuficiente. Responde en espanol sencillo para estudiantes de medicina.",
    input: [
      buildContextBlock(course, lesson, moduleTitle),
      `Pregunta del estudiante: ${question || "Dame un resumen util de esta leccion."}`,
      "Devuelve una respuesta corta, clara y enfocada en aprendizaje.",
    ].join("\n\n"),
    schemaName: "study_answer",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        answer: { type: "string" },
      },
      required: ["title", "answer"],
    },
  });

  return result as AskPayload;
}

async function generateFlashcardsPayload(course: Course, lesson: Lesson, moduleTitle: string | null) {
  const result = await createOpenAIResponse({
    instructions:
      "Eres el tutor IA de Study by EAPA. Genera flashcards medicas de alta utilidad para repaso. Cada tarjeta debe tener una pregunta clave al frente y una respuesta corta y precisa al reverso.",
    input: [
      buildContextBlock(course, lesson, moduleTitle),
      "Genera 6 flashcards basadas en ideas clave, definiciones, relaciones clinicas y datos de examen.",
    ].join("\n\n"),
    schemaName: "study_flashcards",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        module: { type: ["string", "null"] },
        cards: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              question: { type: "string" },
              answer: { type: "string" },
            },
            required: ["question", "answer"],
          },
        },
      },
      required: ["title", "module", "cards"],
    },
  });

  return result as FlashcardsPayload;
}

async function generateQuizPayload({
  course,
  lesson,
  moduleTitle,
  difficulty,
  residentMode,
}: {
  course: Course;
  lesson: Lesson;
  moduleTitle: string | null;
  difficulty: string;
  residentMode: boolean;
}) {
  const result = await createOpenAIResponse({
    instructions:
      "Eres el tutor IA de Study by EAPA. Genera preguntas de seleccion multiple en espanol. Siempre incluye 4 opciones plausibles, indica la correcta y da una explicacion breve. Si el modo es residente, eleva claramente la dificultad y el razonamiento clinico.",
    input: [
      buildContextBlock(course, lesson, moduleTitle),
      residentMode
        ? "Genera 5 preguntas muy dificiles, complejas, estilo residente, con razonamiento clinico."
        : `Genera 5 preguntas de seleccion multiple nivel ${difficulty}.`,
      "Cada pregunta debe tener 4 opciones, una opcion correcta exacta y una explicacion corta por la IA.",
    ].join("\n\n"),
    schemaName: residentMode ? "study_resident_quiz" : "study_quiz",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        module: { type: ["string", "null"] },
        questions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              prompt: { type: "string" },
              level: { type: "string" },
              options: {
                type: "array",
                items: { type: "string" },
                minItems: 4,
                maxItems: 4,
              },
              correctOption: { type: "string" },
              explanation: { type: "string" },
            },
            required: ["prompt", "level", "options", "correctOption", "explanation"],
          },
        },
      },
      required: ["title", "module", "questions"],
    },
  });

  return result as QuizPayload;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StudyRequest;
    const courseSlug = body.courseSlug?.trim() ?? "";
    const action = body.action ?? "ask";
    const difficulty = body.difficulty ?? "intermedio";

    if (!courseSlug) {
      return NextResponse.json(
        { message: "Falta el curso para usar el asistente." },
        { status: 400 },
      );
    }

    const { course, courseLesson, courseModule } = getCourseContext(
      courseSlug,
      body.lessonId,
    );

    if (!course) {
      return NextResponse.json(
        { message: "No encontramos el curso solicitado." },
        { status: 404 },
      );
    }

    if (action !== "ask" && !courseLesson) {
      return NextResponse.json(
        { message: "Selecciona una leccion para generar contenido de estudio." },
        { status: 400 },
      );
    }

    if (action === "flashcards" && courseLesson) {
      const result = await generateFlashcardsPayload(
        course,
        courseLesson,
        courseModule?.title ?? null,
      );

      return NextResponse.json(result);
    }

    if (action === "quiz" && courseLesson) {
      const result = await generateQuizPayload({
        course,
        lesson: courseLesson,
        moduleTitle: courseModule?.title ?? null,
        difficulty,
        residentMode: false,
      });

      return NextResponse.json(result);
    }

    if (action === "exam" && courseLesson) {
      const result = await generateQuizPayload({
        course,
        lesson: courseLesson,
        moduleTitle: courseModule?.title ?? null,
        difficulty: "residente",
        residentMode: true,
      });

      return NextResponse.json(result);
    }

    const result = await generateAskPayload(
      course,
      courseLesson,
      courseModule?.title ?? null,
      body.question ?? "",
    );

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo usar la IA en este momento.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
