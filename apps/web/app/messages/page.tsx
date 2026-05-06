import { redirect } from "next/navigation";
import { MessagesPanel } from "../../components/student/messages-panel";
import { StudentSidebar } from "../../components/student/student-sidebar";
import { getCurrentStudentSession } from "../../lib/server/session";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const student = await getCurrentStudentSession();

  if (!student) {
    redirect("/auth/login");
  }

  return (
    <main className="dashboard-shell-eapa">
      <div className="dashboard-grid-eapa">
        <StudentSidebar activeHref="/messages" />
        <section className="soft-card dashboard-main-eapa">
          <div className="profile-page-head-eapa">
            <span className="pill-badge-eapa">Mensajes</span>
            <h1>Centro de mensajes</h1>
            <p>Recibe avisos de la plataforma y deja mensajes rápidos para organizar tus dudas.</p>
          </div>
          <MessagesPanel />
        </section>
      </div>
    </main>
  );
}
