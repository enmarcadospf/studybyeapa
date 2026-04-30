import Link from "next/link";
import { getCurrentStudentSession } from "../lib/server/session";
import { AppButton } from "./ui/app-button";
import { Logo } from "./ui/logo";

export async function SiteHeader() {
  const student = await getCurrentStudentSession();
  const firstName = student?.fullName.split(" ")[0] ?? null;

  return (
    <header className="site-header">
      <Link href="/">
        <Logo small />
      </Link>
      <nav className="site-nav" aria-label="Principal">
        <a href="/metodologia">Metodologia</a>
        <a href="/courses">Cursos</a>
        <a href="/student">Estudiante</a>
        <a href="/simulacros">Simulacros</a>
        <a href="/settings">Configuracion</a>
        {student ? (
          <>
            <span className="session-pill">Hola, {firstName}</span>
            <form action="/api/auth/logout" method="post">
              <button className="nav-text-button" type="submit">Salir</button>
            </form>
          </>
        ) : (
          <>
            <a href="/auth/login">Entrar</a>
            <AppButton href="/auth/register">Inscribirme</AppButton>
          </>
        )}
      </nav>
    </header>
  );
}
