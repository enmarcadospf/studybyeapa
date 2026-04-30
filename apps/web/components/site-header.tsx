export function SiteHeader() {
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
        <a href="/admin">Gestion</a>
        <a href="/auth/login">Entrar</a>
        <a className="nav-cta" href="/auth/register">
          Inscribirme
        </a>
      </nav>
    </header>
  );
}
