type ProgressCardProps = {
  label: string;
  value: string;
  helper: string;
};

export function ProgressCard({ label, value, helper }: ProgressCardProps) {
  return (
    <article className="progress-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{helper}</span>
    </article>
  );
}
