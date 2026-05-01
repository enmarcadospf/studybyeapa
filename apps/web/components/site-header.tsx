import Link from "next/link";
import { getCurrentStudentSession } from "../lib/server/session";
import { Logo } from "./ui/logo";

export async function SiteHeader() {
  const student = await getCurrentStudentSession();

  return (
    <header className="top-navbar">
      <Link href="/" className="top-navbar-brand">
        <Logo small />
      </Link>
      <nav className="top-navbar-links" aria-label="Principal">
        <Link href="/metodologia">Metodología</Link>
        <Link href="/courses">Cursos</Link>
        <Link href={student ? "/student" : "/auth/register"}>Estudiante</Link>
        <Link href={student ? "/settings" : "/auth/login"}>Configuración</Link>
        <Link href="/auth/login">Entrar</Link>
      </nav>
      <div className="top-navbar-actions">
        {student ? (
          <form action="/api/auth/logout" method="post">
            <button className="primary-btn" type="submit">Cerrar sesión</button>
          </form>
        ) : (
          <Link href="/auth/register" className="primary-btn">
            Inscribirme
          </Link>
        )}
      </div>
    </header>
  );
}
