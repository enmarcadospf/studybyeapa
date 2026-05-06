import type { StudentAccount } from "@academia/shared";

type AchievementsPanelProps = {
  student: StudentAccount;
};

export function AchievementsPanel({ student }: AchievementsPanelProps) {
  const activeSubscriptions = student.subscriptions.filter(
    (subscription) => subscription.status === "active",
  );
  const achievements = [
    {
      title: "Primer paso",
      description: "Crear tu cuenta de estudiante.",
      unlocked: true,
      progress: 100,
    },
    {
      title: "Curso iniciado",
      description: "Tener al menos un curso activo.",
      unlocked: activeSubscriptions.length > 0,
      progress: activeSubscriptions.length > 0 ? 100 : 0,
    },
    {
      title: "Explorador médico",
      description: "Entrar a 3 cursos distintos.",
      unlocked: student.enrolledCourseSlugs.length >= 3,
      progress: Math.min(100, Math.round((student.enrolledCourseSlugs.length / 3) * 100)),
    },
    {
      title: "Cuenta organizada",
      description: "Configurar universidad o nota de perfil.",
      unlocked: Boolean(student.university || student.profileNote),
      progress: student.university || student.profileNote ? 100 : 30,
    },
  ];

  return (
    <section className="achievements-grid-eapa">
      {achievements.map((achievement) => (
        <article
          className={achievement.unlocked ? "soft-card achievement-card-eapa is-unlocked" : "soft-card achievement-card-eapa"}
          key={achievement.title}
        >
          <div className="achievement-medal-eapa">{achievement.unlocked ? "★" : "☆"}</div>
          <span>{achievement.unlocked ? "Desbloqueado" : "En progreso"}</span>
          <h2>{achievement.title}</h2>
          <p>{achievement.description}</p>
          <div className="material-progress-eapa" aria-hidden="true">
            <i style={{ width: `${achievement.progress}%` }} />
          </div>
          <small>{achievement.progress}% completado</small>
        </article>
      ))}
    </section>
  );
}
