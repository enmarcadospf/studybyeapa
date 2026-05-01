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

  if (!whiteIcon) {
    return (
      <img
        src="/studybyeapa-logo-mark.png"
        alt=""
        aria-hidden="true"
        className={className}
        decoding="async"
      />
    );
  }

  const navy = whiteIcon ? "#FFFFFF" : "#0D2B5E";
  const blue = whiteIcon ? "#FFFFFF" : "#2D6CC4";
  const light = whiteIcon ? "#FFFFFF" : "#A9C7E8";
  const blush = "#FFA7A7";

  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Cerebro feliz */}
      <path
        d="M69 88C54 87 43 76 43 61C43 45 55 34 72 36C78 22 96 21 105 35C114 21 132 22 138 36C155 34 167 45 167 61C167 76 156 87 141 88C132 99 116 101 105 90C94 101 78 99 69 88Z"
        fill={whiteIcon ? "transparent" : "#F8FBFF"}
        stroke={blue}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M105 36V90" stroke={blue} strokeWidth="6.5" strokeLinecap="round" />
      <path d="M75 56C83 51 91 54 94 63" stroke={blue} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M135 56C127 51 119 54 116 63" stroke={blue} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M65 70C68 65 74 64 78 69" stroke={blue} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M145 70C142 65 136 64 132 69" stroke={blue} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M82 72C85 77 91 77 94 72" stroke={navy} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M116 72C119 77 125 77 128 72" stroke={navy} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M94 85C100 93 110 93 116 85" stroke={navy} strokeWidth="5.5" strokeLinecap="round" />
      {!whiteIcon ? (
        <>
          <circle cx="73" cy="82" r="7" fill={blush} opacity="0.9" />
          <circle cx="137" cy="82" r="7" fill={blush} opacity="0.9" />
        </>
      ) : null}

      {/* Estetoscopio separado del cerebro */}
      <path
        d="M89 112C89 132 100 145 110 153C120 145 131 132 131 112"
        stroke={blue}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path d="M131 112C131 101 145 101 145 112" stroke={navy} strokeWidth="8" strokeLinecap="round" />
      <path d="M89 112C89 101 75 101 75 112" stroke={navy} strokeWidth="8" strokeLinecap="round" />
      <circle cx="88" cy="112" r="6" fill={navy} />
      <circle cx="132" cy="112" r="6" fill={navy} />
      <circle
        cx="110"
        cy="152"
        r="16"
        fill={whiteIcon ? "transparent" : "white"}
        stroke={navy}
        strokeWidth="7"
      />
      <circle cx="110" cy="152" r="6" fill={blue} />

      {/* Libro abierto */}
      <path
        d="M26 158C55 149 84 153 110 174C136 153 165 149 194 158V195C162 187 136 191 110 209C84 191 58 187 26 195V158Z"
        fill={whiteIcon ? "transparent" : "white"}
        stroke={blue}
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path d="M110 174V209" stroke={navy} strokeWidth="7" strokeLinecap="round" />
      <path d="M43 174C62 168 82 171 100 184" stroke={light} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M120 184C138 171 158 168 177 174" stroke={light} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M42 187C61 182 80 185 99 197" stroke={light} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M121 197C140 185 159 182 178 187" stroke={light} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M29 195C62 188 88 194 110 209C132 194 158 188 191 195" stroke={navy} strokeWidth="7" strokeLinecap="round" />
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

  if (!white && !iconOnly) {
    return (
      <img
        src="/studybyeapa-logo-horizontal.png"
        alt="Study by EAPA - Aprende medicina fácil y feliz"
        className={smallMode ? "eapa-logo-image-nav" : "eapa-logo-image"}
        decoding="async"
      />
    );
  }

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
            Aprende medicina fácil y feliz
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Logo;
