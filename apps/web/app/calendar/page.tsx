import { CalendarPlanner } from "../../components/calendar/calendar-planner";
import { getCurrentStudentSession } from "../../lib/server/session";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const student = await getCurrentStudentSession();

  return (
    <main className="public-shell-eapa">
      <section className="soft-card calendar-shell-eapa">
        <div className="calendar-hero-eapa">
          <div>
            <span className="courses-eyebrow-eapa">Plan de estudio</span>
            <h1>Calendario</h1>
            <p>
              Organiza tus actividades, repasos, lecciones y simulacros para no
              perder ninguna oportunidad de avanzar.
            </p>
          </div>
          <div className="calendar-hero-art-eapa" aria-hidden="true">
            <div className="calendar-mascot-eapa">
              <span />
              <strong />
            </div>
          </div>
        </div>

        <CalendarPlanner isLoggedIn={Boolean(student)} />
      </section>
    </main>
  );
}
