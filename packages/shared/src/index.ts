export const APP_NAME = "Study by EAPA";
export const APP_TAGLINE =
  "Una plataforma web para que el estudiante de medicina aprenda mejor con video, lectura, flashcards, quiz y examenes finales guiados por IA.";

export const BRAND = {
  primary: "#0d5bd7",
  primaryDark: "#083b8a",
  primarySoft: "#e9f1ff",
  text: "#10233f",
} as const;

export const LEARNING_LOOP = [
  {
    title: "Ver o leer el tema",
    description:
      "Cada leccion se construye en el formato mas util: video corto, lectura puntual o una combinacion de ambos.",
  },
  {
    title: "Repasar con apoyo de IA",
    description:
      "Al terminar el tema, el estudiante puede generar flashcards o un quiz ajustado a la dificultad que necesita.",
  },
  {
    title: "Cerrar con examen serio",
    description:
      "Cada modulo termina con una evaluacion mas exigente, estilo residente, basada en la guia docente que tu definas.",
  },
] as const;

export type UserRole = "student" | "teacher" | "admin";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type LessonContentType = "video" | "reading";
export type QuizDifficulty = "basico" | "intermedio" | "avanzado" | "residente";

export type Course = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  level: CourseLevel;
  lessons: number;
  durationHours: number;
  priceUsd: number;
  category: string;
  featured: boolean;
};

export type CourseModule = {
  id: string;
  courseSlug: string;
  title: string;
  summary: string;
  examLabel: string;
  lessonIds: string[];
};

export type Lesson = {
  id: string;
  courseSlug: string;
  moduleId: string;
  title: string;
  summary: string;
  contentType: LessonContentType;
  durationMinutes: number;
  order: number;
  open: boolean;
  supportsFlashcards: boolean;
  supportsQuiz: boolean;
};

export type StudyToolCard = {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
};

export type PaymentMethodCard = {
  id: string;
  title: string;
  description: string;
  badge: string;
};

export type TutoringOffer = {
  id: string;
  topic: string;
  teacherName: string;
  durationMinutes: number;
  priceUsd: number;
  nextSlot: string;
};

export type PlatformStats = {
  students: number;
  courses: number;
  tutoringSessions: number;
  completionRate: number;
};

export type DashboardSummary = {
  title: string;
  value: string;
  helper: string;
};

export type DashboardSection = {
  role: UserRole;
  heading: string;
  description: string;
  summaries: DashboardSummary[];
};

export type StudentCourseProgress = {
  courseSlug: string;
  title: string;
  progressPercent: number;
  nextLessonTitle: string;
  totalLessons: number;
};

export type AdminAlert = {
  id: string;
  title: string;
  area: string;
  status: "open" | "reviewing" | "resolved";
};

export type TeacherTask = {
  id: string;
  title: string;
  dueLabel: string;
  courseTitle: string;
};

export const features = [
  {
    title: "Modulos bien estructurados",
    description:
      "Cada curso se divide por modulos y cada modulo por lecciones claras para que el estudiante nunca se pierda.",
  },
  {
    title: "Repaso inteligente",
    description:
      "Las lecciones activan botones para generar flashcards y quiz desde el material que tu subes.",
  },
  {
    title: "IA visible y util",
    description:
      "La IA no sera decorativa: estara integrada para crear repasos, examenes y apoyo al estudio.",
  },
] as const;

export const roles = [
  {
    key: "student" as UserRole,
    name: "Estudiantes",
    description:
      "Entran, compran cursos, estudian por modulos, generan repaso y miden su progreso.",
  },
  {
    key: "admin" as UserRole,
    name: "Tu gestion interna",
    description:
      "Tu controlas contenido, precios, ofertas, estructura, examenes y el estilo de las preguntas generadas.",
  },
] as const;

export const courses: Course[] = [
  {
    id: "course-semiologia-clinica",
    slug: "semiologia-clinica",
    title: "Semiologia clinica",
    summary:
      "Interrogatorio, hallazgos y razonamiento clinico con repaso activo al final de cada tema.",
    level: "intermediate",
    lessons: 28,
    durationHours: 20,
    priceUsd: 49,
    category: "Medicina interna",
    featured: true,
  },
  {
    id: "course-infectologia",
    slug: "infectologia",
    title: "Infectologia",
    summary:
      "Abordaje sindromico, antimicrobianos y preguntas de alta exigencia tipo examen.",
    level: "intermediate",
    lessons: 32,
    durationHours: 24,
    priceUsd: 55,
    category: "Especialidades",
    featured: true,
  },
  {
    id: "course-anatomia",
    slug: "anatomia",
    title: "Anatomia",
    summary:
      "Videos, lectura y repaso visual para consolidar estructuras, relaciones y puntos de examen.",
    level: "beginner",
    lessons: 26,
    durationHours: 18,
    priceUsd: 45,
    category: "Ciencias basicas",
    featured: true,
  },
] as const;

