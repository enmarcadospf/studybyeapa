import Link from "next/link";

export default function CourseNotFound() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Curso no encontrado</p>
        <h1>Este curso todavia no existe o fue movido</h1>
        <p className="auth-copy">
          Puedes volver al catalogo y seguir explorando las opciones disponibles.
        </p>
        <Link className="primary-action" href="/courses">
          Ir al catalogo
        </Link>
      </section>
    </main>
  );
}
