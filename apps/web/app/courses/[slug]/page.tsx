import Link from "next/link";
import {
  courseFocusAreas,
  type Lesson,
  modules,
  paymentMethodCards,
  studyToolCards,
} from "@academia/shared";
import { notFound } from "next/navigation";
import { StudyAssistant } from "../../../components/course/study-assistant";
import {
  getCourseBySlug,
  getLessonsByCourseSlug,
} from "../../../lib/api";
import { getCurrentStudentSession } from "../../../lib/server/session";

type CourseDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    lesson?: string;
  }>;
};

export const dynamic = "force-dynamic";

function LessonVisual({ courseSlug }: { courseSlug: string }) {
  if (courseSlug === "anatomia") {
    return (
      <svg viewBox="0 0 260 260" aria-hidden="true">
        <path className="bone-soft" d="M130 27v196" />
        <path className="bone-line" d="M130 44c-37 20-58 54-58 91 0 26 12 49 33 67" />
        <path className="bone-line" d="M130 44c37 20 58 54 58 91 0 26-12 49-33 67" />
        <path className="bone-line" d="M82 91c26-12 70-12 96 0" />
        <path className="bone-line" d="M74 123c34-16 78-16 112 0" />
        <path className="bone-line" d="M78 154c31-13 73-13 104 0" />
        <path className="bone-line" d="M93 184c24-8 50-8 74 0" />
        <circle className="bone-dot" cx="130" cy="44" r="18" />
      </svg>
    );
  }

  if (courseSlug === "infectologia" || courseSlug === "microbiologia") {
    return (
      <svg viewBox="0 0 260 260" aria-hidden="true">
        <circle className="bone-soft-fill" cx="130" cy="130" r="58" />
        <circle className="bone-line-fill" cx="130" cy="130" r="46" />
        <path className="bone-line" d="M130 34v36" />
        <path className="bone-line" d="M130 190v36" />
        <path className="bone-line" d="m47 82 32 18" />
        <path className="bone-line" d="m181 160 32 18" />
        <path className="bone-line" d="m213 82-32 18" />
        <path className="bone-line" d="m79 160-32 18" />
        <circle className="bone-dot" cx="111" cy="119" r="8" />
        <circle className="bone-dot" cx="148" cy="143" r="8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 260 260" aria-hidden="true">
      <path className="bone-line-fill" d="M130 210s-78-51-95-105C24 68 46 39 80 39c23 0 39 11 50 29 11-18 27-29 50-29 34 0 56 29 45 66-17 54-95 105-95 105Z" />
      <path className="bone-line" d="M54 132h42l18-38 31 76 23-52h38" />
    </svg>
  );
}

function lessonTypeLabel(lesson: Lesson) {
  return lesson.contentType === "video" ? "Video guiado" : "Lectura";
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: CourseDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const [course, courseLessons, student] = await Promise.all([
    getCourseBySlug(slug),
    getLessonsByCourseSlug(slug),
    getCurrentStudentSession(),
  ]);

  if (!course) {
    notFound();
  }

  const courseModules = modules.filter((item) => item.courseSlug === slug);
  const selectedLesson =
    courseLessons.find((lesson) => lesson.id === resolvedSearchParams?.lesson) ??
    courseLessons[0] ??
    null;
  const selectedModule = selectedLesson
    ? courseModules.find((module) => module.id === selectedLesson.moduleId) ?? courseModules[0]
    : courseModules[0];
  const selectedLessonIndex = selectedLesson
    ? courseLessons.findIndex((lesson) => lesson.id === selectedLesson.id)
    : -1;
  const previousLesson = selectedLessonIndex > 0 ? courseLessons[selectedLessonIndex - 1] : null;
  const nextLesson =
    selectedLessonIndex >= 0 && selectedLessonIndex < courseLessons.length - 1
      ? courseLessons[selectedLessonIndex + 1]
      : null;
  const hasCourseAccess =
    Boolean(student?.enrolledCourseSlugs.includes(slug)) ||
    Boolean(
      student?.subscriptions.some(
        (subscription) => subscription.courseSlug === slug && subscription.status === "active",
      ),
    );
  const canUseStudyTools = hasCourseAccess && Boolean(selectedLesson);
  const focusAreas = courseFocusAreas[slug] ?? [
    course.category,
    "Repaso activo",
    "Preguntas clínicas",
  ];

  return (
    <main className="course-detail-shell">
      <section className="course-lesson-layout-eapa">
        <aside className="course-lesson-sidebar-eapa">
          <div className="course-lesson-sidebar-head-eapa">
            <strong>{course.title}</strong>
            <span>{courseModules.length} módulos · {course.lessons} lecciones</span>
          </div>
          <div className="course-lesson-sidebar-progress-eapa">
            <div>
              <span>Progreso del curso</span>
              <strong>{hasCourseAccess ? "12%" : "Vista previa"}</strong>
            </div>
            <div className="progress-track-eapa" aria-hidden="true">
              <span style={{ width: hasCourseAccess ? "12%" : "6%" }} />
            </div>
          </div>
          <div className="course-lesson-module-list-eapa">
            {courseModules.map((module, moduleIndex) => {
              const moduleLessons = courseLessons.filter(
                (lesson) => lesson.moduleId === module.id,
              );

              return (
                <div className="course-lesson-module-group-eapa" id={module.id} key={module.id}>
                  <p>{moduleIndex + 1}. {module.title}</p>
                  {moduleLessons.map((lesson) => {
                    const isActive = selectedLesson?.id === lesson.id;
                    const isLocked = !hasCourseAccess && !lesson.open;

                    return (
                      <Link
                        className={
                          isActive
                            ? "course-lesson-link-eapa is-active"
                            : isLocked
                              ? "course-lesson-link-eapa is-locked"
                              : "course-lesson-link-eapa"
                        }
                        href={`/courses/${slug}?lesson=${lesson.id}`}
                        key={lesson.id}
                      >
                        <span>{lesson.order}</span>
                        <strong>{lesson.title}</strong>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </aside>

        <section className="course-lesson-main-eapa">
          <div className="course-lesson-main-head-eapa">
            <div>
              <p className="course-category">{selectedModule?.title ?? course.category}</p>
              <h1>{selectedLesson?.title ?? course.title}</h1>
              <p className="course-detail-summary">
                {selectedLesson?.summary ?? course.summary}
              </p>
            </div>
            <span className={hasCourseAccess ? "course-access-pill-eapa is-active" : "course-access-pill-eapa"}>
              {hasCourseAccess ? "Acceso activo" : "Vista previa"}
            </span>
          </div>

          <div className="course-lesson-tabs-eapa">
            <a href="#lesson-content" className="is-active">Lección</a>
            <a href="#study-tools">Recursos</a>
            <a href="#ai-study">IA</a>
          </div>

          <div className="course-lesson-body-eapa" id="lesson-content">
            <div className="course-lesson-figure-eapa">
              <LessonVisual courseSlug={slug} />
            </div>
            <div className="course-lesson-points-eapa">
              <strong>Puntos clave</strong>
              <ul>
                {focusAreas.slice(0, 5).map((area) => (
                  <li key={area}>{area}</li>
                ))}
                <li>{selectedLesson ? lessonTypeLabel(selectedLesson) : "Lección guiada"}</li>
              </ul>
            </div>
          </div>

          <div className="course-tool-strip-eapa" id="study-tools">
            {studyToolCards.map((tool) => (
              <article key={tool.id}>
                <span>{canUseStudyTools ? "Disponible" : "Bloqueado"}</span>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
              </article>
            ))}
          </div>

          <div className="course-lesson-footer-eapa">
            {previousLesson ? (
              <Link className="ghost-action" href={`/courses/${slug}?lesson=${previousLesson.id}`}>
                ← Anterior
              </Link>
            ) : (
              <span />
            )}
            <span>
              {selectedLessonIndex + 1 || 1} / {courseLessons.length || 1}
            </span>
            {nextLesson ? (
              <Link className="primary-action" href={`/courses/${slug}?lesson=${nextLesson.id}`}>
                Siguiente →
              </Link>
            ) : (
              <Link className="primary-action" href="#ai-study">
                Repasar con IA
              </Link>
            )}
          </div>
        </section>
      </section>

      {!hasCourseAccess ? (
      <section className="course-access-panel-eapa">
        <div className="subscription-copy">
          <p className="eyebrow">Acceso al curso</p>
          <h2>Tienes que suscribirte para poder tener acceso completo</h2>
          <p className="catalog-copy">
            Puedes explorar la estructura del curso, pero para abrir todas las
            lecciones, generar flashcards, usar el quiz y presentar exámenes,
            el estudiante debe pagar la suscripción o compra del curso.
          </p>
          <div className="hero-actions">
            <Link className="primary-action" href={student ? "/settings" : "/auth/register"}>
              {student ? "Gestionar suscripción" : "Crear cuenta"}
            </Link>
            <Link className="secondary-action" href={student ? "/courses" : "/auth/login"}>
              {student ? "Ver más cursos" : "Ya tengo cuenta"}
            </Link>
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
      ) : null}

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
                            <a className="ghost-action" href={hasCourseAccess ? "#ai-study" : "#study-tools"}>
                              Flashcards
                            </a>
                          ) : null}
                          {lesson.supportsQuiz ? (
                            <a className="ghost-action" href={hasCourseAccess ? "#ai-study" : "#study-tools"}>
                              Quiz IA
                            </a>
                          ) : null}
                          {!hasCourseAccess ? (
                            <span className="lesson-lock-pill-eapa">
                              Bloqueado hasta suscripción
                            </span>
                          ) : null}
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
        <div id="ai-study">
          {hasCourseAccess ? (
            <StudyAssistant courseSlug={course.slug} lessons={courseLessons} />
          ) : (
            <section className="study-assistant-card assistant-locked-eapa">
              <p className="course-category">IA bloqueada</p>
              <h3>Suscríbete para generar flashcards, quiz y modo residente.</h3>
              <p>
                Protegemos esta función para que el uso de OpenAI quede reservado
                a estudiantes con acceso activo al curso.
              </p>
              <Link className="primary-action" href={student ? "/settings" : "/auth/register"}>
                {student ? "Gestionar acceso" : "Inscribirme"}
              </Link>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
