import { StudentSidebar } from "../../components/student/student-sidebar";

const mockExams = [
  ["Simulacro EAP 2026 - 1", "200 preguntas", "3 horas"],
  ["Simulacro EAP 2026 - 2", "180 preguntas", "2.5 horas"],
  ["Simulacro EAP 2026 - 3", "150 preguntas", "2 horas"],
];

export default function SimulacrosPage() {
  return (
    <main className="student-shell">
      <section className="workspace-layout">
        <StudentSidebar activeHref="/simulacros" />
        <div className="workspace-main">
          <section className="mock-simple-header">
            <div>
              <h1>Simulacros</h1>
              <p>Pon a prueba tus conocimientos con examenes tipo EAP.</p>
            </div>
            <div className="mock-dashboard-mascot">☑</div>
          </section>

          <section className="mock-tabs">
            <span className="is-active">Disponibles</span>
            <span>Realizados</span>
            <span>Resultados</span>
          </section>

          <section className="sim-grid">
            <section className="student-panel">
              <div className="management-list">
                {mockExams.map(([title, questions, duration]) => (
                  <article className="management-list-item" key={title}>
                    <div>
                      <h3>{title}</h3>
                      <p>{questions} | {duration}</p>
                    </div>
                    <button className="eapa-button eapa-button-small" type="button">
                      Comenzar
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <aside className="student-panel">
              <div className="section-heading">
                <span>Tu progreso</span>
                <h2>Resumen actual</h2>
              </div>
              <div className="progress-ring-card">
                <div className="progress-ring">
                  <strong>68%</strong>
                </div>
                <p>Fortalezas</p>
                <div className="mock-subject-list">
                  <div><span>Anatomia</span><strong>85%</strong></div>
                  <div><span>Fisiologia</span><strong>70%</strong></div>
                  <div><span>A mejorar</span><strong>Farmacologia</strong></div>
                  <div><span>Patologia</span><strong>50%</strong></div>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