export const modules: CourseModule[] = [
  {
    id: "module-semiologia-1",
    courseSlug: "semiologia-clinica",
    title: "Modulo 1 · Bases del interrogatorio",
    summary: "Aprender a escuchar, filtrar sintomas y dirigir preguntas clinicas.",
    examLabel: "Examen final de modulo con enfoque clinico",
    lessonIds: ["lesson-semiologia-01", "lesson-semiologia-02"],
  },
  {
    id: "module-infectologia-1",
    courseSlug: "infectologia",
    title: "Modulo 1 · Sindrome febril",
    summary: "Criterios iniciales, enfoque diagnostico y decisiones terapéuticas.",
    examLabel: "Examen final estilo residente",
    lessonIds: ["lesson-infectologia-01", "lesson-infectologia-02"],
  },
  {
    id: "module-anatomia-1",
    courseSlug: "anatomia",
    title: "Modulo 1 · Torax",
    summary: "Video, lectura y repaso activo sobre estructuras toracicas y correlacion clinica.",
    examLabel: "Examen final por sistema",
    lessonIds: ["lesson-anatomia-01", "lesson-anatomia-02", "lesson-anatomia-03"],
  },
] as const;

export const lessons: Lesson[] = [
  {
    id: "lesson-semiologia-01",
    courseSlug: "semiologia-clinica",
    moduleId: "module-semiologia-1",
    title: "Interrogatorio clinico dirigido",
    summary: "Preguntas clave para orientar el diagnostico desde el primer contacto.",
    contentType: "video",
    durationMinutes: 18,
    order: 1,
    open: true,
    supportsFlashcards: true,
    supportsQuiz: true,
  },
  {
    id: "lesson-semiologia-02",
    courseSlug: "semiologia-clinica",
    moduleId: "module-semiologia-1",
    title: "Signos cardinales y hallazgos clave",
    summary: "Lectura corta con datos de alta frecuencia para repaso y preguntas.",
    contentType: "reading",
    durationMinutes: 26,
    order: 2,
    open: true,
    supportsFlashcards: true,
    supportsQuiz: true,
  },
  {
    id: "lesson-infectologia-01",
    courseSlug: "infectologia",
    moduleId: "module-infectologia-1",
    title: "Abordaje inicial del sindrome febril",
    summary: "Video de enfoque rapido para diferenciar causas y priorizar estudios.",
    contentType: "video",
    durationMinutes: 24,
    order: 1,
    open: true,
    supportsFlashcards: true,
    supportsQuiz: true,
  },
  {
    id: "lesson-infectologia-02",
    courseSlug: "infectologia",
    moduleId: "module-infectologia-1",
    title: "Antibioticoterapia razonada",
    summary: "Lectura dirigida con razonamiento para elegir tratamiento y evitar errores.",
    contentType: "reading",
    durationMinutes: 21,
    order: 2,
    open: true,
    supportsFlashcards: true,
    supportsQuiz: true,
  },
  {
    id: "lesson-anatomia-01",
    courseSlug: "anatomia",
    moduleId: "module-anatomia-1",
    title: "Video guiado de estructuras toracicas",
    summary: "Recorrido visual de torax con referencias practicas y orientacion espacial.",
    contentType: "video",
    durationMinutes: 22,
    order: 1,
    open: true,
    supportsFlashcards: true,
    supportsQuiz: true,
  },
  {
    id: "lesson-anatomia-02",
    courseSlug: "anatomia",
    moduleId: "module-anatomia-1",
    title: "Lectura de anatomia del torax",
    summary: "Resumen organizado de estructuras, limites y relaciones de alto valor.",
    contentType: "reading",
    durationMinutes: 15,
    order: 2,
    open: true,
    supportsFlashcards: true,
    supportsQuiz: true,
  },
  {
    id: "lesson-anatomia-03",
    courseSlug: "anatomia",
    moduleId: "module-anatomia-1",
    title: "Correlacion clinica del torax",
    summary: "Leccion corta para unir anatomia con imagenes, sintomas y examen.",
    contentType: "video",
    durationMinutes: 17,
    order: 3,
    open: true,
    supportsFlashcards: true,
    supportsQuiz: true,
  },
] as const;

export const studyToolCards: StudyToolCard[] = [
  {
    id: "tool-flashcards",
    title: "Generar flashcards",
    description:
      "Convierte el tema estudiado en tarjetas cortas para repaso rapido y repeticion espaciada.",
    actionLabel: "Crear flashcards",
  },
  {
    id: "tool-quiz",
    title: "Crear quiz por dificultad",
    description:
      "Permite elegir nivel basico, intermedio, avanzado o residente para practicar segun necesidad.",
    actionLabel: "Crear quiz",
  },
  {
    id: "tool-ai",
    title: "Hablar con la IA del tema",
    description:
      "Espacio para escribir preguntas, pedir resumentes, aclarar conceptos y reforzar el razonamiento.",
    actionLabel: "Abrir IA",
  },
] as const;

