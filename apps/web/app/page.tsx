import Link from "next/link";
import { BrainBookIcon } from "../components/ui/logo";

export const dynamic = "force-dynamic";

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="soft-card feature-card-eapa">
      <div className="feature-icon-eapa">{icon}</div>
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
          <div>
            <div className="pill-badge-eapa">✦ Plataforma medica para estudiantes</div>
            <h1>
              Aprende medicina
              <br />
              <span>facil y feliz</span>
            </h1>
            <p>
              Cursos claros, practicos y actualizados que te acompanan paso a
              paso para comprender mejor, estudiar con calma y avanzar con
              confianza.
            </p>
            <div className="hero-actions-eapa">
              <Link href="/auth/register" className="primary-btn">
                Inscribirme ahora
              </Link>
              <Link href="/metodologia" className="secondary-btn">
                Conoce mas
              </Link>
            </div>
          </div>
          <div className="hero-art-eapa">
            <div className="hero-art-glow" />
            <div className="hero-art-card">
              <BrainBookIcon className="hero-brain-icon" />
            </div>
          </div>
        </div>
        <div className="feature-grid-eapa">
          <FeatureCard
            icon="📘"
            title="Contenido claro y actualizado"
            text="Lecciones disenadas con un enfoque practico y efectivo."
          />
          <FeatureCard
            icon="⏰"
            title="Aprende a tu ritmo"
            text="Estudia cuando y donde quieras con total flexibilidad."
          />
          <FeatureCard
            icon="📈"
            title="Resultados que te impulsan"
            text="Seguimiento de tu progreso y herramientas que te acercan a tu meta."
          />
        </div>
      </section>
    </main>
  );
}
