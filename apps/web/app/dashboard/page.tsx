import { dashboardSections } from "@academia/shared";
import { DashboardCard } from "../../components/dashboard-card";

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-hero">
        <p className="eyebrow">Paneles base</p>
        <h1>Estructura inicial para cada tipo de usuario</h1>
        <p className="auth-copy">
          Esta vista te permite visualizar como se separaran las experiencias
          principales dentro de la app.
        </p>
      </section>

      <section className="dashboard-stack">
        {dashboardSections.map((section) => (
          <article className="dashboard-panel" key={section.role}>
            <div className="section-heading">
              <span>{section.role}</span>
              <h2>{section.heading}</h2>
            </div>
            <p className="dashboard-copy">{section.description}</p>
            <div className="dashboard-grid">
              {section.summaries.map((item) => (
                <DashboardCard item={item} key={item.title} />
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
