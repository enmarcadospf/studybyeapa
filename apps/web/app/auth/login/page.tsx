import { redirect } from "next/navigation";
import { LoginForm } from "../../../components/auth/login-form";
import { getCurrentStudentSession } from "../../../lib/server/session";
import { BrainBookIcon } from "../../../components/ui/logo";

export default async function LoginPage() {
  const student = await getCurrentStudentSession();

  if (student) {
    redirect("/student");
  }

  return (
    <main className="auth-shell-eapa">
      <section className="auth-grid-eapa">
        <article className="soft-card auth-showcase-eapa">
          <h1>
            Vuelve a tu espacio
            <br />
            de <span>estudio</span>
          </h1>
          <p>
            Inicia sesión como estudiante para retomar módulos, simulacros y tu progreso guardado.
          </p>
          <div className="auth-illustration-eapa">
            <BrainBookIcon className="hero-brain-icon" />
          </div>
        </article>

        <section className="soft-card auth-form-card-eapa">
          <div className="auth-form-brand">
            <BrainBookIcon className="auth-mini-brain" />
            <h2>Entrar a la plataforma</h2>
            <p>Tu estudio sigue justo donde lo dejaste.</p>
          </div>
          <LoginForm />
          <p className="auth-footer-eapa">
            ¿Aún sin cuenta? <a href="/auth/register">Crear una cuenta</a>
          </p>
        </section>
      </section>
    </main>
  );
}
