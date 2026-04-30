import {
  adminAlerts,
  courses as fallbackCourses,
  lessons as fallbackLessons,
  platformStats,
  studentCourseProgress as fallbackStudentCourseProgress,
  teacherTasks as fallbackTeacherTasks,
  tutoringOffers as fallbackTutoringOffers,
  type AdminAlert,
  type Course,
  type Lesson,
  type PlatformStats,
  type StudentCourseProgress,
  type TeacherTask,
  type TutoringOffer,
} from "@academia/shared";

const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:4000";

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function getPlatformStats() {
  return fetchJson<PlatformStats>("/api/stats", platformStats);
}

export function getCourses() {
  return fetchJson<Course[]>("/api/courses", fallbackCourses);
}

export function getCourseBySlug(slug: string) {
  const fallback = fallbackCourses.find((course) => course.slug === slug) ?? null;
  return fetchJson<Course | null>(`/api/courses/${slug}`, fallback);
}

export function getTutoringOffers() {
  return fetchJson<TutoringOffer[]>("/api/tutoring", fallbackTutoringOffers);
}

export function getLessonsByCourseSlug(slug: string) {
  return fetchJson<Lesson[]>(
    `/api/courses/${slug}/lessons`,
    fallbackLessons.filter((lesson) => lesson.courseSlug === slug),
  );
}

export function getStudentCourses() {
  return fetchJson<StudentCourseProgress[]>(
    "/api/student/courses",
    fallbackStudentCourseProgress,
  );
}

export function getTeacherTasks() {
  return fetchJson<TeacherTask[]>("/api/teacher/tasks", fallbackTeacherTasks);
}

export function getAdminAlerts() {
  return fetchJson<AdminAlert[]>("/api/admin/alerts", adminAlerts);
}
