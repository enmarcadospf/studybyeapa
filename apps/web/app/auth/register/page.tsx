import { redirect } from "next/navigation";
import { RegisterForm } from "../../../components/auth/register-form";
import { getCurrentStudentSession } from "../../../lib/server/session";

export default async function RegisterPage() {
  const student = await getCurrentStudentSession();

  if (student) {
    redirect("/student");
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div>
          <p className="eyebrow">Registro</p>
          <h1>Crea tu cuenta de estudiante</h1>
          <p className="auth-copy">
            Este registro es solo para estudiantes. Desde aqui podran entrar a
            sus cursos, repasar con flashcards y resolver quiz o examenes.
          </p>
        </div>

        <RegisterForm />

        <p className="auth-footer">
          El acceso de administrador y creador se gestiona internamente.
        </p>
      </section>
    </main>
  );
}
