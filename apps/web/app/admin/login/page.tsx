import { redirect } from "next/navigation";
import { LoginForm } from "../../../components/auth/login-form";
import { BrainBookIcon } from "../../../components/ui/logo";
import {
  getCurrentAdminSession,
  getCurrentStudentSession,
} from "../../../lib/server/session";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdminSession();

  if (admin) {
    redirect("/admin");
  }

  const student = await getCurrentStudentSession();

  return (
    <main className="auth-shell-eapa">
      <section className="auth-grid-eapa">
        <article className="soft-card auth-showcase-eapa">
          <h1>
            Editor interno
            <br />
            de <span>Study</span>
          </h1>
          <p>
            Entra con tu correo y contraseña normal. Si ese correo está
            autorizado como admin, la plataforma abrirá el editor interno.
          </p>
          <div className="auth-illustration-eapa">
            <BrainBookIcon className="hero-brain-icon" />
          </div>
        </article>

        <section className="soft-card auth-form-card-eapa">
          <div className="auth-form-brand">
            <BrainBookIcon className="auth-mini-brain" />
            <h2>{student ? "Cuenta sin permisos" : "Entrar como admin"}</h2>
            <p>
              {student
                ? "Esta sesión no está autorizada como administrador."
                : "Usa tu cuenta real. No necesitas códigos especiales."}
            </p>
          </div>
          {student ? (
            <div className="form-stack-eapa">
              <p className="form-message form-message-error">
                Si este debe ser tu usuario admin, agrega este correo a la lista
                segura del servidor o entra con la cuenta propietaria.
              </p>
              <form action="/api/auth/logout" method="post">
                <button className="secondary-btn secondary-btn-full" type="submit">
                  Cerrar esta sesión
                </button>
              </form>
            </div>
          ) : (
            <LoginForm />
          )}
        </section>
      </section>
    </main>
  );
}
