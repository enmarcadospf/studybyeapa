import { getCurrentStudentSession } from "../lib/server/session";

export async function SiteHeader() {
  const student = await getCurrentStudentSession();
  const firstName = student?.fullName.split(" ")[0] ?? null;

  return (
    <header className="site-header">
      <a className="brand-mark" href="/">
        <img
          alt="Study by EAPA"
          className="brand-logo"
          height="40"
          src="/studybyeapa-logo.svg"
          width="40"
        />
        <span className="brand-copy">
          <strong>Study by EAPA</strong>
          <small>Medicina con repaso inteligente</small>
        </span>
      </a>
      <nav className="site-nav" aria-label="Principal">
        <a href="/#metodologia">Metodologia</a>
        <a href="/courses">Cursos</a>
        <a href="/student">Estudiante</a>
        <a href="/admin">Configuracion</a>
        {student ? (
          <>
            <span className="session-pill">Hola, {firstName}</span>
            <form action="/api/auth/logout" method="post">
              <button className="nav-text-button" type="submit">
                Salir
              </button>
            </form>
          </>
        ) : (
          <>
            <a href="/auth/login">Entrar</a>
            <a className="nav-cta" href="/auth/register">
              Inscribirme
            </a>
          </>
        )}
      </nav>
    </header>
  );
}
