type NapitalaiICTCLogoProps = {
  className?: string;
  size?: number;
  variant?: "full" | "icon";
};

export function NapitalaiICTCLogo({
  className,
  size = 40,
  variant = "full",
}: NapitalaiICTCLogoProps) {
  if (variant === "icon") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Napitalai ICTC"
      >
        {/* Outer ring */}
        <circle cx="20" cy="20" r="18" stroke="#3B82F6" strokeWidth="2" />
        {/* Meridian vertical */}
        <ellipse cx="20" cy="20" rx="7" ry="18" stroke="#3B82F6" strokeWidth="1.2" />
        {/* Equator horizontal */}
        <line x1="2" y1="20" x2="38" y2="20" stroke="#3B82F6" strokeWidth="1.2" />
        {/* Upper parallel */}
        <ellipse cx="20" cy="13" rx="14.5" ry="3.5" stroke="#60A5FA" strokeWidth="0.9" opacity="0.7" />
        {/* Lower parallel */}
        <ellipse cx="20" cy="27" rx="14.5" ry="3.5" stroke="#60A5FA" strokeWidth="0.9" opacity="0.7" />
        {/* Center pin */}
        <circle cx="20" cy="20" r="3" fill="#2563EB" />
        <circle cx="20" cy="20" r="1.5" fill="#BFDBFE" />
      </svg>
    );
  }

  return (
    <svg
      width={variant === "full" ? size * 5.5 : size}
      height={size}
      viewBox="0 0 220 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Napitalai ICTC"
    >
      {/* ── Globe icon ── */}
      <circle cx="20" cy="20" r="18" stroke="#3B82F6" strokeWidth="2" />
      <ellipse cx="20" cy="20" rx="7" ry="18" stroke="#3B82F6" strokeWidth="1.2" />
      <line x1="2" y1="20" x2="38" y2="20" stroke="#3B82F6" strokeWidth="1.2" />
      <ellipse cx="20" cy="13" rx="14.5" ry="3.5" stroke="#60A5FA" strokeWidth="0.9" opacity="0.7" />
      <ellipse cx="20" cy="27" rx="14.5" ry="3.5" stroke="#60A5FA" strokeWidth="0.9" opacity="0.7" />
      <circle cx="20" cy="20" r="3" fill="#2563EB" />
      <circle cx="20" cy="20" r="1.5" fill="#BFDBFE" />

      {/* ── Wordmark ── */}
      {/* NAPITALAI */}
      <text
        x="46"
        y="22"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="16"
        fontWeight="700"
        letterSpacing="0.06em"
        fill="currentColor"
      >
        NAPITALAI
      </text>
      {/* ICTC */}
      <text
        x="47"
        y="34"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="9"
        fontWeight="500"
        letterSpacing="0.28em"
        fill="#60A5FA"
      >
        ICTC
      </text>

      {/* Thin vertical divider */}
      <line x1="155" y1="10" x2="155" y2="30" stroke="#3B82F6" strokeWidth="0.8" opacity="0.5" />

      {/* NSDI label */}
      <text
        x="163"
        y="23"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="10"
        fontWeight="400"
        letterSpacing="0.12em"
        fill="#93C5FD"
        opacity="0.85"
      >
        NSDI
      </text>
    </svg>
  );
}
