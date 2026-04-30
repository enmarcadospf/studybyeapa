import {
  APP_NAME,
  APP_TAGLINE,
  BRAND,
  LEARNING_LOOP,
  features,
  roles,
} from "@academia/shared";
import { getCourses, getPlatformStats } from "../lib/api";

export default async function HomePage() {
  const [stats, courses] = await Promise.all([
    getPlatformStats(),
    getCourses(),
  ]);

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Plataforma web de estudio medico</span>
          <h1>Aprende medicina facil y feliz</h1>
          <p className="lead">{APP_TAGLINE}</p>
          <div className="hero-chip-row">
            <span className="hero-chip">Video + lectura</span>
            <span className="hero-chip">Flashcards automaticas</span>
            <span className="hero-chip">Quiz por dificultad</span>
          </div>
          <div className="stats-strip">
            <div>
              <strong>{stats.students}+</strong>
              <span>estudiantes</span>
            </div>
            <div>
              <strong>{stats.courses}</strong>
              <span>cursos base</span>
            </div>
            <div>
              <strong>{stats.completionRate}%</strong>
              <span>finalizacion</span>
            </div>
          </div>
          <div className="hero-actions">
            <a className="primary-action" href="#metodologia">
              Ver metodologia
            </a>
            <a className="secondary-action" href="/courses">
              Explorar cursos
            </a>
          </div>
        </div>
        <div className="hero-card">
          <div className="brand-preview">
            <img
              alt="Study by EAPA"
              className="brand-preview-logo"
              src="/studybyeapa-logo.svg"
            />
            <div>
              <p className="card-title">Un estudio mas claro y minimalista</p>
              <p className="hero-note">
                Azul, blanco y gris claro para que el contenido se sienta limpio
                y serio desde la primera vista.
              </p>
            </div>
          </div>
          <div className="ai-box">
            <p className="ai-label">IA integrada</p>
            <h3>Escribe preguntas, pide resumenes y genera repaso.</h3>
            <p>
              La IA sera una herramienta visible dentro de cada modulo, no un
              detalle escondido.
            </p>
          </div>
        </div>
      </section>

      <section id="metodologia" className="content-section">
        <div className="section-heading">
          <span>Metodologia</span>
          <h2>Una experiencia pensada para que estudiar sea mas facil y mas claro</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span>Ruta de aprendizaje</span>
          <h2>El estudiante sabe exactamente que hacer despues de cada tema</h2>
        </div>
        <div className="feature-grid">
          {LEARNING_LOOP.map((item) => (
            <article className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="roles" className="content-section">
        <div className="section-heading">
          <span>Vista del producto</span>
          <h2>Solo dos frentes reales: estudiantes y tu configuracion interna</h2>
        </div>
        <div className="role-grid">
          {roles.map((role) => (
            <article className="role-card" key={role.name}>
              <p className="role-name">{role.name}</p>
              <p>{role.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span>Catalogo inicial</span>
          <h2>Materias medicas listas para crecer como cursos reales</h2>
        </div>
        <div className="course-grid">
          {courses.map((course) => (
            <article
              className={`course-card ${course.featured ? "course-card-featured" : ""}`}
              key={course.id}
            >
              <p className="course-category">{course.category}</p>
              <h3>{course.title}</h3>
              <p>{course.summary}</p>
              <div className="course-meta">
                <span>{course.lessons} lecciones</span>
                <span>{course.durationHours} horas</span>
                <span>USD {course.priceUsd}</span>
              </div>
              <a className="text-link" href={`/courses/${course.slug}`}>
                Ver curso
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span>Ejemplo de anatomia</span>
          <h2>Video, lectura, IA y repaso dentro del mismo modulo</h2>
        </div>
        <div className="detail-grid">
          <article className="detail-card">
            <h3>Contenido visual</h3>
            <p>
              Subes videos de anatomia para que el estudiante vea estructuras,
              relaciones y referencias importantes con apoyo visual.
            </p>
          </article>
          <article className="detail-card">
            <h3>Repaso inmediato</h3>
            <p>
              Despues del video o de la lectura, el sistema ofrece flashcards o
              quiz para reforzar justo lo que acaba de estudiar.
            </p>
          </article>
          <article className="detail-card">
            <h3>Evaluacion exigente</h3>
            <p>
              Cuando termina el tema, pasa a una evaluacion final mas dificil,
              pensada para comprobar si realmente domina el contenido.
            </p>
          </article>
        </div>
      </section>

      <section className="content-section cta-section">
        <div className="cta-panel">
          <div>
            <span className="eyebrow">Inscripcion</span>
            <h2>Una sola cuenta, una sola experiencia: estudiantes</h2>
            <p className="catalog-copy">
              El creador administra todo por dentro. El estudiante solo ve un
              acceso claro, limpio y directo a sus cursos.
            </p>
          </div>
          <a
            className="primary-action"
            href="/auth/register"
            style={{ backgroundColor: BRAND.primary }}
          >
            Crear cuenta de estudiante
          </a>
        </div>
      </section>
    </main>
  );
}
