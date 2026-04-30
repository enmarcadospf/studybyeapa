import { redirect } from "next/navigation";
import { AccountHub } from "../../components/student/account-hub";
import { StudentSidebar } from "../../components/student/student-sidebar";
import { getCourses } from "../../lib/api";
import { getCurrentStudentSession } from "../../lib/server/session";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const student = await getCurrentStudentSession();

  if (!student) {
    redirect("/auth/login");
  }

  const courses = await getCourses();

  return (
    <main className="dashboard-shell-eapa">
      <div className="dashboard-grid-eapa">
        <StudentSidebar activeHref="/settings" />
        <main className="soft-card dashboard-main-eapa">
          <div className="profile-page-head-eapa">
            <h1>Mi Perfil</h1>
            <p>Gestiona tu informacion personal y preferencias.</p>
          </div>
          <div className="profile-tabs-eapa">
            <span className="is-active">Mi perfil</span>
            <span>Preferencias</span>
            <span>Seguridad</span>
            <span>Notificaciones</span>
            <span>Facturacion</span>
          </div>
          <AccountHub courses={courses} student={student} />
        </main>
      </div>
    </main>
  );
}
