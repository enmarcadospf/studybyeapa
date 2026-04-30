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

function buildLessonFacts(course: Course, lesson: Lesson) {
  return [
    `${lesson.title} pertenece al curso ${course.title}.`,
    `Es una leccion de tipo ${lesson.contentType === "video" ? "video" : "lectura"}.`,
    `Su enfoque principal es: ${lesson.summary}`,
    `La duracion aproximada del estudio es de ${lesson.durationMinutes} minutos.`,
  ];
}

function createFlashcards(course: Course, lesson: Lesson) {
  const facts = buildLessonFacts(course, lesson);

  return facts.map((fact, index) => ({
    question: `Flashcard ${index + 1}`,
    answer: fact,
  }));
}

function createQuiz(course: Course, lesson: Lesson, difficulty: string) {
  return [
    {
      prompt: `¿Cual es el objetivo central de la leccion "${lesson.title}" dentro de ${course.title}?`,
      level: difficulty,
    },
    {
      prompt: `Explica como aplicarías "${lesson.summary}" en un escenario clinico breve.`,
      level: difficulty,
    },
    {
      prompt: `¿Que punto no deberia olvidar un estudiante despues de esta leccion de ${lesson.contentType === "video" ? "video" : "lectura"}?`,
      level: difficulty,
    },
  ];
}

function createExamGuide(course: Course, lesson: Lesson) {
  return {
    format: "Modo residente",
    focus: [
      `Integrar conceptos clave del curso ${course.title}.`,
      `Usar el tema "${lesson.title}" para preguntas con contexto clinico.`,
      "Priorizar razonamiento y no memorizacion literal.",
    ],
  };
}

function answerQuestion(course: Course, lesson: Lesson | null, question: string) {
  const prompt = question.trim().toLowerCase();

  if (!prompt) {
    return "Escribe una pregunta concreta sobre el tema y te ayudare a resumirlo o repasarlo.";
  }

  if (prompt.includes("resumen")) {
    return lesson
      ? `Resumen de ${lesson.title}: ${lesson.summary} Esta leccion forma parte de ${course.title} y conviene repasarla con una pregunta corta, una flashcard y un mini quiz al final.`
      : `Resumen del curso ${course.title}: ${course.summary} Te recomiendo entrar a una leccion especifica para darte un repaso mas puntual.`;
  }

  if (prompt.includes("flashcard")) {
    return lesson
      ? `Puedo convertir ${lesson.title} en flashcards de forma inmediata. Usa el boton "Crear flashcards" para generar tarjetas de repaso de este tema.`
      : `Selecciona una leccion concreta y te genero flashcards mas utiles.`;
  }

  if (prompt.includes("quiz")) {
    return lesson
      ? `Para ${lesson.title}, lo mejor es practicar con un quiz progresivo: 1. concepto base, 2. aplicacion, 3. pregunta estilo residente.`
      : `Puedo prepararte un quiz por dificultad, pero necesito una leccion concreta para enfocarlo bien.`;
  }

  return lesson
    ? `Sobre ${lesson.title}: ${lesson.summary} Si quieres, formula la duda en modo clinico, por ejemplo "explicame este tema", "hazme un resumen" o "crea un quiz residente".`
    : `Estas dentro de ${course.title}. Dime que modulo o leccion quieres repasar y te ayudo con un resumen, flashcards o quiz.`;
}

export async function POST(request: Request) {
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
    return NextResponse.json({
      title: `Flashcards de ${courseLesson.title}`,
      module: courseModule?.title ?? null,
      cards: createFlashcards(course, courseLesson),
    });
  }

  if (action === "quiz" && courseLesson) {
    return NextResponse.json({
      title: `Quiz ${difficulty} de ${courseLesson.title}`,
      module: courseModule?.title ?? null,
      questions: createQuiz(course, courseLesson, difficulty),
    });
  }

  if (action === "exam" && courseLesson) {
    return NextResponse.json({
      title: `Guia de examen para ${courseLesson.title}`,
      module: courseModule?.title ?? null,
      exam: createExamGuide(course, courseLesson),
    });
  }

  return NextResponse.json({
    title: `Asistente de ${course.title}`,
    answer: answerQuestion(course, courseLesson, body.question ?? ""),
  });
}
