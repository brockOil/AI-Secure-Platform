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

export default function InsightsPanel({ result }) {
  if (!result) return null;
  const { summary, risk_level, risk_score, insights, findings, action } = result;
  const color = RISK_COLOR[risk_level] || "var(--text-muted)";
  const bg = RISK_BG[risk_level] || "var(--surface-2)";

  const typeCounts = findings.reduce((acc, f) => {
    acc[f.risk] = (acc[f.risk] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Risk Score Banner */}
      <div style={{
        background: bg,
        border: `1px solid ${color}`,
        borderRadius: 8,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>RISK LEVEL</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700, color }}>{risk_level.toUpperCase()}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>SCORE</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700, color }}>{risk_score}<span style={{ fontSize: 13, color: "var(--text-muted)" }}>/20</span></div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>ACTION</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, color }}>{action.toUpperCase()}</div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 18px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>AI SUMMARY</div>
        <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>{summary}</div>
      </div>

      {/* Risk Breakdown */}
      {Object.keys(typeCounts).length > 0 && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 18px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>RISK BREAKDOWN</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Object.entries(typeCounts).map(([risk, count]) => (
              <span key={risk} style={{
                background: RISK_BG[risk],
                color: RISK_COLOR[risk],
                border: `1px solid ${RISK_COLOR[risk]}`,
                padding: "4px 12px",
                borderRadius: 4,
                fontFamily: "var(--mono)",
                fontSize: 12,
              }}>
                {count} {risk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {insights?.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 18px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>SECURITY INSIGHTS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {insights.map((ins, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: 12, marginTop: 2 }}>›</span>
                <span style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{ins}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
