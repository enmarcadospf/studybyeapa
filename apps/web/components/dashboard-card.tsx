import type { DashboardSummary } from "@academia/shared";

export function DashboardCard({ item }: { item: DashboardSummary }) {
  return (
    <article className="dashboard-card">
      <p className="dashboard-label">{item.title}</p>
      <strong>{item.value}</strong>
      <span>{item.helper}</span>
    </article>
  );
}
