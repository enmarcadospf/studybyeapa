import { redirect } from "next/navigation";
import { NotesBoard } from "../../components/student/notes-board";
import { StudentSidebar } from "../../components/student/student-sidebar";
import { getCurrentStudentSession } from "../../lib/server/session";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const student = await getCurrentStudentSession();

  if (!student) {
    redirect("/auth/login");
  }

  return (
    <main className="dashboard-shell-eapa">
      <div className="dashboard-grid-eapa">
        <StudentSidebar activeHref="/notes" />
        <section className="soft-card dashboard-main-eapa">
          <div className="profile-page-head-eapa">
            <span className="pill-badge-eapa">Notas</span>
            <h1>Mis notas</h1>
            <p>Guarda apuntes rápidos por curso para repasar antes de flashcards, quiz o simulacros.</p>
          </div>
          <NotesBoard />
        </section>
      </div>
    </main>
  );
}
