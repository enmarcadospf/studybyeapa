import Link from "next/link";
import { redirect } from "next/navigation";
import { getStudentCourses, getTutoringOffers } from "../../lib/api";
import { StudentSidebar } from "../../components/student/student-sidebar";
import { getCurrentStudentSession } from "../../lib/server/session";

export const dynamic = "force-dynamic";

export default async function StudentPage() {
  const student = await getCurrentStudentSession();

  if (!student) {
    redirect("/auth/login");
  }

  const [courseProgress, tutoring] = await Promise.all([
    getStudentCourses(),
    getTutoringOffers(),
  ]);
  const unlockedCourses = courseProgress.filter((course) =>
    student.enrolledCourseSlugs.includes(course.courseSlug),
  );

  return (
    <main className="student-shell">
      <section className="workspace-layout">
        <StudentSidebar activeHref="/student" />

        <div className="workspace-main">
          <section className="mock-dashboard-top">
            <div>
              <h1>Hola, Estudiante! 👋🏻</h1>
              <p>Vamos a por un gran dia de aprendizaje.</p>
            </div>
            <div className="mock-dashboard-mascot">🧠</div>
          </section>

          <section className="mock-stat-grid">
            <article className="mock-stat-card">
              <span>Cursos en progreso</span>
              <strong>{unlockedCourses.length || 4}</strong>
              <small>Ver todos →</small>
            </article>
            <article className="mock-stat-card">
              <span>Horas de estudio</span>
              <strong>18 h</strong>
              <small>Esta semana</small>
            </article>
            <article className="mock-stat-card">
              <span>Racha de estudio</span>
              <strong>7 dias</strong>
              <small>Sigue asi</small>
            </article>
          </section>

          <section className="mock-student-grid">
            <div className="student-panel">
              <div className="section-heading">
                <span>Mis cursos</span>
                <h2>Continuar estudiando</h2>
              </div>
              <div className="student-stack">
                {unlockedCourses.length ? (
                  unlockedCourses.map((course) => (
                    <article className="student-course-card" key={course.courseSlug}>
                      <div className="student-course-row">
                        <div className="student-course-icon">
                          {course.title.slice(0, 1)}
                        </div>
                        <div>
                          <h3>{course.title}</h3>
                          <p>{course.nextLessonTitle}</p>
                        </div>
                        <Link className="eapa-button eapa-button-small" href={`/courses/${course.courseSlug}`}>
                          Continuar
                        </Link>
                      </div>
                      <div className="progress-bar" aria-hidden="true">
                        <span style={{ width: `${course.progressPercent}%` }} />
                      </div>
                      <div className="course-meta">
                        <span>{course.progressPercent}% completado</span>
                        <span>{course.totalLessons} lecciones</span>
                      </div>
                    </article>
                  ))
                ) : (
                  <article className="student-course-card">
                    <h3>Aun no tienes cursos activos</h3>
                    <p>
                      Cuando habilitemos tus accesos o conectemos los pagos,
                      tus cursos apareceran aqui con progreso real.
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
                <span>Calendario</span>
                <h2>Mayo 2026</h2>
              </div>
              <div className="calendar-preview-card">
                <div className="calendar-preview-grid">
                  {["L", "M", "M", "J", "V", "S", "D"].map((day) => (
                    <span className="calendar-day-label" key={day}>
                      {day}
                    </span>
                  ))}
                  {Array.from({ length: 14 }).map((_, index) => (
                    <span
                      className={index === 9 ? "calendar-day is-active" : "calendar-day"}
                      key={index}
                    >
                      {index + 12}
                    </span>
                  ))}
                </div>
              </div>
              <div className="student-stack">
                {tutoring.map((offer) => (
                  <article className="tutoring-card" key={offer.id}>
                    <p className="role-name">{offer.topic}</p>
                    <p>{offer.teacherName}</p>
                    <p>{offer.durationMinutes} minutos · USD {offer.priceUsd}</p>
                  </article>
                ))}
              </div>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
