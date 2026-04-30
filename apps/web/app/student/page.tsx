import Link from "next/link";
import { getStudentCourses, getTutoringOffers } from "../../lib/api";

export default async function StudentPage() {
  const [courses, tutoring] = await Promise.all([
    getStudentCourses(),
    getTutoringOffers(),
  ]);

  return (
    <main className="student-shell">
      <section className="dashboard-hero">
        <p className="eyebrow">Area del estudiante</p>
        <h1>Continua tus cursos y no pierdas el ritmo</h1>
        <p className="auth-copy">
          Esta base ya organiza el espacio donde el estudiante vera progreso,
          proximas clases y tutorias recomendadas.
        </p>
      </section>

      <section className="student-grid">
        <div className="student-panel">
          <div className="section-heading">
            <span>Mis cursos</span>
            <h2>Progreso actual</h2>
          </div>
          <div className="student-stack">
            {courses.map((course) => (
              <article className="student-course-card" key={course.courseSlug}>
                <h3>{course.title}</h3>
                <p>Siguiente leccion: {course.nextLessonTitle}</p>
                <div className="progress-bar" aria-hidden="true">
                  <span style={{ width: `${course.progressPercent}%` }} />
                </div>
                <div className="course-meta">
                  <span>{course.progressPercent}% completado</span>
                  <span>{course.totalLessons} lecciones</span>
                </div>
                <Link
                  className="text-link"
                  href={`/courses/${course.courseSlug}`}
                >
                  Ir al curso
                </Link>
              </article>
            ))}
          </div>
        </div>

        <aside className="student-panel">
          <div className="section-heading">
            <span>Tutorias</span>
            <h2>Proximas opciones</h2>
          </div>
          <div className="student-stack">
            {tutoring.map((offer) => (
              <article className="tutoring-card" key={offer.id}>
                <p className="role-name">{offer.topic}</p>
                <p>{offer.teacherName}</p>
                <p>
                  {offer.durationMinutes} minutos · USD {offer.priceUsd}
                </p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
