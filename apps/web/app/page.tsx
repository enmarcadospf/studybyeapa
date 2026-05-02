import Link from "next/link";
import { BrainBookIcon } from "../components/ui/logo";

export const dynamic = "force-dynamic";

type FeatureIcon = "book" | "clock" | "chart";

function HomeFeatureIcon({ type }: { type: FeatureIcon }) {
  if (type === "book") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 5.5c2.8-.9 5.2-.4 7.5 1.5v12c-2.3-1.9-4.7-2.4-7.5-1.5v-12Z" />
        <path d="M12 7c2.3-1.9 4.7-2.4 7.5-1.5v12c-2.8-.9-5.2-.4-7.5 1.5V7Z" />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7.5" />
        <path d="M12 7.8v4.7l3.2 2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 17.5h15" />
      <path d="M6.5 15.5l4.1-4.4 3.2 2.8 4-5.4" />
      <path d="M16.2 8.5h1.6v1.6" />
    </svg>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: FeatureIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="soft-card feature-card-eapa">
      <div className="feature-icon-eapa">
        <HomeFeatureIcon type={icon} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="public-shell-eapa">
      <section className="soft-card home-hero-eapa">
        <div className="home-hero-grid-eapa">
          <div className="home-copy-eapa">
            <h1>
              Aprende medicina
              <br />
              <span>fácil y feliz</span>
            </h1>
            <p>
              Cursos claros, prácticos y actualizados que te acompañan en cada paso de tu camino como futuro profesional de la salud.
            </p>
            <div className="hero-actions-eapa">
              <Link href="/auth/register" className="primary-btn">
                Inscribirme ahora
              </Link>
              <Link href="/metodologia" className="secondary-btn">
                Conoce mas →
              </Link>
            </div>
          </div>
          <div className="hero-art-eapa home-mascot-stage-eapa" aria-hidden="true">
            <div className="home-blob-eapa" />
            <span className="home-plus-eapa home-plus-one">+</span>
            <span className="home-plus-eapa home-plus-two">+</span>
            <span className="home-plus-eapa home-plus-three">+</span>
            <span className="home-soft-icon home-soft-heart">♡</span>
            <span className="home-soft-icon home-soft-check">✓</span>
            <div className="home-mascot-card-eapa">
              <BrainBookIcon className="hero-brain-icon" />
            </div>
          </div>
        </div>
        <div className="feature-grid-eapa">
          <FeatureCard
            icon="book"
            title="Contenido claro y actualizado"
            text="Lecciones diseñadas con un enfoque práctico, visual y fácil de seguir."
          />
          <FeatureCard
            icon="clock"
            title="Aprende a tu ritmo"
            text="Estudia cuando y desde donde quieras con total flexibilidad."
          />
          <FeatureCard
            icon="chart"
            title="Resultados que te impulsan"
            text="Progreso, simulacros y repasos con IA para identificar tus áreas de mejora."
          />
        </div>
      </section>
    </main>
  );
}
