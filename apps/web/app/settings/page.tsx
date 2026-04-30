import { redirect } from "next/navigation";
import { AccountHub } from "../../components/student/account-hub";
import { StudentSidebar } from "../../components/student/student-sidebar";
import { PageHeader } from "../../components/ui/page-header";
import { getCourses } from "../../lib/api";
import { getCurrentStudentSession } from "../../lib/server/session";

export default async function SettingsPage() {
  const student = await getCurrentStudentSession();

  if (!student) {
    redirect("/auth/login");
  }

  const courses = await getCourses();

  return (
    <main className="student-shell">
      <section className="workspace-layout">
        <StudentSidebar activeHref="/settings" />
        <div className="workspace-main">
          <section className="dashboard-hero dashboard-hero-soft">
            <PageHeader
              description="Actualiza tu perfil, tu contrasena, tu suscripcion y los dispositivos conectados."
              eyebrow="Configuracion"
              title="Tu cuenta"
            />
          </section>
          <AccountHub courses={courses} student={student} />
        </div>
      </section>
    </main>
  );
}
