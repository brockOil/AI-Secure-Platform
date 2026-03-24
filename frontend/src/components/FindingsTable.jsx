import { useState } from "react";

export default function FindingsTable({ findings }) {
  const [expanded, setExpanded] = useState(null);

  if (!findings?.length) return (
    <div style={{
      color: "var(--text-dim)",
      fontFamily: "var(--mono)",
      fontSize: 12,
      textAlign: "center",
      padding: 32,
      letterSpacing: "0.1em",
    }}>
      NO FINDINGS DETECTED
    </div>
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--mono)", fontSize: 12 }}>
        <thead>
          <tr>
            {["TYPE", "RISK", "LINE", "VALUE"].map(h => (
              <th key={h} style={{
                padding: "10px 14px",
                borderBottom: "1px solid var(--border)",
                fontWeight: 500,
                color: "var(--text-dim)",
                fontSize: 10,
                letterSpacing: "0.12em",
                textAlign: "left",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {findings.map((f, i) => {
            const isExpanded = expanded === i;
            return (
              <tr
                key={i}
                onClick={() => setExpanded(isExpanded ? null : i)}
                style={{
                  borderBottom: "1px solid rgba(48,54,61,0.3)",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  background: isExpanded ? "rgba(0,255,157,0.03)" : "transparent",
                  animation: `row-glow 0.3s ${i * 0.05}s ease both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isExpanded ? "rgba(0,255,157,0.03)" : "transparent";
                }}
              >
                <td style={{ padding: "12px 14px", color: "var(--text)" }}>{f.type}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span className={`risk-badge ${f.risk}`}>
                    {f.risk}
                  </span>
                </td>
                <td style={{ padding: "12px 14px", color: "var(--text-dim)" }}>{f.line ?? "—"}</td>
                <td style={{
                  padding: "12px 14px",
                  color: "var(--text-muted)",
                  maxWidth: isExpanded ? "none" : 240,
                  overflow: isExpanded ? "visible" : "hidden",
                  textOverflow: isExpanded ? "unset" : "ellipsis",
                  whiteSpace: isExpanded ? "pre-wrap" : "nowrap",
                  wordBreak: isExpanded ? "break-all" : "normal",
                  transition: "all 0.2s",
                }}>
                  {f.value ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
