import {
  features,
} from "@academia/shared";
import { getCourses, getPlatformStats } from "../lib/api";
import { AppButton } from "../components/ui/app-button";
import { MascotIllustration } from "../components/ui/mascot-illustration";
import { CourseCard } from "../components/ui/course-card";
import { courseFocusAreas } from "@academia/shared";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, courses] = await Promise.all([
    getPlatformStats(),
    getCourses(),
  ]);

  return (
    <main className="page-shell">
      <section className="mock-home-hero">
        <div className="mock-home-copy">
          <h1>
            Aprende medicina
            <span> facil y feliz</span>
          </h1>
          <p className="lead">
            Metodo simple, organizado y efectivo para que estudiar sea mas facil
            y disfrutable.
          </p>
          <div className="hero-actions">
            <AppButton href="/auth/register">Comienza ahora</AppButton>
          </div>
        </div>
        <div className="mock-home-visual">
          <MascotIllustration />
        </div>
      </section>

      <section className="mock-feature-strip">
        <div className="mock-feature-card">
          <div className="mock-feature-icon">□</div>
          <h3>Metodo comprobado</h3>
          <p>Contenido claro y estructurado para entender mejor.</p>
        </div>
        <div className="mock-feature-card">
          <div className="mock-feature-icon">◔</div>
          <h3>Estudia a tu ritmo</h3>
          <p>Organiza tu tiempo y avanza segun tu plan.</p>
        </div>
        <div className="mock-feature-card">
          <div className="mock-feature-icon">⌂</div>
          <h3>Acompanamiento</h3>
          <p>No estas solo, estamos contigo en cada paso.</p>
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
          <span>Plataforma</span>
          <h2>Una base lista para cursos, repaso, progreso y acceso por estudiante</h2>
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
