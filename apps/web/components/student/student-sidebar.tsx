import Link from "next/link";
import { Logo } from "../ui/logo";

const studentLinks = [
  { href: "/student", label: "Inicio", icon: "⌂" },
  { href: "/courses", label: "Mis cursos", icon: "▤" },
  { href: "/calendar", label: "Calendario", icon: "◫" },
  { href: "/simulacros", label: "Simulacros", icon: "☑" },
  { href: "#", label: "Mensajes", icon: "✉" },
  { href: "#", label: "Logros", icon: "★" },
  { href: "#", label: "Notas", icon: "✎" },
  { href: "/settings", label: "Ajustes", icon: "⚙" },
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
              <span className="student-sidebar-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <form action="/api/auth/logout" method="post">
        <button className="student-sidebar-logout" type="submit">
          <span className="student-sidebar-icon">↩</span>
          Cerrar sesion
        </button>
      </form>
    </aside>
  );
}
