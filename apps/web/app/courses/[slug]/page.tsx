import Link from "next/link";
import {
  courseFocusAreas,
  modules,
  paymentMethodCards,
  studyToolCards,
} from "@academia/shared";
import { notFound } from "next/navigation";
import { StudyAssistant } from "../../../components/course/study-assistant";
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

export const dynamic = "force-dynamic";

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
      <section className="mock-course-layout">
        <aside className="mock-course-sidebar">
          <div className="mock-course-sidebar-head">
            <strong>{course.title}</strong>
            <span>{courseModules.length} módulos</span>
          </div>
          <div className="progress-bar" aria-hidden="true">
            <span style={{ width: "70%" }} />
          </div>
          <div className="mock-course-module-list">
            {courseModules.map((module, index) => (
              <a
                className={index === 1 ? "mock-course-module is-active" : "mock-course-module"}
                href={`#${module.id}`}
                key={module.id}
              >
                {index + 1}. {module.title}
              </a>
            ))}
          </div>
        </aside>

        <section className="mock-course-main">
          <p className="course-category">2. {courseModules[1]?.title ?? "Sistema oseo"}</p>
          <h1>{courseModules[1]?.title ?? course.title}</h1>
          <p className="course-detail-summary">
            Aprende sobre el tema con contenido humano, claro, estructurado y enfocado en comprensión real.
          </p>
          <div className="mock-course-body">
            <div className="mock-course-figure">🦴</div>
            <div className="mock-course-points">
              <strong>Puntos clave</strong>
              <ul>
                <li>Soporte del cuerpo</li>
                <li>Protección de órganos</li>
                <li>Movimiento</li>
                <li>Producción de células sanguíneas</li>
                <li>Almacenamiento de minerales</li>
              </ul>
            </div>
          </div>
          <div className="mock-course-footer">
            <button className="ghost-action" type="button">Anterior</button>
            <span>2 / {courseModules.length || 12}</span>
            <button className="primary-action" type="button">Siguiente</button>
          </div>
        </section>
      </section>

      <section className="subscription-panel">
        <div className="subscription-copy">
          <p className="eyebrow">Acceso al curso</p>
          <h2>Tienes que suscribirte para poder tener acceso completo</h2>
          <p className="catalog-copy">
            Puedes explorar la estructura del curso, pero para abrir todas las
            lecciones, generar flashcards, usar el quiz y presentar exámenes,
            el estudiante debe pagar la suscripción o compra del curso.
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
          <h2>Módulos y lecciones del curso</h2>
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
                        <p className="lesson-kicker">Lección {lesson.order}</p>
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
                            Bloqueado hasta suscripción
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
            <h3>Pregúntale al tema</h3>
            <p>
              El estudiante podrá escribir dudas, pedir ejemplos o resumir una
              lección sin salir del módulo.
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
        <StudyAssistant courseSlug={course.slug} lessons={courseLessons} />
      </section>
    </main>
  );
}
