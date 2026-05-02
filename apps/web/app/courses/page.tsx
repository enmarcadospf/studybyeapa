import { getCourses } from "../../lib/api";
import { CourseCatalog } from "../../components/courses/course-catalog";
import { BrainBookIcon } from "../../components/ui/logo";
import { getCurrentStudentSession } from "../../lib/server/session";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const [courses, student] = await Promise.all([
    getCourses(),
    getCurrentStudentSession(),
  ]);

  return (
    <main className="public-shell-eapa">
      <section className="soft-card courses-shell-eapa">
        <div className="courses-topbar-eapa">
          <div className="courses-heading-eapa">
            <span className="courses-eyebrow-eapa">Catálogo médico</span>
            <h1>Cursos</h1>
            <p>
              Explora nuestras materias, revisa módulos y elige qué quieres
              aprender hoy.
            </p>
          </div>
          <div className="courses-mascot-eapa" aria-hidden="true">
            <span className="courses-star courses-star-one">✦</span>
            <span className="courses-star courses-star-two">✦</span>
            <BrainBookIcon className="courses-brain-icon" />
          </div>
        </div>

        <CourseCatalog
          courses={courses}
          enrolledCourseSlugs={student?.enrolledCourseSlugs ?? []}
        />
      </section>
    </main>
  );
}
