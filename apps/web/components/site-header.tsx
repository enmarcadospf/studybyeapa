export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand-mark" href="/">
        Academia Online
      </a>
      <nav className="site-nav" aria-label="Principal">
        <a href="/#modulos">Modulos</a>
        <a href="/courses">Cursos</a>
        <a href="/student">Estudiante</a>
        <a href="/admin">Gestion</a>
        <a href="/auth/login">Entrar</a>
        <a className="nav-cta" href="/auth/register">
          Crear cuenta
        </a>
      </nav>
    </header>
  );
}
