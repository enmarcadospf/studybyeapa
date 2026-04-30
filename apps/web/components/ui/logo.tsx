type BrainBookIconProps = {
  className?: string;
  variant?: "normal" | "white";
};

type LogoProps = {
  compact?: boolean;
  white?: boolean;
  small?: boolean;
};

export function BrainBookIcon({
  className = "logo-icon",
  variant = "normal",
}: BrainBookIconProps) {
  const whiteIcon = variant === "white";
  const navy = whiteIcon ? "#FFFFFF" : "#0D2B5E";
  const blue = whiteIcon ? "#FFFFFF" : "#2D6CC4";
  const light = whiteIcon ? "#FFFFFF" : "#A9C7E8";
  const orange = "#FFB173";

  return (
    <svg
      viewBox="0 0 160 150"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M51 50C41 50 34 42 34 32C34 22 42 14 53 15C58 7 71 7 77 17C83 7 97 7 102 15C113 14 121 22 121 32C121 42 114 50 104 50C99 58 88 61 80 54C72 61 60 58 51 50Z"
        fill={whiteIcon ? "transparent" : "#F8FBFF"}
        stroke={blue}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M80 18V53" stroke={blue} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M59 30C64 28 68 31 69 35" stroke={blue} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M100 30C95 28 91 31 90 35" stroke={blue} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M67 44C69 47 73 47 75 44" stroke={navy} strokeWidth="4" strokeLinecap="round" />
      <path d="M85 44C87 47 91 47 93 44" stroke={navy} strokeWidth="4" strokeLinecap="round" />
      <path d="M72 55C76 59 84 59 88 55" stroke={navy} strokeWidth="4" strokeLinecap="round" />
      {!whiteIcon ? (
        <>
          <circle cx="57" cy="48" r="4.5" fill={orange} opacity="0.85" />
          <circle cx="103" cy="48" r="4.5" fill={orange} opacity="0.85" />
        </>
      ) : null}
      <path
        d="M67 68C67 79 74 88 80 94C86 88 93 79 93 68"
        stroke={blue}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M93 68C93 60 102 60 102 68" stroke={navy} strokeWidth="5" strokeLinecap="round" />
      <path d="M67 68C67 60 58 60 58 68" stroke={navy} strokeWidth="5" strokeLinecap="round" />
      <circle
        cx="80"
        cy="93"
        r="9"
        fill={whiteIcon ? "transparent" : "white"}
        stroke={navy}
        strokeWidth="4.5"
      />
      <circle cx="80" cy="93" r="3.5" fill={blue} />
      <path
        d="M22 104C40 98 58 100 80 114C102 100 120 98 138 104V126C118 121 100 123 80 136C60 123 42 121 22 126V104Z"
        fill={whiteIcon ? "transparent" : "white"}
        stroke={blue}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path d="M80 114V136" stroke={navy} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M31 112C45 109 56 111 72 120" stroke={light} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M88 120C104 111 115 109 129 112" stroke={light} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M24 126C44 122 61 125 80 136C99 125 116 122 136 126" stroke={navy} strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  compact = false,
  white = false,
  small = false,
}: LogoProps) {
  const iconOnly = compact;
  const smallMode = small && !compact;

  return (
    <div className="eapa-logo-real">
      <BrainBookIcon
        variant={white ? "white" : "normal"}
        className={iconOnly ? "logo-icon-sm" : smallMode ? "logo-icon-nav" : "logo-icon-lg"}
      />
      {!iconOnly ? (
        <div className="eapa-logo-real-copy">
          <div className={white ? `eapa-logo-title is-white ${smallMode ? "is-small" : ""}` : `eapa-logo-title ${smallMode ? "is-small" : ""}`}>
            Study <span>by</span> <strong>EAPA</strong>
          </div>
          <div className={white ? `eapa-logo-subtitle is-white ${smallMode ? "is-small" : ""}` : `eapa-logo-subtitle ${smallMode ? "is-small" : ""}`}>
            Aprende medicina facil y feliz
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Logo;
