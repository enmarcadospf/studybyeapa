import { getCourses } from "../../lib/api";

const iconMap: Record<string, string> = {
  "anatomia-clinica": "⚕",
  "fisiologia-medica": "◉",
  "bioquimica-medica": "⌬",
  "farmacologia-general": "◖",
  "patologia-general": "◎",
  infectologia: "✺",
  "semiologia-clinica": "◌",
  anatomia: "⚕",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="public-shell-eapa">
      <section className="soft-card courses-shell-eapa">
        <div className="courses-topbar-eapa">
          <div>
            <h1>Cursos</h1>
            <p>Explora nuestras materias y empieza a estudiar hoy.</p>
          </div>
          <div className="courses-filters-eapa">
            <input className="input-eapa" placeholder="Buscar cursos..." />
            <select className="input-eapa">
              <option>Categoria: Todas</option>
            </select>
            <select className="input-eapa">
              <option>Nivel: Todos</option>
            </select>
            <button className="grid-button-eapa" type="button">
              ▦
            </button>
          </div>
        </div>

        <div className="courses-grid-eapa">
          {courses.map((course) => (
            <a
              key={course.id}
              href={`/courses/${course.slug}`}
              className="course-card-eapa"
            >
              <div className="course-card-icon-eapa">
                {iconMap[course.slug] ?? "📘"}
              </div>
              <h3>{course.title}</h3>
              <p>{course.summary}</p>
              <div className="course-card-meta-eapa">
                <span>{course.lessons} lecciones</span>
                <strong>{course.level}</strong>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
