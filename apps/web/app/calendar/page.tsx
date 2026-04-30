import { StudentSidebar } from "../../components/student/student-sidebar";

const agenda = [
  ["Repaso Anatomia", "07:00 - 08:00"],
  ["Clase en vivo: Fisiologia", "11:00 - 12:00"],
  ["Simulacro EAP 2026 - 1", "15:00 - 17:00"],
  ["Repaso Farmacologia", "20:30 - 21:30"],
];

export default function CalendarPage() {
  return (
    <main className="student-shell">
      <section className="workspace-layout">
        <StudentSidebar activeHref="/calendar" />
        <div className="workspace-main">
          <section className="mock-simple-header">
            <div>
              <h1>Calendario</h1>
              <p>Organiza tu tiempo y no te pierdas ninguna actividad.</p>
            </div>
            <div className="mock-dashboard-mascot">🗓</div>
          </section>

          <section className="sim-grid">
            <section className="student-panel">
              <div className="calendar-board">
                <strong>Mayo 2026</strong>
                <div className="calendar-preview-grid">
                  {["L", "M", "M", "J", "V", "S", "D"].map((day) => (
                    <span className="calendar-day-label" key={day}>
                      {day}
                    </span>
                  ))}
                  {Array.from({ length: 35 }).map((_, index) => (
                    <span
                      className={index === 16 ? "calendar-day is-active" : "calendar-day"}
                      key={index}
                    >
                      {index + 1}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <aside className="student-panel">
              <div className="section-heading">
                <span>Eventos del dia</span>
                <h2>Agenda</h2>
              </div>
              <div className="management-list">
                {agenda.map(([title, time]) => (
                  <article className="management-list-item" key={title}>
                    <div>
                      <h3>{title}</h3>
                      <p>{time}</p>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
