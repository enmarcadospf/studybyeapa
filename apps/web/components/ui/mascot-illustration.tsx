type MascotIllustrationProps = {
  compact?: boolean;
};

export function MascotIllustration({
  compact = false,
}: MascotIllustrationProps) {
  return (
    <div className={`mascot-shell ${compact ? "mascot-shell-compact" : ""}`}>
      <div className="mascot-glow" />
      <img
        alt="Mascota Study by EAPA"
        className="mascot-image"
        src="/studybyeapa-logo.svg"
      />
      <div className="mascot-spark mascot-spark-left" />
      <div className="mascot-spark mascot-spark-right" />
    </div>
  );
}
