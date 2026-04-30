import Link from "next/link";
import { courseFocusAreas } from "@academia/shared";
import { getCourses } from "../../lib/api";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="catalog-shell">
      <section className="catalog-hero catalog-hero-grid">
        <div>
          <p className="eyebrow">Explorar cursos</p>
          <h1>Estudia por materias, sistemas y modulos bien organizados</h1>
          <p className="catalog-copy">
            La plataforma se divide de forma clara: primero eliges la materia,
            luego entras al curso y dentro encuentras modulos, lecciones y
            repaso guiado.
          </p>
        </div>
        <div className="catalog-side-card">
          <h2>Empieza como estudiante</h2>
          <p>
            Crea tu cuenta, elige un curso y desbloquea acceso completo con tu
            suscripcion.
          </p>
          <div className="stack-actions">
            <Link className="primary-action" href="/auth/register">
              Crear cuenta
            </Link>
            <Link className="secondary-action" href="/auth/login">
              Iniciar sesion
            </Link>
          </div>
        </div>
      </section>

      <section className="catalog-grid">
        {courses.map((course) => (
          <article className="course-card course-card-large course-browser-card" key={course.id}>
            <div className="course-browser-head">
              <div>
                <p className="course-category">{course.category}</p>
                <h2>{course.title}</h2>
              </div>
              <span className="module-badge">USD {course.priceUsd}</span>
            </div>
            <p>{course.summary}</p>
            <div className="course-topic-row">
              {(courseFocusAreas[course.slug] ?? []).map((topic) => (
                <span className="topic-chip" key={topic}>
                  {topic}
                </span>
              ))}
            </div>
            <div className="course-meta">
              <span>{course.level}</span>
              <span>{course.lessons} lecciones</span>
              <span>{course.durationHours} horas</span>
            </div>
            <div className="course-actions">
              <Link className="primary-action" href={`/courses/${course.slug}`}>
                Entrar al curso
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
