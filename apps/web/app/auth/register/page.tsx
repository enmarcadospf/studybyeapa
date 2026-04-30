import { redirect } from "next/navigation";
import { RegisterForm } from "../../../components/auth/register-form";
import { getCurrentStudentSession } from "../../../lib/server/session";
import { MascotIllustration } from "../../../components/ui/mascot-illustration";
import { Logo } from "../../../components/ui/logo";

export default async function RegisterPage() {
  const student = await getCurrentStudentSession();

  if (student) {
    redirect("/student");
  }

  return (
    <main className="auth-shell">
      <section className="auth-layout">
        <article className="auth-feature-panel">
          <span className="eyebrow">Unete a la plataforma</span>
          <h1>Crea tu cuenta de estudiante</h1>
          <p className="auth-copy">
            Accede a cursos de medicina, flashcards, simulacros y herramientas
            para organizar tu aprendizaje.
          </p>
          <div className="auth-badge-grid">
            <div className="mini-badge-card">Cursos guiados</div>
            <div className="mini-badge-card">Flashcards</div>
            <div className="mini-badge-card">Quiz y examenes</div>
          </div>
          <MascotIllustration compact />
        </article>

        <section className="auth-card auth-card-elevated">
          <div className="auth-card-head">
            <Logo small />
            <div>
              <p className="eyebrow">Registro</p>
              <h2>Crea tu cuenta</h2>
              <p className="auth-copy">Es rapido, facil y gratuito.</p>
            </div>
          </div>

          <RegisterForm />

          <p className="auth-footer">
            El acceso de administrador y creador se gestiona internamente.
          </p>
        </section>
      </section>
    </main>
  );
}
