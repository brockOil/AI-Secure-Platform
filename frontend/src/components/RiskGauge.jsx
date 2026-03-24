import { useEffect, useState } from "react";

const RISK_COLORS = {
  critical: "#ff4d6a",
  high: "#ff9f43",
  medium: "#ffd93d",
  low: "#00ff9d",
};

export default function RiskGauge({ score = 0, maxScore = 20, riskLevel = "low" }) {
  const [offset, setOffset] = useState(251.2);
  const percentage = Math.min(score / maxScore, 1);
  const circumference = 2 * Math.PI * 40;
  const color = RISK_COLORS[riskLevel] || RISK_COLORS.low;

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - percentage * circumference);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  return (
    <div style={{ position: "relative", width: 100, height: 100 }}>
      <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
        {/* Background ring */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="6"
        />
        {/* Progress ring */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.6s",
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      {/* Center text */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "var(--mono)",
          fontSize: 22,
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}>{score}</span>
        <span style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
        }}>/{maxScore}</span>
      </div>
    </div>
  );
}
