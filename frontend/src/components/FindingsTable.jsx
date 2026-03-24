const RISK_STYLE = {
  critical: { color: "var(--red)",    bg: "var(--red-dim)" },
  high:     { color: "var(--orange)", bg: "var(--orange-dim)" },
  medium:   { color: "var(--yellow)", bg: "var(--yellow-dim)" },
  low:      { color: "var(--blue)",   bg: "var(--blue-dim)" },
};

export default function FindingsTable({ findings }) {
  if (!findings?.length) return (
    <div style={{ color: "var(--text-muted)", fontFamily: "var(--mono)", fontSize: 12, textAlign: "center", padding: 24 }}>
      NO FINDINGS
    </div>
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--mono)", fontSize: 12 }}>
        <thead>
          <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
            {["TYPE", "RISK", "LINE", "VALUE"].map(h => (
              <th key={h} style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 400 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {findings.map((f, i) => {
            const s = RISK_STYLE[f.risk] || RISK_STYLE.low;
            return (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "10px 12px", color: "var(--text)" }}>{f.type}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{
                    background: s.bg, color: s.color,
                    padding: "2px 8px", borderRadius: 4, fontSize: 11,
                  }}>
                    {f.risk.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "10px 12px", color: "var(--text-muted)" }}>{f.line ?? "—"}</td>
                <td style={{ padding: "10px 12px", color: "var(--text-muted)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
