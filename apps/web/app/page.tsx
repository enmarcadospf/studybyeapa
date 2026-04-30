import {
  APP_NAME,
  APP_TAGLINE,
  LEARNING_LOOP,
  features,
  roles,
} from "@academia/shared";
import { getCourses, getPlatformStats } from "../lib/api";
import { AppButton } from "../components/ui/app-button";
import { MascotIllustration } from "../components/ui/mascot-illustration";
import { ProgressCard } from "../components/ui/progress-card";
import { CourseCard } from "../components/ui/course-card";
import { courseFocusAreas } from "@academia/shared";

export default async function HomePage() {
  const [stats, courses] = await Promise.all([
    getPlatformStats(),
    getCourses(),
  ]);

  return (
    <main className="page-shell">
      <section className="hero hero-home">
        <div className="hero-copy">
          <span className="eyebrow">Medicina simple, organizada y feliz</span>
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
            <AppButton href="/auth/register">Comienza ahora</AppButton>
            <AppButton href="/courses" variant="secondary">Ver cursos</AppButton>
          </div>
        </div>
        <div className="hero-card">
          <MascotIllustration />
        </div>
      </section>

      <section className="content-section">
        <div className="feature-grid feature-grid-metrics">
          <ProgressCard helper="Contenido claro y estructurado." label="Metodo comprobado" value="01" />
          <ProgressCard helper="Avanza segun tu propio plan." label="Estudia a tu ritmo" value="02" />
          <ProgressCard helper="No estudias solo en el proceso." label="Acompanamiento" value="03" />
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
            <CourseCard
              course={course}
              key={course.id}
              topics={courseFocusAreas[course.slug] ?? []}
            />
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
          <AppButton href="/auth/register">Crear cuenta de estudiante</AppButton>
        </div>
      </section>
    </main>
  );
}
