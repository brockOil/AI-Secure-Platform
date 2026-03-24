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
  critical: "rgba(255,77,106,0.07)",
  high:     "rgba(255,159,67,0.07)",
  medium:   "rgba(255,217,61,0.07)",
  low:      "rgba(77,159,255,0.07)",
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

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      overflowY: "auto",
      maxHeight: 320,
      fontFamily: "var(--mono)",
      fontSize: 12,
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
            }}
          >
            <span style={{ color: "var(--text-muted)", minWidth: 36, userSelect: "none" }}>{lineNum}</span>
            <span style={{ color: risk ? LINE_COLOR[risk] : "var(--text)", wordBreak: "break-all" }}>{line || " "}</span>
          </div>
        );
      })}
    </div>
  );
}
