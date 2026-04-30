import Link from "next/link";
import { getCourses } from "../../lib/api";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="catalog-shell">
      <section className="catalog-hero">
        <p className="eyebrow">Catalogo</p>
        <h1>Explora cursos pensados para estudiar desde cualquier dispositivo</h1>
        <p className="catalog-copy">
          Esta es la base del marketplace educativo: una vista clara para
          descubrir cursos, comparar niveles y entrar al detalle de cada oferta.
        </p>
      </section>

      <section className="catalog-grid">
        {courses.map((course) => (
          <article className="course-card course-card-large" key={course.id}>
            <p className="course-category">{course.category}</p>
            <h2>{course.title}</h2>
            <p>{course.summary}</p>
            <div className="course-meta">
              <span>{course.level}</span>
              <span>{course.lessons} lecciones</span>
              <span>{course.durationHours} horas</span>
              <span>USD {course.priceUsd}</span>
            </div>
            <div className="course-actions">
              <Link className="primary-action" href={`/courses/${course.slug}`}>
                Ver curso
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
