import Link from "next/link";
import { courseFocusAreas } from "@academia/shared";
import { getCourses } from "../../lib/api";
import { CourseCard } from "../../components/ui/course-card";
import { MascotIllustration } from "../../components/ui/mascot-illustration";
import { PageHeader } from "../../components/ui/page-header";
import { AppButton } from "../../components/ui/app-button";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="catalog-shell">
      <section className="catalog-hero catalog-hero-grid">
        <div>
          <PageHeader
            description="Elige una materia, entra por modulos y repasa con una experiencia clara y suave."
            eyebrow="Cursos"
            title="Explora tus cursos"
          />
        </div>
        <div className="catalog-side-card">
          <MascotIllustration compact />
          <h2>Empieza como estudiante</h2>
          <p>Crea tu cuenta y desbloquea cada curso por periodos de 3 meses.</p>
          <div className="stack-actions">
            <AppButton href="/auth/register">Crear cuenta</AppButton>
            <AppButton href="/auth/login" variant="secondary">Iniciar sesion</AppButton>
          </div>
        </div>
      </section>

      <section className="catalog-toolbar">
        <input className="catalog-search" placeholder="Buscar curso..." />
        <div className="catalog-pills">
          <span className="topic-chip">Todas las categorias</span>
          <span className="topic-chip">Ciencias basicas</span>
          <span className="topic-chip">Especialidades</span>
        </div>
      </section>

      <section className="catalog-grid">
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
