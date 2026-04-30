const studentLinks = [
  { href: "/student", label: "Inicio" },
  { href: "/courses", label: "Mis cursos" },
  { href: "/calendar", label: "Calendario" },
  { href: "/simulacros", label: "Simulacros" },
  { href: "/settings", label: "Configuracion" },
];

type StudentSidebarProps = {
  activeHref: string;
};

export function StudentSidebar({ activeHref }: StudentSidebarProps) {
  return (
    <aside className="student-sidebar">
      <div className="student-sidebar-head">
        <span>Panel del estudiante</span>
        <strong>Study by EAPA</strong>
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
