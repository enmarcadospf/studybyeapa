import Link from "next/link";
import {
  courseFocusAreas,
  modules,
  paymentMethodCards,
  studyToolCards,
} from "@academia/shared";
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

  const courseModules = modules.filter((item) => item.courseSlug === slug);

  return (
    <main className="course-detail-shell">
      <section className="course-detail-hero">
        <div className="course-detail-copy">
          <p className="course-category">{course.category}</p>
          <h1>{course.title}</h1>
          <p className="course-detail-summary">{course.summary}</p>
          <p className="course-support-line">
            Video, lectura, IA, flashcards y quiz desde una sola vista.
          </p>
          <div className="course-topic-row">
            {(courseFocusAreas[course.slug] ?? []).map((topic) => (
              <span className="topic-chip" key={topic}>
                {topic}
              </span>
            ))}
          </div>
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
          <p className="card-title">Herramientas del modulo</p>
          <div className="tools-stack">
            {studyToolCards.map((tool) => (
              <div className="tool-mini-card" key={tool.id}>
                <strong>{tool.title}</strong>
                <p>{tool.description}</p>
                <button className="ghost-action" type="button">
                  {tool.actionLabel}
                </button>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="subscription-panel">
        <div className="subscription-copy">
          <p className="eyebrow">Acceso al curso</p>
          <h2>Tienes que suscribirte para poder tener acceso completo</h2>
          <p className="catalog-copy">
            Puedes explorar la estructura del curso, pero para abrir todas las
            lecciones, generar flashcards, usar el quiz y presentar examenes,
            el estudiante debe pagar la suscripcion o compra del curso.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="/auth/register">
              Suscribirme ahora
            </a>
            <a className="secondary-action" href="/auth/login">
              Ya tengo cuenta
            </a>
          </div>
        </div>
        <div className="payment-grid">
          {paymentMethodCards.map((method) => (
            <article className="payment-card" key={method.id}>
              <span className="module-badge">{method.badge}</span>
              <h3>{method.title}</h3>
              <p>{method.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span>Estructura</span>
          <h2>Modulos y lecciones del curso</h2>
        </div>
        <div className="module-stack">
          {courseModules.map((module) => {
            const moduleLessons = courseLessons.filter(
              (lesson) => lesson.moduleId === module.id,
            );

            return (
              <article className="module-card" key={module.id}>
                <div className="module-head">
                  <div>
                    <p className="course-category">{module.title}</p>
                    <h3>{module.summary}</h3>
                  </div>
                  <span className="module-badge">{module.examLabel}</span>
                </div>
                <div className="lesson-list">
                  {moduleLessons.map((lesson) => (
                    <article className="lesson-row" key={lesson.id}>
                      <div>
                        <p className="lesson-kicker">Leccion {lesson.order}</p>
                        <h4>{lesson.title}</h4>
                        <p>{lesson.summary}</p>
                      </div>
                      <div className="lesson-side">
                        <span className="lesson-type">
                          {lesson.contentType === "video" ? "Video" : "Lectura"}
                        </span>
                        <span>{lesson.durationMinutes} min</span>
                        <div className="lesson-actions">
                          {lesson.supportsFlashcards ? (
                            <button className="ghost-action" type="button">
                              Flashcards
                            </button>
                          ) : null}
                          {lesson.supportsQuiz ? (
                            <button className="ghost-action" type="button">
                              Quiz IA
                            </button>
                          ) : null}
                          <button className="ghost-action" type="button">
                            Bloqueado hasta suscripcion
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span>IA del curso</span>
          <h2>Un espacio visible para escribir y estudiar con ayuda</h2>
        </div>
        <div className="detail-grid">
          <article className="detail-card">
            <h3>Preguntale al tema</h3>
            <p>
              El estudiante podra escribir dudas, pedir ejemplos o resumir una
              leccion sin salir del modulo.
            </p>
          </article>
          <article className="detail-card">
            <h3>Generar repaso</h3>
            <p>
              Desde aqui se activaran los botones para crear flashcards y quiz
              desde el material que tu hayas subido.
            </p>
          </article>
          <article className="detail-card">
            <h3>Preparacion de examen</h3>
            <p>
              La IA tambien guiara el salto al examen final con preguntas mas
              exigentes y mejor enfocadas.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
