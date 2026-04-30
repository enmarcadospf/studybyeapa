import { StudentSidebar } from "../../components/student/student-sidebar";
import { PageHeader } from "../../components/ui/page-header";

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
          <section className="dashboard-hero dashboard-hero-soft">
            <PageHeader
              description="Practica con examenes tipo EAP y mide tus fortalezas tema por tema."
              eyebrow="Simulacros"
              title="Tu espacio de practica"
            />
          </section>

          <section className="sim-grid">
            <section className="student-panel">
              <div className="section-heading">
                <span>Disponibles</span>
                <h2>Examenes listos para comenzar</h2>
              </div>
              <div className="management-list">
                {mockExams.map(([title, questions, duration]) => (
                  <article className="management-list-item" key={title}>
                    <div>
                      <h3>{title}</h3>
                      <p>{questions} · {duration}</p>
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
                <span>Progreso</span>
                <h2>Resumen actual</h2>
              </div>
              <div className="progress-ring-card">
                <div className="progress-ring">
                  <strong>68%</strong>
                </div>
                <p>Promedio general</p>
              </div>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
