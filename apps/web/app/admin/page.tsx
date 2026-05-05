import { courses, lessons, modules } from "@academia/shared";
import { redirect } from "next/navigation";
import { AdminUserManager } from "../../components/admin/admin-user-manager";
import { MaterialManager } from "../../components/admin/material-manager";
import { getAdminAlerts } from "../../lib/api";
import { listAdminUsers } from "../../lib/server/admin-store";
import { getCurrentAdminSession } from "../../lib/server/session";
import { listLessonMaterials } from "../../lib/server/lesson-material-store";
import { listStudents } from "../../lib/server/student-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  const [alerts, students, lessonMaterials, adminUsers] = await Promise.all([
    getAdminAlerts(),
    listStudents(),
    listLessonMaterials(),
    listAdminUsers(),
  ]);

  const materialRows = lessons.map((lesson) => {
    const course = courses.find((item) => item.slug === lesson.courseSlug);
    const module = modules.find((item) => item.id === lesson.moduleId);
    const material = lessonMaterials.find((item) => item.lessonId === lesson.id);

    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      courseSlug: lesson.courseSlug,
      moduleId: lesson.moduleId,
      courseTitle: course?.title ?? lesson.courseSlug,
      moduleTitle: module?.title ?? "Modulo sin titulo",
      lessonOrder: lesson.order,
      contentType: lesson.contentType,
      sourceTitle: material?.sourceTitle ?? "",
      content: material?.content ?? "",
      updatedAt: material?.updatedAt ?? null,
    };
  });

  return (
    <main className="management-shell">
      <section className="dashboard-hero">
        <div className="admin-hero-top-eapa">
          <p className="eyebrow">Configuracion interna</p>
          <form action="/api/auth/logout" method="post">
            <button className="secondary-btn" type="submit">
              Salir del editor
            </button>
          </form>
        </div>
        <h1>Configura estudiantes, contenido y operación</h1>
        <p className="auth-copy">
          Esta vista ya te deja ver cuentas creadas de verdad dentro de la
          plataforma, además de cargar material real para que la IA estudie tu
          contenido antes de generar flashcards, quiz y modo residente.
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

      <section className="detail-card admin-material-section">
        <AdminUserManager
          admins={adminUsers}
          currentAdminEmail={admin.email}
          isOwner={admin.isOwner}
        />
      </section>

      <section className="detail-card admin-material-section">
        <div className="section-heading">
          <span>IA y contenido</span>
          <h2>Material real para flashcards y bancos de preguntas</h2>
          <p>
            Pega aqui tu guia, lectura, transcripcion o apuntes por leccion.
            Cuando el estudiante use la IA, primero se tomara este material como
            fuente principal.
          </p>
        </div>
        <MaterialManager lessons={materialRows} />
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
                    <small>{student.subscriptions.length} suscripciones</small>
                    <small>{student.devices.length} dispositivos</small>
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
