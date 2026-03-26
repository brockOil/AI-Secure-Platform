import RiskGauge from "./RiskGauge";

const RISK_COLOR = {
  critical: "var(--red)",
  high:     "var(--orange)",
  medium:   "var(--yellow)",
  low:      "var(--accent)",
};

const RISK_BG = {
  critical: "var(--red-dim)",
  high:     "var(--orange-dim)",
  medium:   "var(--yellow-dim)",
  low:      "var(--accent-dim)",
};

const ACTION_STYLE = {
  blocked: { color: "var(--red)", bg: "var(--red-dim)", icon: "🛑" },
  masked:  { color: "var(--yellow)", bg: "var(--yellow-dim)", icon: "🔒" },
  allowed: { color: "var(--accent)", bg: "var(--accent-dim)", icon: "✅" },
};

export default function InsightsPanel({ result }) {
  if (!result) return null;
  const { summary, risk_level, risk_score, insights, findings, action } = result;
  const color = RISK_COLOR[risk_level] || "var(--text-muted)";
  const act = ACTION_STYLE[action] || ACTION_STYLE.allowed;

  const typeCounts = findings.reduce((acc, f) => {
    acc[f.risk] = (acc[f.risk] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Risk Score Banner */}
      <div className="glass-sm" style={{
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        borderColor: `${color}33`,
      }}>
        <RiskGauge score={risk_score} maxScore={100} riskLevel={risk_level} />

        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text-dim)",
            letterSpacing: "0.15em",
            marginBottom: 6,
          }}>RISK LEVEL</div>
          <div style={{
            fontFamily: "var(--mono)",
            fontSize: 20,
            fontWeight: 700,
            color,
            letterSpacing: "0.05em",
          }}>{risk_level.toUpperCase()}</div>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "8px 16px",
          borderRadius: 8,
          background: act.bg,
          border: `1px solid ${act.color}33`,
        }}>
          <span style={{ fontSize: 18 }}>{act.icon}</span>
          <span style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            fontWeight: 600,
            color: act.color,
            letterSpacing: "0.08em",
          }}>{action.toUpperCase()}</span>
        </div>
      </div>

      {/* AI Summary */}
      <div className="glass-sm" style={{ padding: "16px 20px" }}>
        <div className="section-label">AI SUMMARY</div>
        <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7, fontWeight: 300 }}>{summary}</div>
      </div>

      {/* Risk Breakdown */}
      {Object.keys(typeCounts).length > 0 && (
        <div className="glass-sm" style={{ padding: "16px 20px" }}>
          <div className="section-label">RISK BREAKDOWN</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(typeCounts).map(([risk, count]) => (
              <span key={risk} className={`risk-badge ${risk}`} style={{ padding: "5px 14px", fontSize: 11 }}>
                {count} {risk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {insights?.length > 0 && (
        <div className="glass-sm" style={{ padding: "16px 20px" }}>
          <div className="section-label">SECURITY INSIGHTS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {insights.map((ins, i) => (
              <div key={i} className={`fade-up-${Math.min(i + 1, 4)}`} style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "8px 12px",
                borderRadius: 8,
                background: "rgba(255,77,106,0.03)",
                borderLeft: "2px solid var(--accent)",
              }}>
                <span style={{
                  color: "var(--accent)",
                  fontFamily: "var(--mono)",
                  fontSize: 14,
                  lineHeight: 1,
                  marginTop: 2,
                  flexShrink: 0,
                }}>›</span>
                <span style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, fontWeight: 300 }}>{ins}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
