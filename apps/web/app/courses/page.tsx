import { courseFocusAreas } from "@academia/shared";
import { getCourses } from "../../lib/api";
import { CourseCard } from "../../components/ui/course-card";
import { MascotIllustration } from "../../components/ui/mascot-illustration";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="catalog-shell">
      <section className="mock-courses-hero">
        <div>
          <h1 className="mock-page-title">Cursos</h1>
          <p className="mock-page-copy">
            Explora nuestros cursos y elige lo que quieres aprender hoy.
          </p>
        </div>
        <div className="mock-courses-illustration">
          <MascotIllustration compact />
        </div>
      </section>

      <section className="mock-course-toolbar">
        <input className="catalog-search" placeholder="Buscar curso..." />
        <select className="mock-course-select" defaultValue="Todas las categorias">
          <option>Todas las categorias</option>
          <option>Ciencias basicas</option>
          <option>Clinicas</option>
        </select>
      </section>

      <section className="mock-course-grid">
        {courses.map((course) => (
          <CourseCard
            course={course}
            key={course.id}
            topics={courseFocusAreas[course.slug] ?? []}
          />
        ))}
      </section>
    </main>
  );
}
