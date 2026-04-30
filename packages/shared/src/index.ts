export const APP_NAME = "Academia Online";
export const APP_TAGLINE =
  "Cursos medicos con lecciones, flashcards, quizzes y examenes finales para estudiar mejor desde la web.";

export const LEARNING_LOOP = [
  {
    title: "Aprender el tema",
    description:
      "Cada leccion puede presentarse en formato de video o lectura, segun lo que mejor funcione para la materia.",
  },
  {
    title: "Repasar al instante",
    description:
      "Despues del contenido, el estudiante repasa con flashcards o un quiz ajustado a la dificultad que elija.",
  },
  {
    title: "Medirse de verdad",
    description:
      "Al terminar el tema o modulo, presenta un examen final exigente, con estilo parecido al que tu definas en la guia.",
  },
] as const;

export type UserRole = "student" | "teacher" | "admin";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

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

export type Lesson = {
  id: string;
  courseSlug: string;
  title: string;
  summary: string;
  contentType: "video" | "reading";
  durationMinutes: number;
  order: number;
  open: boolean;
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
    title: "Cursos por materia y sistema",
    description:
      "Organiza semiologia, infectologia, anatomia y otras materias por sistemas, temas y modulos.",
  },
  {
    title: "Flashcards y quiz por tema",
    description:
      "Cada leccion puede terminar en repaso con flashcards o un quiz automatico segun la dificultad elegida.",
  },
  {
    title: "Examen final tipo residente",
    description:
      "Al cerrar un tema o modulo, el sistema puede generar examenes exigentes basados en tu guia docente.",
  },
] as const;

export const roles = [
  {
    key: "student" as UserRole,
    name: "Estudiante",
    description:
      "Explora cursos, estudia lecciones, repasa con flashcards y resuelve quizzes o examenes finales.",
  },
  {
    key: "teacher" as UserRole,
    name: "Creador docente",
    description:
      "Publica contenido, define la guia de estudio y ajusta el estilo de preguntas automaticas.",
  },
  {
    key: "admin" as UserRole,
    name: "Administrador interno",
    description:
      "Supervisa cursos, usuarios, pagos y configuracion general del sitio, aunque seas la misma persona.",
  },
] as const;

export const courses: Course[] = [
  {
    id: "course-semiologia-clinica",
    slug: "semiologia-clinica",
    title: "Semiologia clinica",
    summary:
      "Aprende sintomas, signos, interrogatorio y razonamiento clinico con enfoque practico.",
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
      "Repasa sindromes infecciosos, antibacterianos y toma de decisiones tipo examen.",
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
      "Estudia por regiones y sistemas con videos, repaso activo y evaluacion final para fijar cada estructura.",
    level: "beginner",
    lessons: 26,
    durationHours: 18,
    priceUsd: 45,
    category: "Ciencias basicas",
    featured: false,
  },
] as const;

export const tutoringOffers: TutoringOffer[] = [
  {
    id: "tutoring-frontend",
    topic: "Mentoria de frontend",
    teacherName: "Laura Medina",
    durationMinutes: 60,
    priceUsd: 20,
    nextSlot: "2026-04-29T18:00:00.000Z",
  },
  {
    id: "tutoring-backend",
    topic: "Sesion de backend",
    teacherName: "Carlos Reyes",
    durationMinutes: 90,
    priceUsd: 28,
    nextSlot: "2026-04-30T20:00:00.000Z",
  },
] as const;

export const lessons: Lesson[] = [
  {
    id: "lesson-react-01",
    courseSlug: "semiologia-clinica",
    title: "Interrogatorio clinico dirigido",
    summary: "Aprende a estructurar preguntas utiles para orientar el diagnostico.",
    contentType: "video",
    durationMinutes: 18,
    order: 1,
    open: true,
  },
  {
    id: "lesson-react-02",
    courseSlug: "semiologia-clinica",
    title: "Signos cardinales y hallazgos clave",
    summary: "Repasa signos clinicos que deben convertirse en flashcards de alta frecuencia.",
    contentType: "reading",
    durationMinutes: 26,
    order: 2,
    open: true,
  },
  {
    id: "lesson-node-01",
    courseSlug: "infectologia",
    title: "Abordaje inicial del sindrome febril",
    summary: "Diferencia cuadros frecuentes y decide estudios o tratamiento inicial.",
    contentType: "video",
    durationMinutes: 24,
    order: 1,
    open: true,
  },
  {
    id: "lesson-study-01",
    courseSlug: "anatomia",
    title: "Anatomia del torax",
    summary: "Integra relaciones anatomicas y puntos de examen con apoyo visual y repaso activo.",
    contentType: "reading",
    durationMinutes: 15,
    order: 1,
    open: true,
  },
  {
    id: "lesson-study-02",
    courseSlug: "anatomia",
    title: "Video guiado de estructuras toracicas",
    summary: "Visualiza referencias anatomicas y consolida el tema antes del repaso.",
    contentType: "video",
    durationMinutes: 22,
    order: 2,
    open: true,
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
      {
        title: "Cursos activos",
        value: "4",
        helper: "Dos terminan esta semana",
      },
      {
        title: "Progreso promedio",
        value: "72%",
        helper: "Subio 8% este mes",
      },
      {
        title: "Tutoria proxima",
        value: "12 flashcards",
        helper: "Pendientes del tema actual",
      },
    ],
  },
  {
    role: "teacher",
    heading: "Panel del creador docente",
    description:
      "Espacio para publicar contenido, definir guias de generacion y revisar el rendimiento de los estudiantes.",
    summaries: [
      {
        title: "Cohortes activas",
        value: "3",
        helper: "86 estudiantes en total",
      },
      {
        title: "Tutorias semanales",
        value: "3 guias",
        helper: "Listas para flashcards y quiz",
      },
      {
        title: "Contenido pendiente",
        value: "5 lecciones",
        helper: "Listas para publicar",
      },
    ],
  },
  {
    role: "admin",
    heading: "Panel administrativo",
    description:
      "Control central de usuarios, catalogo, pagos y salud general del sitio.",
    summaries: [
      {
        title: "Ingresos del mes",
        value: "USD 8,420",
        helper: "18% por encima del mes anterior",
      },
      {
        title: "Nuevos registros",
        value: "214",
        helper: "Mayor crecimiento en backend",
      },
      {
        title: "Alertas abiertas",
        value: "3",
        helper: "Pagos, soporte y revision de curso",
      },
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
    nextLessonTitle: "Abordaje inicial del sindrome febril",
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
