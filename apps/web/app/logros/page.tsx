import { redirect } from "next/navigation";
import { AchievementsPanel } from "../../components/student/achievements-panel";
import { StudentSidebar } from "../../components/student/student-sidebar";
import { getCurrentStudentSession } from "../../lib/server/session";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const student = await getCurrentStudentSession();

  if (!student) {
    redirect("/auth/login");
  }

  return (
    <main className="dashboard-shell-eapa">
      <div className="dashboard-grid-eapa">
        <StudentSidebar activeHref="/logros" />
        <section className="soft-card dashboard-main-eapa">
          <div className="profile-page-head-eapa">
            <span className="pill-badge-eapa">Logros</span>
            <h1>Mis logros</h1>
            <p>Visualiza tu progreso, metas desbloqueadas y hábitos de estudio dentro de Study by EAPA.</p>
          </div>
          <AchievementsPanel student={student} />
        </section>
      </div>
    </main>
  );
}
