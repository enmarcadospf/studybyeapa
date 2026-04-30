import { getAdminAlerts } from "../../lib/api";

export default async function AdminPage() {
  const alerts = await getAdminAlerts();

  return (
    <main className="management-shell">
      <section className="dashboard-hero">
        <p className="eyebrow">Area administrativa</p>
        <h1>Supervisa pagos, soporte y contenido</h1>
        <p className="auth-copy">
          Aqui se concentrara la operacion diaria del negocio educativo.
        </p>
      </section>

      <section className="management-grid">
        {alerts.map((alert) => (
          <article className="detail-card" key={alert.id}>
            <p className="course-category">{alert.area}</p>
            <h3>{alert.title}</h3>
            <p>Estado: {alert.status}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
