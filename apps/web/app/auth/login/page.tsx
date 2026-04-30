import { redirect } from "next/navigation";
import { LoginForm } from "../../../components/auth/login-form";
import { getCurrentStudentSession } from "../../../lib/server/session";
import { MascotIllustration } from "../../../components/ui/mascot-illustration";
import { Logo } from "../../../components/ui/logo";

export default async function LoginPage() {
  const student = await getCurrentStudentSession();

  if (student) {
    redirect("/student");
  }

  return (
    <main className="auth-shell">
      <section className="auth-layout">
        <article className="auth-feature-panel">
          <span className="eyebrow">Bienvenido</span>
          <h1>Vuelve a tu espacio de estudio</h1>
          <p className="auth-copy">
            Inicia sesion como estudiante para retomar modulos, repasos,
            simulacros y tu progreso guardado.
          </p>
          <MascotIllustration compact />
        </article>

        <section className="auth-card auth-card-elevated">
          <div className="auth-card-head">
            <Logo small />
            <div>
              <p className="eyebrow">Acceso</p>
              <h2>Entrar a la plataforma</h2>
              <p className="auth-copy">Tu estudio sigue justo donde lo dejaste.</p>
            </div>
          </div>

          <LoginForm />

          <p className="auth-footer">
            Aun sin cuenta? <a href="/auth/register">Crear una cuenta</a>
          </p>
        </section>
      </section>
    </main>
  );
}
