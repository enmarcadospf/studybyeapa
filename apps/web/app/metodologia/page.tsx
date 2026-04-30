import { LEARNING_LOOP, features } from "@academia/shared";
import { MascotIllustration } from "../../components/ui/mascot-illustration";
import { PageHeader } from "../../components/ui/page-header";

export default function MetodologiaPage() {
  return (
    <main className="page-shell">
      <section className="mock-method-grid">
        <div>
          <PageHeader
            description="Un metodo simple y efectivo para que aprender medicina sea mas facil y feliz."
            eyebrow="Metodologia"
            title="Nuestra Metodologia"
          />
        </div>
        <div className="mock-method-visual">
          <MascotIllustration compact />
        </div>
      </section>

      <section className="mock-method-cards">
          {LEARNING_LOOP.map((item, index) => (
            <article className="mock-step-card" key={item.title}>
              <div className="mock-step-badge">{index + 1}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
      </section>

      <section className="mock-quote-banner">
        <strong>No se trata de estudiar mas, se trata de estudiar mejor.</strong>
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
    </main>
  );
}
