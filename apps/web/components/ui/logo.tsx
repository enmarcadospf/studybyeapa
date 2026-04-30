type LogoProps = {
  small?: boolean;
};

export function Logo({ small = false }: LogoProps) {
  return (
    <div className="eapa-logo">
      <img
        alt="Study by EAPA"
        className={`eapa-logo-mark ${small ? "eapa-logo-mark-small" : ""}`}
        src="/studybyeapa-logo.svg"
      />
      <div className="eapa-logo-copy">
        <strong>
          Study <span>by</span> EAPA
        </strong>
        {!small ? <small>Aprende medicina facil y feliz</small> : null}
      </div>
    </div>
  );
}
