const studentLinks = [
  { href: "/student", label: "Inicio" },
  { href: "/courses", label: "Mis cursos" },
  { href: "/calendar", label: "Calendario" },
  { href: "#", label: "Mis apuntes" },
  { href: "/simulacros", label: "Simulacros" },
  { href: "#", label: "Progreso" },
  { href: "#", label: "Mensajes" },
  { href: "/settings", label: "Configuracion" },
];

type StudentSidebarProps = {
  activeHref: string;
};

export function StudentSidebar({ activeHref }: StudentSidebarProps) {
  return (
    <aside className="student-sidebar">
      <div className="student-sidebar-head">
        <span>Study by EAPA</span>
        <strong>Panel del estudiante</strong>
      </div>
      <nav className="student-sidebar-nav">
        {studentLinks.map((link) => (
          <a
            className={link.href === activeHref ? "student-sidebar-link is-active" : "student-sidebar-link"}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
