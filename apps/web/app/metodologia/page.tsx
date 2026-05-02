import { BrainBookIcon } from "../../components/ui/logo";

type MethodIconName = "book" | "practice" | "trophy";

function MethodIcon({ name }: { name: MethodIconName }) {
  if (name === "book") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M9 12.5c5.8-2.1 10.8-1.2 15 3v24c-4.2-4.2-9.2-5.1-15-3v-24Z" />
        <path d="M24 15.5c4.2-4.2 9.2-5.1 15-3v24c-5.8-2.1-10.8-1.2-15 3v-24Z" />
        <path d="M14 18.5c2.5-.4 4.6 0 6.4 1.2" />
        <path d="M28 19.7c1.8-1.2 3.9-1.6 6.4-1.2" />
      </svg>
    );
  }

  if (name === "practice") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M16 10.5h16" />
        <path d="M18.5 8h11l1.5 5h-14l1.5-5Z" />
        <rect x="11" y="12.5" width="26" height="28" rx="5" />
        <path d="m17 23 3 3 6-7" />
        <path d="M29 24h4" />
        <path d="m17 33 3 3 6-7" />
        <path d="M29 34h4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M16 10h16v8c0 6-3.3 10-8 10s-8-4-8-10v-8Z" />
      <path d="M16 14h-6v3c0 5 3.1 8 8 8" />
      <path d="M32 14h6v3c0 5-3.1 8-8 8" />
      <path d="M24 28v6" />
      <path d="M18 40h12" />
      <path d="M20 34h8l2 6H18l2-6Z" />
    </svg>
  );
}

function MethodCard({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: MethodIconName;
  title: string;
  text: string;
}) {
  return (
    <div className="soft-card method-card-eapa">
      <div className="method-step-eapa">{number}</div>
      <div className="method-icon-eapa">
        <MethodIcon name={icon} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default function MetodologiaPage() {
  return (
    <main className="public-shell-eapa">
      <section className="soft-card method-shell-eapa">
        <div className="method-grid-eapa">
          <div className="method-copy-eapa">
            <span className="method-eyebrow-eapa">Método Study by EAPA</span>
            <h1>Nuestra metodología</h1>
            <p>
              Un camino simple y efectivo para que aprendas medicina fácil y feliz.
            </p>
            <div className="method-cards-eapa">
              <MethodCard
                number="1"
                icon="book"
                title="Aprende"
                text="Lecciones claras, videos y recursos diseñados para que entiendas cada tema a profundidad."
              />
              <MethodCard
                number="2"
                icon="practice"
                title="Practica"
                text="Ejercicios, casos clínicos y preguntas para aplicar lo aprendido y reforzar tu conocimiento."
              />
              <MethodCard
                number="3"
                icon="trophy"
                title="Evalúa y mejora"
                text="Simulacros y evaluaciones que miden tu progreso y te guían hacia tus objetivos."
              />
            </div>
            <div className="method-quote-eapa">
              <div className="method-heart-eapa" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 20s-7-4.4-9-9.1C1.6 7.6 3.5 5 6.5 5c1.8 0 3.2.9 4.1 2.2C11.5 5.9 12.9 5 14.7 5c3 0 4.9 2.6 3.5 5.9C16.1 15.6 12 20 12 20Z" />
                </svg>
              </div>
              <p>
                Aprendemos mejor cuando disfrutamos el proceso. Estudiar medicina puede ser fácil y feliz.
              </p>
            </div>
          </div>
          <div className="method-visual-eapa">
            <div className="method-visual-panel-eapa" aria-hidden="true">
              <span className="method-plus-eapa method-plus-one">+</span>
              <span className="method-plus-eapa method-plus-two">+</span>
              <span className="method-bubble-eapa method-bubble-check">✓</span>
              <span className="method-bubble-eapa method-bubble-heart">♡</span>
              <div className="method-mascot-glow-eapa" />
              <BrainBookIcon className="method-brain-icon" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