export const paymentMethodCards: PaymentMethodCard[] = [
  {
    id: "apple-pay",
    title: "Apple Pay",
    description:
      "Pago rapido desde iPhone, iPad o Mac cuando conectemos Stripe con tu cuenta real.",
    badge: "Rapido",
  },
  {
    id: "card",
    title: "Tarjeta de credito o debito",
    description:
      "Cobro directo del curso con Visa, Mastercard u otras tarjetas compatibles.",
    badge: "Principal",
  },
  {
    id: "account",
    title: "Deposito en tu cuenta",
    description:
      "Todo pago aprobado ira a tu cuenta configurada en la pasarela que integremos.",
    badge: "Tu cobras",
  },
] as const;

export const courseFocusAreas: Record<string, string[]> = {
  "semiologia-clinica": [
    "Interrogatorio",
    "Signos",
    "Sintomas",
    "Razonamiento clinico",
  ],
  infectologia: [
    "Antibioticos",
    "Sindrome febril",
    "Enfermedades infecciosas",
    "Terapia antimicrobiana",
  ],
  anatomia: [
    "Torax",
    "Abdomen",
    "Neuroanatomia",
    "Correlacion clinica",
  ],
} as const;

export const tutoringOffers: TutoringOffer[] = [
  {
    id: "guided-review-1",
    topic: "Repaso guiado de anatomia",
    teacherName: "EAPA",
    durationMinutes: 45,
    priceUsd: 15,
    nextSlot: "2026-05-05T18:00:00.000Z",
  },
  {
    id: "guided-review-2",
    topic: "Resolucion de quiz clinico",
    teacherName: "EAPA",
    durationMinutes: 60,
    priceUsd: 18,
    nextSlot: "2026-05-06T20:00:00.000Z",
  },
] as const;

export const platformStats: PlatformStats = {
  students: 1200,
  courses: courses.length,
  tutoringSessions: 340,
  completionRate: 87,
};

export const dashboardSections: DashboardSection[] = [
  {
    role: "student",
    heading: "Panel del estudiante",
    description:
      "Vista para continuar cursos, repasar con flashcards y resolver quizzes o examenes sin perder el ritmo.",
    summaries: [
      { title: "Cursos activos", value: "4", helper: "Dos terminan esta semana" },
      { title: "Progreso promedio", value: "72%", helper: "Subio 8% este mes" },
      { title: "Pendientes IA", value: "12", helper: "Flashcards por revisar" },
    ],
  },
  {
    role: "teacher",
    heading: "Panel del creador docente",
    description:
      "Espacio para publicar contenido, definir guias de generacion y revisar el rendimiento de los estudiantes.",
    summaries: [
      { title: "Cursos activos", value: "3", helper: "Con lecciones publicadas" },
      { title: "Guias IA", value: "3", helper: "Listas para flashcards y quiz" },
      { title: "Contenido pendiente", value: "5 lecciones", helper: "Listas para publicar" },
    ],
  },
  {
    role: "admin",
    heading: "Panel administrativo",
    description:
      "Control central de usuarios, catalogo, pagos y salud general del sitio.",
    summaries: [
      { title: "Ingresos del mes", value: "USD 8,420", helper: "18% por encima del mes anterior" },
      { title: "Nuevos registros", value: "214", helper: "Mayor crecimiento en anatomia" },
      { title: "Alertas abiertas", value: "3", helper: "Pagos, soporte y revision de curso" },
    ],
  },
] as const;

export const studentCourseProgress: StudentCourseProgress[] = [
  {
    courseSlug: "semiologia-clinica",
    title: "Semiologia clinica",
    progressPercent: 68,
    nextLessonTitle: "Signos cardinales y hallazgos clave",
    totalLessons: 28,
  },
  {
    courseSlug: "infectologia",
    title: "Infectologia",
    progressPercent: 34,
    nextLessonTitle: "Antibioticoterapia razonada",
    totalLessons: 32,
  },
] as const;

export const teacherTasks: TeacherTask[] = [
  {
    id: "teacher-task-1",
    title: "Definir guia del examen final de semiologia",
    dueLabel: "Hoy",
    courseTitle: "Semiologia clinica",
  },
  {
    id: "teacher-task-2",
    title: "Revisar flashcards generadas de infectologia",
    dueLabel: "Manana",
    courseTitle: "Infectologia",
  },
] as const;

export const adminAlerts: AdminAlert[] = [
  {
    id: "admin-alert-1",
    title: "Pago pendiente de conciliacion",
    area: "Pagos",
    status: "open",
  },
  {
    id: "admin-alert-2",
    title: "Curso enviado a revision",
    area: "Contenido",
    status: "reviewing",
  },
  {
    id: "admin-alert-3",
    title: "Ticket de soporte prioritario",
    area: "Soporte",
    status: "open",
  },
] as const;
