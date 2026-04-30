import Link from "next/link";
import { redirect } from "next/navigation";
import { getStudentCourses, getTutoringOffers } from "../../lib/api";
import { getCurrentStudentSession } from "../../lib/server/session";

export default async function StudentPage() {
  const student = await getCurrentStudentSession();

  if (!student) {
    redirect("/auth/login");
  }

  const [courses, tutoring] = await Promise.all([
    getStudentCourses(),
    getTutoringOffers(),
  ]);
  const unlockedCourses = courses.filter((course) =>
    student.enrolledCourseSlugs.includes(course.courseSlug),
  );

  return (
    <main className="student-shell">
      <section className="dashboard-hero">
        <p className="eyebrow">Area del estudiante</p>
        <h1>Hola, {student.fullName.split(" ")[0]}. Continua tus cursos.</h1>
        <p className="auth-copy">
          Tu cuenta ya queda guardada dentro de la plataforma. Desde aqui
          seguiremos construyendo modulos, repaso, simulacros y progreso real.
        </p>
        <div className="account-summary-row">
          <article className="dashboard-card">
            <span className="dashboard-label">Correo</span>
            <strong>{student.email}</strong>
          </article>
          <article className="dashboard-card">
            <span className="dashboard-label">Estado</span>
            <strong>Cuenta activa</strong>
          </article>
          <article className="dashboard-card">
            <span className="dashboard-label">Cursos desbloqueados</span>
            <strong>{student.enrolledCourseSlugs.length}</strong>
          </article>
        </div>
      </section>

      <section className="student-grid">
        <div className="student-panel">
          <div className="section-heading">
            <span>Mis cursos</span>
            <h2>Progreso actual</h2>
          </div>
          <div className="student-stack">
            {unlockedCourses.length ? (
              unlockedCourses.map((course) => (
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
              ))
            ) : (
              <article className="student-course-card">
                <h3>Aun no tienes cursos activos</h3>
                <p>
                  Cuando habilitemos tus accesos o mas adelante conectemos los
                  pagos, tus cursos apareceran aqui con progreso real.
                </p>
                <Link className="text-link" href="/courses">
                  Ver cursos disponibles
                </Link>
              </article>
            )}
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
