export default function ScanningAnimation({ size = 120, label = "AWAITING INPUT" }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
    }}>
      <div style={{ position: "relative", width: size, height: size }}>
        {/* Outer ring pulse */}
        <div style={{
          position: "absolute",
          inset: -10,
          borderRadius: "50%",
          border: "1px solid rgba(255, 77, 106, 0.1)",
          animation: "pulse-ring 3s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          inset: -20,
          borderRadius: "50%",
          border: "1px solid rgba(255, 77, 106, 0.05)",
          animation: "pulse-ring 3s 0.5s ease-in-out infinite",
        }} />

        {/* Main circle */}
        <svg width={size} height={size} viewBox="0 0 120 120">
          {/* Background ring */}
          <circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke="rgba(255, 77, 106, 0.08)"
            strokeWidth="1.5"
          />

          {/* Dashed tracking ring */}
          <circle
            cx="60" cy="60" r="45"
            fill="none"
            stroke="rgba(255, 77, 106, 0.12)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />

          {/* Radar sweep */}
          <line
            x1="60" y1="60" x2="60" y2="15"
            stroke="rgba(255, 77, 106, 0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ transformOrigin: "60px 60px", animation: "radar-sweep 4s linear infinite" }}
          />

          {/* Center dot */}
          <circle cx="60" cy="60" r="3" fill="var(--accent)" opacity="0.6" />
          <circle cx="60" cy="60" r="6" fill="none" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" />

          {/* Cross hairs */}
          <line x1="40" y1="60" x2="50" y2="60" stroke="rgba(255, 77, 106, 0.2)" strokeWidth="0.5" />
          <line x1="70" y1="60" x2="80" y2="60" stroke="rgba(255, 77, 106, 0.2)" strokeWidth="0.5" />
          <line x1="60" y1="40" x2="60" y2="50" stroke="rgba(255, 77, 106, 0.2)" strokeWidth="0.5" />
          <line x1="60" y1="70" x2="60" y2="80" stroke="rgba(255, 77, 106, 0.2)" strokeWidth="0.5" />
        </svg>
      </div>

      <div style={{
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "var(--text-dim)",
        letterSpacing: "0.2em",
        animation: "fade-in 1s ease",
      }}>{label}</div>
    </div>
  );
}
