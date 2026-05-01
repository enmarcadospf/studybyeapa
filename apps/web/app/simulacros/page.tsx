const simulacros = [
  {
    name: "Simulacro 1: Anatomía y Fisiología",
    preguntas: "60 preguntas",
    estado: "Completado",
    score: "84%",
  },
  {
    name: "Simulacro 2: Bioquímica y Farmacología",
    preguntas: "60 preguntas",
    estado: "Completado",
    score: "68%",
  },
  {
    name: "Simulacro 3: Patología General",
    preguntas: "60 preguntas",
    estado: "Realizar",
    score: "-",
  },
  {
    name: "Simulacro 4: Microbiología",
    preguntas: "60 preguntas",
    estado: "Realizar",
    score: "-",
  },
];

export default function SimulacrosPage() {
  return (
    <main className="public-shell-eapa">
      <section className="soft-card simulacros-shell-eapa">
        <span className="pill-badge-eapa">Modo examen</span>
        <h1>Simulacros</h1>
        <p>Evalúa tus conocimientos y mide tu progreso con preguntas estilo examen.</p>

        <div className="simulacros-grid-eapa">
          <div className="soft-card side-card-eapa">
            <h2>Tu rendimiento general</h2>
            <div className="score-ring-eapa">
              <div>
                <p>72%</p>
                <span>Promedio general</span>
              </div>
            </div>
            <div className="side-stats-eapa">
              <div><span>Simulacros realizados</span><b>7</b></div>
              <div><span>Promedio de aciertos</span><b>72%</b></div>
              <div><span>Mejor puntaje</span><b>84%</b></div>
            </div>
            <div className="strength-tags-eapa">
              <span>Anatomía 80%</span>
              <span>Fisiología 76%</span>
              <span>Farmacología 30%</span>
            </div>
          </div>

          <div className="soft-card content-card-eapa">
            <h2>Simulacros disponibles</h2>
            <div className="sim-list-eapa">
              {simulacros.map((item) => (
                <div key={item.name} className="sim-item-eapa">
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.preguntas}</p>
                  </div>
                  <div className="sim-item-meta-eapa">
                    <span className={item.estado === "Completado" ? "status-ok-eapa" : "status-pending-eapa"}>
                      {item.estado}
                    </span>
                    <strong>{item.score}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
