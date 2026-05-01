import { redirect } from "next/navigation";
import { RegisterForm } from "../../../components/auth/register-form";
import { getCurrentStudentSession } from "../../../lib/server/session";
import { BrainBookIcon } from "../../../components/ui/logo";

export default async function RegisterPage() {
  const student = await getCurrentStudentSession();

  if (student) {
    redirect("/student");
  }

  return (
    <main className="auth-shell-eapa">
      <section className="auth-grid-eapa">
        <article className="soft-card auth-showcase-eapa">
          <h1>
            Crea tu cuenta
            <br />
            de <span>estudiante</span>
          </h1>
          <p>
            Accede a cursos, flashcards, simulacros y seguimiento de progreso.
          </p>
          <div className="auth-illustration-eapa">
            <BrainBookIcon className="hero-brain-icon" />
          </div>
        </article>

        <section className="soft-card auth-form-card-eapa">
          <div className="auth-form-brand">
            <BrainBookIcon className="auth-mini-brain" />
            <h2>Crea tu cuenta</h2>
            <p>Es rápido, fácil y gratuito.</p>
          </div>
          <RegisterForm />
          <p className="auth-footer-eapa">
            El acceso de administrador se maneja internamente.
          </p>
        </section>
      </section>
    </main>
  );
}
