import Link from "next/link";
import { Logo } from "../ui/logo";

const studentLinks = [
  { href: "/student", label: "Inicio" },
  { href: "/courses", label: "Mis cursos" },
  { href: "/calendar", label: "Calendario" },
  { href: "/simulacros", label: "Simulacros" },
  { href: "#", label: "Mensajes" },
  { href: "#", label: "Logros" },
  { href: "#", label: "Notas" },
  { href: "/settings", label: "Ajustes" },
];

type StudentSidebarProps = {
  activeHref: string;
};

export function StudentSidebar({ activeHref }: StudentSidebarProps) {
  return (
    <aside className="student-sidebar-eapa">
      <div>
        <div className="student-sidebar-logo">
          <Logo compact white />
        </div>
        <nav className="student-sidebar-nav-eapa">
          {studentLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={
                link.href === activeHref
                  ? "student-sidebar-link-eapa is-active"
                  : "student-sidebar-link-eapa"
              }
            >
              <span className="student-sidebar-dot" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <form action="/api/auth/logout" method="post">
        <button className="student-sidebar-logout" type="submit">
          <span className="student-sidebar-dot" />
          Cerrar sesion
        </button>
      </form>
    </aside>
  );
}
