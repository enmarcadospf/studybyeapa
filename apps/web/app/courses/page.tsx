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

const progressMap: Record<string, number> = {
  "semiologia-clinica": 65,
  infectologia: 42,
  anatomia: 70,
  "fisiologia-medica": 48,
  "bioquimica-medica": 36,
  "farmacologia-general": 30,
  "patologia-general": 25,
};

const levelLabel: Record<string, string> = {
  beginner: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="public-shell-eapa">
      <section className="soft-card courses-shell-eapa">
        <div className="courses-topbar-eapa">
          <div>
            <span className="pill-badge-eapa">Catálogo médico</span>
            <h1>Cursos</h1>
            <p>Explora nuestras materias, revisa módulos y empieza a estudiar hoy.</p>
          </div>
          <div className="courses-filters-eapa">
            <input className="input-eapa" placeholder="Buscar cursos..." />
            <select className="input-eapa">
              <option>Categoría: Todas</option>
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
          {courses.map((course, index) => {
            const progress = progressMap[course.slug] ?? 35 + index * 10;

            return (
            <a
              key={course.id}
              href={`/courses/${course.slug}`}
              className="course-card-eapa"
            >
              <div className="course-card-visual-eapa">
                <div className="course-card-icon-eapa">
                  {iconMap[course.slug] ?? "📘"}
                </div>
              </div>
              <h3>{course.title}</h3>
              <p>{course.summary}</p>
              <div className="course-card-meta-eapa">
                <span>{course.lessons} lecciones</span>
                <strong>{levelLabel[course.level] ?? course.level}</strong>
              </div>
              <div className="course-progress-eapa">
                <div>
                  <span>Progreso</span>
                  <strong>{progress}%</strong>
                </div>
                <div className="progress-track-eapa">
                  <div className="progress-fill-eapa" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </a>
          );
          })}
        </div>
      </section>
    </main>
  );
}
