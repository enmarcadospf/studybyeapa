import Link from "next/link";
import { redirect } from "next/navigation";
import { getStudentCourses } from "../../lib/api";
import { getCurrentStudentSession } from "../../lib/server/session";
import { StudentSidebar } from "../../components/student/student-sidebar";

export const dynamic = "force-dynamic";

function StatCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="stat-card-eapa">
      <div className="stat-icon-eapa">{icon}</div>
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}

function ProgressRow({ name, progress }: { name: string; progress: number }) {
  return (
    <div className="progress-row-eapa">
      <div className="progress-row-head-eapa">
        <span>{name}</span>
        <small>{progress}%</small>
      </div>
      <div className="progress-track-eapa">
        <div className="progress-fill-eapa" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default async function StudentPage() {
  const student = await getCurrentStudentSession();

  if (!student) {
    redirect("/auth/login");
  }

  const courseProgress = await getStudentCourses();
  const unlockedCourses = courseProgress.filter((course) =>
    student.enrolledCourseSlugs.includes(course.courseSlug),
  );

  return (
    <main className="dashboard-shell-eapa">
      <div className="dashboard-grid-eapa">
        <StudentSidebar activeHref="/student" />
        <main className="soft-card dashboard-main-eapa">
          <div className="dashboard-head-eapa">
            <div>
              <h1>Hola, {student.fullName.split(" ")[0]}!</h1>
              <p>Sigue avanzando, cada dia estas mas cerca de tu meta.</p>
            </div>
            <div className="streak-box-eapa">
              <span>🔥</span>
              <div>
                <p>Racha actual</p>
                <strong>12 dias</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-stats-eapa">
            <StatCard icon="▤" title="Cursos en progreso" value={String(unlockedCourses.length || 4)} />
            <StatCard icon="☑" title="Lecciones completadas" value="68" />
            <StatCard icon="◔" title="Horas de estudio" value="42 h" />
            <StatCard icon="◫" title="Simulacros realizados" value="7" />
          </div>

          <div className="dashboard-panels-eapa">
            <section className="soft-card dashboard-panel-eapa">
              <h2>Mis cursos en progreso</h2>
              <div className="progress-list-eapa">
                {(unlockedCourses.length ? unlockedCourses : courseProgress.slice(0, 4)).map((course) => (
                  <div key={course.courseSlug}>
                    <ProgressRow name={course.title} progress={course.progressPercent} />
                  </div>
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
        </main>
      </div>
    </main>
  );
}
