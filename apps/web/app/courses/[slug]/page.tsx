import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCourseBySlug,
  getCourses,
  getLessonsByCourseSlug,
} from "../../../lib/api";

type CourseDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { slug } = await params;
  const [course, courseLessons] = await Promise.all([
    getCourseBySlug(slug),
    getLessonsByCourseSlug(slug),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <main className="course-detail-shell">
      <section className="course-detail-hero">
        <div className="course-detail-copy">
          <p className="course-category">{course.category}</p>
          <h1>{course.title}</h1>
          <p className="course-detail-summary">{course.summary}</p>
          <div className="course-meta">
            <span>Nivel {course.level}</span>
            <span>{course.lessons} lecciones</span>
            <span>{course.durationHours} horas</span>
            <span>USD {course.priceUsd}</span>
          </div>
          <div className="hero-actions">
            <a className="primary-action" href="/auth/register">
              Inscribirme
            </a>
            <Link className="secondary-action" href="/courses">
              Volver al catalogo
            </Link>
          </div>
        </div>

        <aside className="course-outline">
          <p className="card-title">
            {course.slug === "anatomia"
              ? "Experiencia recomendada para anatomia"
              : "Lo que tendra esta vista"}
          </p>
          <ul>
            {course.slug === "anatomia" ? (
              <>
                <li>Videos por region o sistema</li>
                <li>Lectura de apoyo por tema</li>
                <li>Flashcards de estructuras clave</li>
                <li>Quiz y examen final de repaso</li>
              </>
            ) : (
              <>
                <li>Descripcion completa del curso</li>
                <li>Programa por modulos y lecciones</li>
                <li>Informacion del profesor</li>
                <li>Testimonios y preguntas frecuentes</li>
              </>
            )}
          </ul>
        </aside>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span>Lecciones</span>
          <h2>Contenido inicial del curso</h2>
        </div>
        <div className="detail-grid">
          {courseLessons.map((lesson) => (
            <article className="detail-card" key={lesson.id}>
              <p className="course-category">Leccion {lesson.order}</p>
              <h3>{lesson.title}</h3>
              <p>{lesson.summary}</p>
              <div className="course-meta">
                <span>
                  {lesson.contentType === "video" ? "Video" : "Lectura"}
                </span>
                <span>{lesson.durationMinutes} minutos</span>
                <span>{lesson.open ? "Disponible" : "Bloqueada"}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
