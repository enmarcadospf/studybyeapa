import Link from "next/link";
import { redirect } from "next/navigation";
import { getCourses, getStudentCourses, getTutoringOffers } from "../../lib/api";
import { AccountHub } from "../../components/student/account-hub";
import { StudentSidebar } from "../../components/student/student-sidebar";
import { PageHeader } from "../../components/ui/page-header";
import { ProgressCard } from "../../components/ui/progress-card";
import { getCurrentStudentSession } from "../../lib/server/session";

export default async function StudentPage() {
  const student = await getCurrentStudentSession();

  if (!student) {
    redirect("/auth/login");
  }

  const [courseProgress, tutoring, courses] = await Promise.all([
    getStudentCourses(),
    getTutoringOffers(),
    getCourses(),
  ]);
  const unlockedCourses = courseProgress.filter((course) =>
    student.enrolledCourseSlugs.includes(course.courseSlug),
  );

  return (
    <main className="student-shell">
      <section className="workspace-layout">
        <StudentSidebar activeHref="/student" />

        <div className="workspace-main">
          <section className="dashboard-hero dashboard-hero-soft">
            <PageHeader
              description="Sigue tus cursos, repasa con calma y mantente organizado en una sola vista."
              eyebrow="Estudiante"
              title={`Hola, ${student.fullName.split(" ")[0]}. Vamos a estudiar.`}
            />
            <div className="dashboard-grid">
              <ProgressCard helper={student.email} label="Cuenta" value="Activa" />
              <ProgressCard
                helper="Accesos habilitados"
                label="Cursos desbloqueados"
                value={String(student.enrolledCourseSlugs.length)}
              />
              <ProgressCard
                helper="Esta semana"
                label="Horas sugeridas"
                value="18 h"
              />
            </div>
          </section>

          <section className="student-grid">
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
                          <p>Siguiente leccion: {course.nextLessonTitle}</p>
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
                <span>Agenda</span>
                <h2>Tu semana</h2>
              </div>
              <div className="calendar-preview-card">
                <strong>Mayo 2026</strong>
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
