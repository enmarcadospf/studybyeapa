const events = [
  {
    hour: "09:00 - 10:30",
    title: "Estudio: Fisiologia Humana",
    color: "medium",
  },
  {
    hour: "11:00 - 12:00",
    title: "Leccion: Bioquimica - Enzimas",
    color: "light",
  },
  {
    hour: "15:00 - 16:30",
    title: "Simulacro 3: Patologia General",
    color: "orange",
  },
  {
    hour: "18:00 - 19:00",
    title: "Repaso: Anatomia - Torax y costillas",
    color: "navy",
  },
];

export default function CalendarPage() {
  return (
    <main className="public-shell-eapa">
      <section className="soft-card calendar-shell-eapa">
        <h1>Calendario</h1>
        <p>Organiza tus actividades y mantente al dia.</p>

        <div className="calendar-grid-eapa">
          <div className="soft-card calendar-box-eapa">
            <div className="calendar-box-head-eapa">
              <button className="secondary-btn small-btn-eapa">‹</button>
              <h2>Mayo 2025</h2>
              <button className="secondary-btn small-btn-eapa">›</button>
            </div>
            <div className="calendar-full-grid-eapa">
              {["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"].map((day) => (
                <div key={day} className="calendar-mini-label-eapa">{day}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => (
                <div
                  key={i}
                  className={i + 1 === 15 ? "calendar-mini-day-eapa is-active" : "calendar-mini-day-eapa"}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <button className="secondary-btn secondary-btn-full">Hoy</button>
          </div>

          <div className="soft-card agenda-box-eapa">
            <div className="agenda-head-eapa">
              <h2>Agenda del dia - Jueves, 15 de mayo</h2>
              <div className="agenda-tabs-eapa">
                <button className="primary-btn small-pill-eapa">Dia</button>
                <button className="secondary-btn small-pill-eapa">Semana</button>
                <button className="secondary-btn small-pill-eapa">Mes</button>
              </div>
            </div>
            <div className="sim-list-eapa">
              {events.map((event) => (
                <div key={event.title} className="event-item-eapa">
                  <span className={`event-dot-eapa is-${event.color}`} />
                  <div>
                    <p>{event.hour}</p>
                    <h3>{event.title}</h3>
                  </div>
                </div>
              ))}
            </div>
            <button className="secondary-btn secondary-btn-center">+ Agregar actividad</button>
          </div>
        </div>
      </section>
    </main>
  );
}
