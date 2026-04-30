import { BrainBookIcon } from "../../components/ui/logo";

function MethodCard({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="soft-card method-card-eapa">
      <div className="method-card-head-eapa">
        <div className="method-step-eapa">{number}</div>
        <div className="method-icon-eapa">{icon}</div>
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
          <div>
            <h1>Nuestra metodologia</h1>
            <p>
              Un camino simple y efectivo para que aprendas medicina facil,
              organizada y con felicidad.
            </p>
            <div className="method-cards-eapa">
              <MethodCard
                number="1"
                icon="📘"
                title="Aprende"
                text="Lecciones claras, visuales y organizadas para entender desde la base."
              />
              <MethodCard
                number="2"
                icon="📝"
                title="Practica"
                text="Ejercicios, casos clinicos y preguntas que refuerzan tu aprendizaje."
              />
              <MethodCard
                number="3"
                icon="🏆"
                title="Evalua y mejora"
                text="Simulacros y evaluaciones para medir tu progreso y corregir debilidades."
              />
            </div>
            <div className="method-quote-eapa">
              <div className="method-heart-eapa">♥</div>
              <p>
                Aprendemos mejor cuando disfrutamos el proceso. Estudiar medicina puede ser facil y feliz.
              </p>
            </div>
          </div>
          <div className="method-visual-eapa">
            <div className="hero-art-card">
              <BrainBookIcon className="hero-brain-icon" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
