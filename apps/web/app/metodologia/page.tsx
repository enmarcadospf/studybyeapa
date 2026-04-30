import { LEARNING_LOOP, features } from "@academia/shared";
import { MascotIllustration } from "../../components/ui/mascot-illustration";
import { PageHeader } from "../../components/ui/page-header";

export default function MetodologiaPage() {
  return (
    <main className="page-shell">
      <section className="catalog-hero catalog-hero-grid">
        <div>
          <PageHeader
            description="Una ruta clara para estudiar por lecciones, repasar con apoyo visual y terminar cada modulo con seguridad."
            eyebrow="Metodologia"
            title="Aprender medicina puede sentirse mas claro"
          />
        </div>
        <div className="catalog-side-card">
          <MascotIllustration compact />
        </div>
      </section>

      <section className="content-section">
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
          <span>Ruta</span>
          <h2>Entiende, practica y retiene sin perderte</h2>
        </div>
        <div className="feature-grid">
          {LEARNING_LOOP.map((item, index) => (
            <article className="feature-card feature-card-numbered" key={item.title}>
              <div className="feature-step-badge">{index + 1}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
