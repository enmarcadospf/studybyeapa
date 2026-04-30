import { getAdminAlerts } from "../../lib/api";
import { listStudents } from "../../lib/server/student-store";

export default async function AdminPage() {
  const [alerts, students] = await Promise.all([getAdminAlerts(), listStudents()]);

  return (
    <main className="management-shell">
      <section className="dashboard-hero">
        <p className="eyebrow">Area administrativa</p>
        <h1>Gestiona estudiantes, contenido y operacion</h1>
        <p className="auth-copy">
          Esta vista ya te deja ver cuentas creadas de verdad dentro de la
          plataforma, ademas de alertas internas para seguir construyendo.
        </p>
        <div className="account-summary-row">
          <article className="dashboard-card">
            <span className="dashboard-label">Estudiantes creados</span>
            <strong>{students.length}</strong>
          </article>
          <article className="dashboard-card">
            <span className="dashboard-label">Cuentas activas</span>
            <strong>
              {students.filter((student) => student.status === "active").length}
            </strong>
          </article>
          <article className="dashboard-card">
            <span className="dashboard-label">Alertas abiertas</span>
            <strong>
              {alerts.filter((alert) => alert.status !== "resolved").length}
            </strong>
          </article>
        </div>
      </section>

      <section className="management-two-column">
        <section className="detail-card">
          <div className="section-heading">
            <span>Usuarios</span>
            <h2>Estudiantes registrados</h2>
          </div>
          <div className="management-list">
            {students.length ? (
              students.map((student) => (
                <article className="management-list-item" key={student.id}>
                  <div>
                    <h3>{student.fullName}</h3>
                    <p>{student.email}</p>
                  </div>
                  <div className="management-list-meta">
                    <span>{student.status}</span>
                    <small>
                      {new Date(student.createdAt).toLocaleDateString("es-DO")}
                    </small>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty-copy">
                Todavia no hay estudiantes registrados en la plataforma.
              </p>
            )}
          </div>
        </section>

        <section className="detail-card">
          <div className="section-heading">
            <span>Operacion</span>
            <h2>Alertas internas</h2>
          </div>
          <div className="management-list">
            {alerts.map((alert) => (
              <article className="management-list-item" key={alert.id}>
                <div>
                  <h3>{alert.title}</h3>
                  <p>{alert.area}</p>
                </div>
                <div className="management-list-meta">
                  <span>{alert.status}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
