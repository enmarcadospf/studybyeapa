"use client";

import { type FormEvent, useMemo, useState } from "react";

type CalendarView = "day" | "week" | "month";
type EventTone = "medium" | "light" | "orange" | "navy";

type StudyEvent = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  subtitle: string;
  tone: EventTone;
};

type CalendarPlannerProps = {
  isLoggedIn: boolean;
};

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const monthFormatter = new Intl.DateTimeFormat("es-DO", {
  month: "long",
  year: "numeric",
});
const dayFormatter = new Intl.DateTimeFormat("es-DO", {
  day: "numeric",
  month: "long",
});

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function addMonths(date: Date, months: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months, 1);
  return nextDate;
}

function getMonthDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1;

  return {
    blanks: Array.from({ length: mondayOffset }, (_, index) => `blank-${index}`),
    days: Array.from({ length: totalDays }, (_, index) => new Date(year, month, index + 1)),
  };
}

function getWeekRange(selectedDate: Date) {
  const day = selectedDate.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = addDays(selectedDate, mondayOffset);

  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

function getInitialEvents(today: Date): StudyEvent[] {
  const month = new Date(today.getFullYear(), today.getMonth(), 1);
  const eventDate = (day: number) => {
    const date = new Date(month);
    date.setDate(day);
    return toDateKey(date);
  };

  return [
    {
      id: "event-fisiologia",
      date: eventDate(Math.min(15, new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate())),
      startTime: "09:00",
      endTime: "10:30",
      title: "Estudio: Fisiología Humana",
      subtitle: "Sistema cardiovascular",
      tone: "medium",
    },
    {
      id: "event-bioquimica",
      date: eventDate(Math.min(15, new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate())),
      startTime: "11:00",
      endTime: "12:00",
      title: "Lección: Bioquímica - Enzimas",
      subtitle: "Lectura guiada y notas",
      tone: "light",
    },
    {
      id: "event-simulacro",
      date: eventDate(Math.min(18, new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate())),
      startTime: "15:00",
      endTime: "16:30",
      title: "Simulacro: Patología General",
      subtitle: "80 preguntas · modo examen",
      tone: "orange",
    },
    {
      id: "event-anatomia",
      date: eventDate(Math.min(22, new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate())),
      startTime: "18:00",
      endTime: "19:00",
      title: "Repaso: Anatomía - Tórax y costillas",
      subtitle: "Flashcards y quiz",
      tone: "navy",
    },
  ];
}

function formatGoogleDate(dateKey: string, time: string) {
  return `${dateKey.replaceAll("-", "")}T${time.replace(":", "")}00`;
}

function getGoogleCalendarUrl(event: StudyEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatGoogleDate(event.date, event.startTime)}/${formatGoogleDate(event.date, event.endTime)}`,
    details: `${event.subtitle}\n\nEvento creado desde Study by EAPA. Puedes activar notificaciones dentro de Google Calendar.`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function CalendarPlanner({ isLoggedIn }: CalendarPlannerProps) {
  const today = useMemo(() => new Date(), []);
  const [monthDate, setMonthDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => today);
  const [view, setView] = useState<CalendarView>("day");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [googleReminders, setGoogleReminders] = useState(false);
  const [events, setEvents] = useState<StudyEvent[]>(() => getInitialEvents(today));

  const selectedDateKey = toDateKey(selectedDate);
  const currentMonthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;
  const { blanks, days } = useMemo(() => getMonthDays(monthDate), [monthDate]);
  const selectedWeekKeys = useMemo(
    () => new Set(getWeekRange(selectedDate).map(toDateKey)),
    [selectedDate],
  );
  const monthEvents = useMemo(
    () => events.filter((event) => event.date.startsWith(currentMonthKey)),
    [currentMonthKey, events],
  );
  const eventsForSelectedDay = useMemo(
    () => events.filter((event) => event.date === selectedDateKey),
    [events, selectedDateKey],
  );
  const weekEvents = useMemo(
    () => events.filter((event) => selectedWeekKeys.has(event.date)),
    [events, selectedWeekKeys],
  );
  const visibleEvents =
    view === "month" ? monthEvents : view === "week" ? weekEvents : eventsForSelectedDay;

  function goToMonth(offset: number) {
    const nextMonth = addMonths(monthDate, offset);
    setMonthDate(nextMonth);
    setSelectedDate(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1));
  }

  function goToToday() {
    setMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
    setView("day");
  }

  function handleAddActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const startTime = String(formData.get("startTime") ?? "08:00");
    const endTime = String(formData.get("endTime") ?? "09:00");
    const subtitle = String(formData.get("subtitle") ?? "").trim();

    if (!title) {
      return;
    }

    setEvents((current) => [
      ...current,
      {
        id: `custom-${Date.now()}`,
        date: selectedDateKey,
        startTime,
        endTime,
        title,
        subtitle: subtitle || "Actividad personalizada",
        tone: "medium",
      },
    ]);
    event.currentTarget.reset();
    setShowAddPanel(false);
  }

  return (
    <div className="calendar-grid-eapa">
      <section className="soft-card calendar-box-eapa calendar-month-card-eapa">
        <div className="calendar-box-head-eapa">
          <button
            className="secondary-btn small-btn-eapa"
            onClick={() => goToMonth(-1)}
            type="button"
          >
            ‹
          </button>
          <h2>{monthFormatter.format(monthDate)}</h2>
          <button
            className="secondary-btn small-btn-eapa"
            onClick={() => goToMonth(1)}
            type="button"
          >
            ›
          </button>
        </div>

        <div className="calendar-full-grid-eapa">
          {weekDays.map((day) => (
            <div key={day} className="calendar-mini-label-eapa">{day}</div>
          ))}
          {blanks.map((blank) => (
            <span key={blank} className="calendar-mini-day-eapa is-empty" />
          ))}
          {days.map((day) => {
            const dateKey = toDateKey(day);
            const hasEvents = events.some((event) => event.date === dateKey);
            const isToday = dateKey === toDateKey(today);
            const className = [
              "calendar-mini-day-eapa",
              dateKey === selectedDateKey ? "is-active" : "",
              hasEvents ? "has-events" : "",
              isToday ? "is-today" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                className={className}
                key={dateKey}
                onClick={() => setSelectedDate(day)}
                type="button"
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>

        <button
          className="secondary-btn secondary-btn-full"
          onClick={goToToday}
          type="button"
        >
          Hoy
        </button>

        <div className="google-calendar-card-eapa">
          <div>
            <strong>Google Calendar</strong>
            <p>Agrega eventos a tu calendario y activa notificaciones desde Google.</p>
          </div>
          <label>
            <input
              checked={googleReminders}
              onChange={(event) => setGoogleReminders(event.target.checked)}
              type="checkbox"
            />
            Quiero recordatorios
          </label>
        </div>
      </section>

      <section className="soft-card agenda-box-eapa calendar-agenda-card-eapa">
        <div className="agenda-head-eapa">
          <div>
            <h2>
              Agenda · {dayFormatter.format(selectedDate)}
            </h2>
            <p>
              {visibleEvents.length
                ? `${visibleEvents.length} actividades planificadas`
                : "Sin actividades para este período"}
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
                <p>{event.startTime} - {event.endTime}</p>
                <h3>{event.title}</h3>
                <small>{event.subtitle}</small>
                {googleReminders ? (
                  <a
                    className="google-event-link-eapa"
                    href={getGoogleCalendarUrl(event)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Agregar a Google Calendar
                  </a>
                ) : null}
              </div>
            </article>
          ))}

          {!visibleEvents.length ? (
            <div className="calendar-empty-eapa">
              <strong>Espacio libre para organizarte.</strong>
              <p>Agrega una actividad de estudio o mueve un repaso pendiente.</p>
            </div>
          ) : null}
        </div>

        {showAddPanel ? (
          <form className="calendar-add-panel-eapa" onSubmit={handleAddActivity}>
            <strong>Agregar actividad</strong>
            <label>
              Título
              <input name="title" placeholder="Ej. Repaso de anatomía" />
            </label>
            <label>
              Detalle
              <input name="subtitle" placeholder="Tema, curso o recordatorio" />
            </label>
            <div className="calendar-time-grid-eapa">
              <label>
                Inicio
                <input defaultValue="08:00" name="startTime" type="time" />
              </label>
              <label>
                Fin
                <input defaultValue="09:00" name="endTime" type="time" />
              </label>
            </div>
            {!isLoggedIn ? <span>Inicia sesión para guardar eventos permanentes.</span> : null}
            <button className="primary-btn small-pill-eapa" type="submit">
              Guardar actividad
            </button>
          </form>
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
