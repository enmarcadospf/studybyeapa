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
    <main className="student-shell">
      <section className="workspace-layout">
        <StudentSidebar activeHref="/settings" />
        <div className="workspace-main">
          <section className="mock-simple-header">
            <div>
              <h1>Mi Perfil</h1>
              <p>Gestiona tu informacion personal y preferencias.</p>
            </div>
            <div className="mock-dashboard-mascot">◉</div>
          </section>
          <AccountHub courses={courses} student={student} />
        </div>
      </section>
    </main>
  );
}
