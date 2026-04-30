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
        d="M54 51C43 50 35 42 35 31C35 20 44 12 55 14C60 5 74 5 80 16C86 5 100 5 105 14C116 12 125 20 125 31C125 42 117 50 106 51C99 59 87 60 80 51C73 60 61 59 54 51Z"
        fill={whiteIcon ? "transparent" : "#F8FBFF"}
        stroke={blue}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M80 17V52" stroke={blue} strokeWidth="5" strokeLinecap="round" />
      <path d="M58 29C64 27 68 30 69 35" stroke={blue} strokeWidth="4" strokeLinecap="round" />
      <path d="M101 29C95 27 91 30 90 35" stroke={blue} strokeWidth="4" strokeLinecap="round" />
      <path d="M65 45C68 49 73 49 76 45" stroke={navy} strokeWidth="4" strokeLinecap="round" />
      <path d="M87 45C90 49 95 49 98 45" stroke={navy} strokeWidth="4" strokeLinecap="round" />
      <path d="M72 56C76 61 84 61 88 56" stroke={navy} strokeWidth="4" strokeLinecap="round" />
      {!whiteIcon ? (
        <>
          <circle cx="55" cy="50" r="5" fill={orange} opacity="0.85" />
          <circle cx="105" cy="50" r="5" fill={orange} opacity="0.85" />
        </>
      ) : null}
      <path
        d="M67 69C67 82 75 91 80 97C85 91 93 82 93 69"
        stroke={blue}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M93 69C93 61 103 61 103 69" stroke={navy} strokeWidth="6" strokeLinecap="round" />
      <path d="M67 69C67 61 57 61 57 69" stroke={navy} strokeWidth="6" strokeLinecap="round" />
      <circle
        cx="80"
        cy="96"
        r="10"
        fill={whiteIcon ? "transparent" : "white"}
        stroke={navy}
        strokeWidth="5"
      />
      <circle cx="80" cy="96" r="4" fill={blue} />
      <path
        d="M18 103C38 96 58 97 80 113C102 97 122 96 142 103V132C119 126 99 128 80 141C61 128 41 126 18 132V103Z"
        fill={whiteIcon ? "transparent" : "white"}
        stroke={blue}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M80 113V141" stroke={navy} strokeWidth="5" strokeLinecap="round" />
      <path d="M29 113C45 109 58 111 72 120" stroke={light} strokeWidth="4" strokeLinecap="round" />
      <path d="M88 120C102 111 115 109 131 113" stroke={light} strokeWidth="4" strokeLinecap="round" />
      <path d="M20 132C43 128 62 131 80 141C98 131 117 128 140 132" stroke={navy} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  compact = false,
  white = false,
  small = false,
}: LogoProps) {
  const compactMode = compact || small;

  return (
    <div className="eapa-logo-real">
      <BrainBookIcon
        variant={white ? "white" : "normal"}
        className={compactMode ? "logo-icon-sm" : "logo-icon-lg"}
      />
      {!compactMode ? (
        <div className="eapa-logo-real-copy">
          <div className={white ? "eapa-logo-title is-white" : "eapa-logo-title"}>
            Study <span>by</span> <strong>EAPA</strong>
          </div>
          <div className={white ? "eapa-logo-subtitle is-white" : "eapa-logo-subtitle"}>
            Aprende medicina facil y feliz
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Logo;
