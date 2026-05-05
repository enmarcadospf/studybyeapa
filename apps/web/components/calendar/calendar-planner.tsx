"use client";

import { useMemo, useState } from "react";

type CalendarView = "day" | "week" | "month";
type EventTone = "medium" | "light" | "orange" | "navy";

type StudyEvent = {
  id: string;
  day: number;
  hour: string;
  title: string;
  subtitle: string;
  tone: EventTone;
};

type CalendarPlannerProps = {
  isLoggedIn: boolean;
};

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const studyEvents: StudyEvent[] = [
  {
    id: "event-fisiologia",
    day: 15,
    hour: "09:00 - 10:30",
    title: "Estudio: Fisiología Humana",
    subtitle: "Sistema cardiovascular",
    tone: "medium",
  },
  {
    id: "event-bioquimica",
    day: 15,
    hour: "11:00 - 12:00",
    title: "Lección: Bioquímica - Enzimas",
    subtitle: "Lectura guiada y notas",
    tone: "light",
  },
  {
    id: "event-simulacro",
    day: 15,
    hour: "15:00 - 16:30",
    title: "Simulacro 3: Patología General",
    subtitle: "80 preguntas · modo examen",
    tone: "orange",
  },
  {
    id: "event-anatomia",
    day: 15,
    hour: "18:00 - 19:00",
    title: "Repaso: Anatomía - Tórax y costillas",
    subtitle: "Flashcards y quiz",
    tone: "navy",
  },
  {
    id: "event-infectologia",
    day: 18,
    hour: "10:00 - 11:00",
    title: "Repaso: Infectología",
    subtitle: "Antibióticos y síndrome febril",
    tone: "medium",
  },
  {
    id: "event-semiologia",
    day: 22,
    hour: "20:00 - 21:00",
    title: "Semiología clínica",
    subtitle: "Interrogatorio dirigido",
    tone: "light",
  },
];

function monthDays() {
  return Array.from({ length: 31 }, (_, index) => index + 1);
}

export function CalendarPlanner({ isLoggedIn }: CalendarPlannerProps) {
  const [selectedDay, setSelectedDay] = useState(15);
  const [view, setView] = useState<CalendarView>("day");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const eventsForSelectedDay = useMemo(
    () => studyEvents.filter((event) => event.day === selectedDay),
    [selectedDay],
  );
  const weekEvents = useMemo(
    () => studyEvents.filter((event) => event.day >= selectedDay && event.day <= selectedDay + 6),
    [selectedDay],
  );
  const visibleEvents =
    view === "month" ? studyEvents : view === "week" ? weekEvents : eventsForSelectedDay;

  return (
    <div className="calendar-grid-eapa">
      <section className="soft-card calendar-box-eapa calendar-month-card-eapa">
        <div className="calendar-box-head-eapa">
          <button
            className="secondary-btn small-btn-eapa"
            onClick={() => setSelectedDay((day) => Math.max(1, day - 1))}
            type="button"
          >
            ‹
          </button>
          <h2>Mayo 2026</h2>
          <button
            className="secondary-btn small-btn-eapa"
            onClick={() => setSelectedDay((day) => Math.min(31, day + 1))}
            type="button"
          >
            ›
          </button>
        </div>
        <div className="calendar-full-grid-eapa">
          {weekDays.map((day) => (
            <div key={day} className="calendar-mini-label-eapa">{day}</div>
          ))}
          {monthDays().map((day) => {
            const hasEvents = studyEvents.some((event) => event.day === day);
            const className = [
              "calendar-mini-day-eapa",
              day === selectedDay ? "is-active" : "",
              hasEvents ? "has-events" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                className={className}
                key={day}
                onClick={() => setSelectedDay(day)}
                type="button"
              >
                {day}
              </button>
            );
          })}
        </div>
        <button
          className="secondary-btn secondary-btn-full"
          onClick={() => setSelectedDay(15)}
          type="button"
        >
          Hoy
        </button>
      </section>

      <section className="soft-card agenda-box-eapa calendar-agenda-card-eapa">
        <div className="agenda-head-eapa">
          <div>
            <h2>
              Agenda del día · {selectedDay} de mayo
            </h2>
            <p>
              {visibleEvents.length
                ? `${visibleEvents.length} actividades planificadas`
                : "Sin actividades para este día"}
            </p>
          </div>
          <div className="agenda-tabs-eapa">
            <button
              className={view === "day" ? "primary-btn small-pill-eapa" : "secondary-btn small-pill-eapa"}
              onClick={() => setView("day")}
              type="button"
            >
              Día
            </button>
            <button
              className={view === "week" ? "primary-btn small-pill-eapa" : "secondary-btn small-pill-eapa"}
              onClick={() => setView("week")}
              type="button"
            >
              Semana
            </button>
            <button
              className={view === "month" ? "primary-btn small-pill-eapa" : "secondary-btn small-pill-eapa"}
              onClick={() => setView("month")}
              type="button"
            >
              Mes
            </button>
          </div>
        </div>

        <div className="sim-list-eapa">
          {visibleEvents.map((event) => (
            <article key={event.id} className="event-item-eapa">
              <span className={`event-dot-eapa is-${event.tone}`} />
              <div>
                <p>{event.hour}</p>
                <h3>{event.title}</h3>
                <small>{event.subtitle}</small>
              </div>
            </article>
          ))}

          {!visibleEvents.length ? (
            <div className="calendar-empty-eapa">
              <strong>Día libre para organizarte.</strong>
              <p>Agrega una actividad de estudio o mueve un repaso pendiente.</p>
            </div>
          ) : null}
        </div>

        {showAddPanel ? (
          <div className="calendar-add-panel-eapa">
            <strong>Agregar actividad</strong>
            <p>
              Próximo paso: guardar actividades reales en la base de datos. Por
              ahora esta acción te muestra el flujo previsto.
            </p>
            {!isLoggedIn ? <span>Inicia sesión para guardar eventos.</span> : null}
          </div>
        ) : null}

        <button
          className="secondary-btn secondary-btn-center"
          onClick={() => setShowAddPanel((current) => !current)}
          type="button"
        >
          + Agregar actividad
        </button>
      </section>
    </div>
  );
}
