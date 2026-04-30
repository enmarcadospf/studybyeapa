import { redirect } from "next/navigation";
import { LoginForm } from "../../../components/auth/login-form";
import { getCurrentStudentSession } from "../../../lib/server/session";

export default async function LoginPage() {
  const student = await getCurrentStudentSession();

  if (student) {
    redirect("/student");
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div>
          <p className="eyebrow">Acceso</p>
          <h1>Entrar a la plataforma</h1>
          <p className="auth-copy">
            Inicia sesion como estudiante para seguir tus modulos, repasos y
            progreso guardado.
          </p>
        </div>

        <LoginForm />

        <p className="auth-footer">
          Aun sin cuenta? <a href="/auth/register">Crear una cuenta</a>
        </p>
      </section>
    </main>
  );
}
