const RISK_KEYWORDS = {
  critical: ["password", "passwd"],
  high:     ["api_key", "api-key", "sk-", "token", "bearer", "auth"],
  medium:   ["exception", "traceback", "error", "stack trace"],
  low:      ["@", "email"],
};

const LINE_COLOR = {
  critical: "var(--red)",
  high:     "var(--orange)",
  medium:   "var(--yellow)",
  low:      "var(--blue)",
};

const LINE_BG = {
  critical: "rgba(255,77,106,0.06)",
  high:     "rgba(255,159,67,0.06)",
  medium:   "rgba(255,217,61,0.06)",
  low:      "rgba(77,159,255,0.06)",
};

function classifyLine(line) {
  const lower = line.toLowerCase();
  for (const [risk, keywords] of Object.entries(RISK_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return risk;
  }
  return null;
}

export default function LogViewer({ content, findings = [] }) {
  if (!content) return null;

  const flaggedLines = new Set(findings.map(f => f.line).filter(Boolean));
  const lines = content.split("\n");
  const totalLines = lines.length;

  // Build mini-map data
  const miniMapData = lines.map((line, i) => {
    const lineNum = i + 1;
    if (flaggedLines.has(lineNum)) return classifyLine(line);
    return null;
  });

  return (
    <div style={{ display: "flex", gap: 2, position: "relative" }}>
      {/* Main log viewer */}
      <div className="glass-sm" style={{
        flex: 1,
        overflowY: "auto",
        maxHeight: 320,
        fontFamily: "var(--mono)",
        fontSize: 12,
        padding: 0,
      }}>
        {lines.map((line, i) => {
          const lineNum = i + 1;
          const risk = flaggedLines.has(lineNum) ? classifyLine(line) : null;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                background: risk ? LINE_BG[risk] : "transparent",
                borderLeft: risk ? `3px solid ${LINE_COLOR[risk]}` : "3px solid transparent",
                padding: "3px 12px",
                transition: "background 0.2s",
                boxShadow: risk ? `inset 0 0 20px ${LINE_BG[risk]}` : "none",
              }}
            >
              <span style={{
                color: risk ? LINE_COLOR[risk] : "var(--text-dim)",
                minWidth: 40,
                userSelect: "none",
                fontSize: 11,
                opacity: risk ? 1 : 0.5,
              }}>{lineNum}</span>
              <span style={{
                color: risk ? LINE_COLOR[risk] : "var(--text-muted)",
                wordBreak: "break-all",
                fontWeight: risk ? 500 : 400,
              }}>{line || " "}</span>
            </div>
          );
        })}
      </div>

      {/* Mini-map sidebar */}
      <div style={{
        width: 12,
        borderRadius: 6,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {miniMapData.map((risk, i) => (
          <div key={i} style={{
            height: `${100 / totalLines}%`,
            minHeight: 1,
            background: risk ? LINE_COLOR[risk] : "transparent",
            opacity: risk ? 0.7 : 0,
            transition: "opacity 0.2s",
          }} />
        ))}
      </div>
    </div>
  );
}
