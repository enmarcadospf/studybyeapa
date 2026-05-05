import Link from "next/link";
import { redirect } from "next/navigation";
import { getCourses, getStudentCourses } from "../../lib/api";
import { getCurrentStudentSession } from "../../lib/server/session";
import { StudentSidebar } from "../../components/student/student-sidebar";

export const dynamic = "force-dynamic";

type DashboardIconName = "courses" | "lessons" | "clock" | "exam" | "device";

function DashboardIcon({ name }: { name: DashboardIconName }) {
  if (name === "courses") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 6.5c2.8-.9 5.2-.4 7.5 1.5v11c-2.3-1.9-4.7-2.4-7.5-1.5v-11Z" />
        <path d="M12 8c2.3-1.9 4.7-2.4 7.5-1.5v11c-2.8-.9-5.2-.4-7.5 1.5V8Z" />
      </svg>
    );
  }

  if (name === "lessons") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.5" y="5" width="15" height="15" rx="3" />
        <path d="m8 12 2.3 2.3L16 8.8" />
        <path d="M8 17h8" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7.5" />
        <path d="M12 7.8v4.7l3 1.8" />
      </svg>
    );
  }

  if (name === "device") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="4.5" width="12" height="15" rx="2.5" />
        <path d="M10 16.5h4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="4.5" width="14" height="16" rx="3" />
      <path d="M9 9h6" />
      <path d="M9 13h6" />
      <path d="M9 17h3.5" />
    </svg>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: DashboardIconName;
  title: string;
  value: string;
}) {
  return (
    <div className="stat-card-eapa">
      <div className="stat-icon-eapa">
        <DashboardIcon name={icon} />
      </div>
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}

function ProgressRow({
  href,
  name,
  progress,
  nextLesson,
  locked,
}: {
  href: string;
  name: string;
  progress: number;
  nextLesson: string;
  locked?: boolean;
}) {
  return (
    <Link href={href} className="progress-row-eapa">
      <div className="progress-row-head-eapa">
        <div>
          <span>{name}</span>
          <p>{locked ? "Vista previa disponible" : nextLesson}</p>
        </div>
        <small>{locked ? "Bloqueado" : `${progress}%`}</small>
      </div>
      <div className="progress-track-eapa">
        <div className="progress-fill-eapa" style={{ width: `${locked ? 8 : progress}%` }} />
      </div>
    </Link>
  );
}

export default async function StudentPage() {
  const student = await getCurrentStudentSession();

  if (!student) {
    redirect("/auth/login");
  }

  const [courseProgress, courses] = await Promise.all([
    getStudentCourses(),
    getCourses(),
  ]);
  const unlockedCourses = courseProgress.filter((course) =>
    student.enrolledCourseSlugs.includes(course.courseSlug),
  );
  const activeSubscriptions = student.subscriptions.filter(
    (subscription) => subscription.status === "active",
  );
  const activeDevices = student.devices.filter((device) => device.status === "active");
  const averageProgress = unlockedCourses.length
    ? Math.round(
        unlockedCourses.reduce((total, course) => total + course.progressPercent, 0) /
          unlockedCourses.length,
      )
    : 0;
  const completedLessons = unlockedCourses.reduce(
    (total, course) =>
      total + Math.round((course.progressPercent / 100) * course.totalLessons),
    0,
  );
  const estimatedHours = courses.reduce((total, course) => {
    const progress = courseProgress.find((item) => item.courseSlug === course.slug);
    const hasAccess = student.enrolledCourseSlugs.includes(course.slug);
    return total + (hasAccess && progress ? course.durationHours * (progress.progressPercent / 100) : 0);
  }, 0);
  const previewCourses = courses
    .filter((course) => !student.enrolledCourseSlugs.includes(course.slug))
    .slice(0, 3);
  const dashboardCourses = unlockedCourses.length
    ? unlockedCourses
    : courseProgress.slice(0, 3);
  const firstName = student.fullName.trim().split(" ")[0] || "Estudiante";

  return (
    <main className="dashboard-shell-eapa">
      <div className="dashboard-grid-eapa">
        <StudentSidebar activeHref="/student" />
        <main className="soft-card dashboard-main-eapa">
          <div className="dashboard-head-eapa">
            <div>
              <span className="dashboard-eyebrow-eapa">Panel del estudiante</span>
              <h1>Hola, {firstName}!</h1>
              <p>
                Sigue avanzando, cada día estás más cerca de dominar medicina
                con calma, orden y práctica.
              </p>
            </div>
            <div className="dashboard-actions-eapa">
              <Link href="/courses" className="secondary-btn">Ver catálogo</Link>
              <Link href="/simulacros" className="primary-btn">Nuevo repaso</Link>
            </div>
            <div className="streak-box-eapa">
              <span aria-hidden="true">12</span>
              <div>
                <p>Racha actual</p>
                <strong>días</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-stats-eapa">
            <StatCard
              icon="courses"
              title="Cursos con acceso"
              value={String(activeSubscriptions.length || student.enrolledCourseSlugs.length)}
            />
            <StatCard
              icon="lessons"
              title="Lecciones completadas"
              value={String(completedLessons)}
            />
            <StatCard
              icon="clock"
              title="Horas estimadas"
              value={`${Math.round(estimatedHours)} h`}
            />
            <StatCard
              icon="device"
              title="Dispositivos activos"
              value={`${activeDevices.length}/4`}
            />
          </div>

          <div className="dashboard-panels-eapa">
            <section className="soft-card dashboard-panel-eapa">
              <div className="dashboard-panel-head-eapa">
                <div>
                  <h2>Mis cursos en progreso</h2>
                  <p>{averageProgress}% de avance promedio</p>
                </div>
                <Link href="/courses" className="mini-link-eapa">Explorar</Link>
              </div>
              <div className="progress-list-eapa">
                {dashboardCourses.map((course) => (
                  <ProgressRow
                    key={course.courseSlug}
                    href={`/courses/${course.courseSlug}`}
                    name={course.title}
                    nextLesson={course.nextLessonTitle}
                    progress={student.enrolledCourseSlugs.includes(course.courseSlug) ? course.progressPercent : 0}
                    locked={!student.enrolledCourseSlugs.includes(course.courseSlug)}
                  />
                ))}
              </div>
              <Link href="/courses" className="secondary-btn">
                Ver todos mis cursos
              </Link>
            </section>

            <section className="soft-card dashboard-panel-eapa">
              <div className="calendar-panel-head-eapa">
                <h2>Calendario</h2>
                <span>Mayo 2025</span>
              </div>
              <div className="calendar-mini-grid-eapa">
                {["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"].map((day) => (
                  <div key={day} className="calendar-mini-label-eapa">{day}</div>
                ))}
                {Array.from({ length: 31 }, (_, i) => (
                  <div
                    key={i}
                    className={i + 1 === 15 ? "calendar-mini-day-eapa is-active" : "calendar-mini-day-eapa"}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <Link href="/calendar" className="secondary-btn secondary-btn-full">
                Ver calendario completo
              </Link>
            </section>
          </div>

          <div className="dashboard-bottom-grid-eapa">
            <section className="soft-card dashboard-panel-eapa">
              <div className="dashboard-panel-head-eapa">
                <div>
                  <h2>Acceso y suscripción</h2>
                  <p>Los cursos duran 3 meses desde la activación.</p>
                </div>
                <Link href="/settings" className="mini-link-eapa">Configurar</Link>
              </div>
              <div className="subscription-mini-list-eapa">
                {activeSubscriptions.length ? (
                  activeSubscriptions.slice(0, 3).map((subscription) => (
                    <div key={subscription.id} className="subscription-mini-item-eapa">
                      <div>
                        <strong>{subscription.courseTitle}</strong>
                        <span>
                          Hasta {new Date(subscription.expiresAt).toLocaleDateString("es-DO")}
                        </span>
                      </div>
                      <b>USD {subscription.priceUsd}</b>
                    </div>
                  ))
                ) : (
                  <div className="subscription-mini-empty-eapa">
                    <strong>Aún no tienes cursos activos.</strong>
                    <p>Elige un curso y luego conectaremos el pago real para activar acceso.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="soft-card dashboard-panel-eapa">
              <div className="dashboard-panel-head-eapa">
                <div>
                  <h2>Recomendados</h2>
                  <p>Continúa armando tu plan de estudio.</p>
                </div>
              </div>
              <div className="recommended-course-list-eapa">
                {previewCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="recommended-course-eapa"
                  >
                    <span>{course.title}</span>
                    <small>USD {course.priceUsd} · {course.lessons} lecciones</small>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </main>
  );
}
