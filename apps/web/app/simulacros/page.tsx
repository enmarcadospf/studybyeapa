import { SimulacrosPanel } from "../../components/simulacros/simulacros-panel";
import { getCurrentStudentSession } from "../../lib/server/session";

export const dynamic = "force-dynamic";

export default async function SimulacrosPage() {
  const student = await getCurrentStudentSession();

  return (
    <main className="public-shell-eapa">
      <section className="soft-card simulacros-shell-eapa">
        <div className="simulacros-hero-eapa">
          <div>
            <span className="courses-eyebrow-eapa">Modo examen</span>
            <h1>Simulacros</h1>
            <p>
              Pon a prueba tus conocimientos con exámenes tipo EAPA, revisa
              resultados y enfoca mejor tus repasos.
            </p>
          </div>
          <div className="simulacros-hero-art-eapa" aria-hidden="true">
            <div className="sim-clipboard-eapa">
              <span />
              <strong />
              <strong />
              <strong />
            </div>
          </div>
        </div>

        <SimulacrosPanel
          enrolledCourseSlugs={student?.enrolledCourseSlugs ?? []}
          isLoggedIn={Boolean(student)}
        />
      </section>
    </main>
  );
}
