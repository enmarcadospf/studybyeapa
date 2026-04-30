import {
  APP_NAME,
  APP_TAGLINE,
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
          <h1>{APP_NAME}</h1>
          <p className="lead">{APP_TAGLINE}</p>
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
            <a className="primary-action" href="#modulos">
              Ver metodologia
            </a>
            <a className="secondary-action" href="/courses">
              Explorar cursos
            </a>
          </div>
        </div>
        <div className="hero-card">
          <p className="card-title">Pensado solo como web</p>
          <ul>
            <li>Lecciones en video o lectura</li>
            <li>Repaso con flashcards o quiz</li>
            <li>Examen final dificil por modulo</li>
          </ul>
        </div>
      </section>

      <section id="modulos" className="content-section">
        <div className="section-heading">
          <span>Metodologia</span>
          <h2>Estudio guiado con repaso automatico despues de cada tema</h2>
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
          <span>Como aprende el estudiante</span>
          <h2>Una herramienta hecha para estudiar mas facil, no para complicar</h2>
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
          <span>Experiencias</span>
          <h2>Dos vistas reales: estudiantes y tu gestion interna</h2>
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
          <h2>Materias medicas listas para transformarse en cursos reales</h2>
        </div>
        <div className="course-grid">
          {courses.map((course) => (
            <article className="course-card" key={course.id}>
              <p className="course-category">{course.category}</p>
              <h3>{course.title}</h3>
              <p>{course.summary}</p>
              <div className="course-meta">
                <span>{course.lessons} lecciones</span>
                <span>{course.durationHours} horas</span>
                <span>USD {course.priceUsd}</span>
              </div>
              <a className="text-link" href={`/courses/${course.slug}`}>
                Ver detalle
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span>Ejemplo real</span>
          <h2>En anatomia puedes mezclar video, lectura y repaso en el mismo flujo</h2>
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
    </main>
  );
}
