import { getTeacherTasks } from "../../lib/api";

export default async function TeacherPage() {
  const tasks = await getTeacherTasks();

  return (
    <main className="management-shell">
      <section className="dashboard-hero">
        <p className="eyebrow">Area del profesor</p>
        <h1>Gestiona contenido, cohortes y tareas pendientes</h1>
        <p className="auth-copy">
          Esta vista base sirve para coordinar publicaciones, soporte academico
          y tutorias desde un solo lugar.
        </p>
      </section>

      <section className="management-grid">
        {tasks.map((task) => (
          <article className="detail-card" key={task.id}>
            <p className="course-category">{task.courseTitle}</p>
            <h3>{task.title}</h3>
            <p>Fecha objetivo: {task.dueLabel}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
