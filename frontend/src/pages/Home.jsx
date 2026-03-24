import { useState } from "react";
import FileUpload from "../components/FileUpload";
import FindingsTable from "../components/FindingsTable";
import InsightsPanel from "../components/InsightsPanel";
import LogViewer from "../components/LogViewer";
import { analyzeText, analyzeFile } from "../api/analyze";

const INPUT_TYPES = ["text", "log", "sql", "chat"];

const SECTION = ({ label, children }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{
      fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)",
      marginBottom: 10, letterSpacing: "0.08em",
    }}>{label}</div>
    {children}
  </div>
);

export default function Home() {
  const [mode, setMode] = useState("text");
  const [inputType, setInputType] = useState("text");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [options, setOptions] = useState({ mask: true, block_high_risk: true });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = mode === "file"
        ? await analyzeFile(file, options)
        : await analyzeText({ input_type: inputType, content, options });
      setResult(res);
    } catch (e) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  const canRun = loading ? false : mode === "file" ? !!file : !!content.trim();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        height: 56,
        gap: 12,
      }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--accent)", fontWeight: 700 }}>AI//SECURE</span>
        <span style={{ color: "var(--border)" }}>|</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)" }}>DATA INTELLIGENCE PLATFORM</span>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* LEFT — Input */}
        <div className="fade-up">
          <SECTION label="INPUT MODE">
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["text", "file"].map(m => (
                <button key={m} onClick={() => setMode(m)} style={{
                  padding: "6px 16px",
                  borderRadius: 6,
                  border: `1px solid ${mode === m ? "var(--accent)" : "var(--border)"}`,
                  background: mode === m ? "var(--accent-dim)" : "transparent",
                  color: mode === m ? "var(--accent)" : "var(--text-muted)",
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}>
                  {m.toUpperCase()}
                </button>
              ))}
            </div>

            {mode === "text" && (
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {INPUT_TYPES.map(t => (
                  <button key={t} onClick={() => setInputType(t)} style={{
                    padding: "4px 12px",
                    borderRadius: 4,
                    border: `1px solid ${inputType === t ? "var(--blue)" : "var(--border)"}`,
                    background: inputType === t ? "var(--blue-dim)" : "transparent",
                    color: inputType === t ? "var(--blue)" : "var(--text-muted)",
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </SECTION>

          <SECTION label={mode === "file" ? "UPLOAD FILE" : "CONTENT"}>
            {mode === "file"
              ? <FileUpload onFile={setFile} disabled={loading} />
              : (
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder={`Paste ${inputType} content here...`}
                  rows={10}
                  style={{
                    width: "100%",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "12px 14px",
                    color: "var(--text)",
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    resize: "vertical",
                    outline: "none",
                    lineHeight: 1.7,
                  }}
                />
              )
            }
          </SECTION>

          <SECTION label="OPTIONS">
            <div style={{ display: "flex", gap: 16 }}>
              {[["mask", "Mask Sensitive Data"], ["block_high_risk", "Block High Risk"]].map(([key, label]) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <div
                    onClick={() => setOptions(o => ({ ...o, [key]: !o[key] }))}
                    style={{
                      width: 36, height: 20, borderRadius: 10,
                      background: options[key] ? "var(--accent)" : "var(--border)",
                      position: "relative", transition: "background 0.2s", cursor: "pointer",
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 3, left: options[key] ? 18 : 3,
                      width: 14, height: 14, borderRadius: "50%",
                      background: "white", transition: "left 0.2s",
                    }} />
                  </div>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</span>
                </label>
              ))}
            </div>
          </SECTION>

          <button
            onClick={run}
            disabled={!canRun}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "1px solid var(--accent)",
              background: canRun ? "var(--accent-dim)" : "transparent",
              color: canRun ? "var(--accent)" : "var(--text-muted)",
              fontFamily: "var(--mono)",
              fontSize: 13,
              fontWeight: 700,
              cursor: canRun ? "pointer" : "not-allowed",
              letterSpacing: "0.08em",
              transition: "all 0.2s",
              animation: canRun ? "glow-pulse 2.5s ease infinite" : "none",
            }}
          >
            {loading ? "SCANNING..." : "RUN ANALYSIS"}
          </button>

          {error && (
            <div style={{
              marginTop: 12, padding: "10px 14px",
              background: "var(--red-dim)", border: "1px solid var(--red)",
              borderRadius: 6, color: "var(--red)", fontFamily: "var(--mono)", fontSize: 12,
            }}>
              {error}
            </div>
          )}
        </div>

        {/* RIGHT — Results */}
        <div className="fade-up-1">
          {result ? (
            <>
              <SECTION label="INSIGHTS"><InsightsPanel result={result} /></SECTION>
              {result.content_type === "log" && content && (
                <SECTION label="LOG VIEWER">
                  <LogViewer content={content} findings={result.findings} />
                </SECTION>
              )}
              <SECTION label={`FINDINGS (${result.findings.length})`}>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                  <FindingsTable findings={result.findings} />
                </div>
              </SECTION>
            </>
          ) : (
            <div style={{
              height: "100%", minHeight: 300, display: "flex", alignItems: "center",
              justifyContent: "center", flexDirection: "column", gap: 12,
              color: "var(--text-muted)", fontFamily: "var(--mono)", fontSize: 12,
            }}>
              <div style={{ fontSize: 32, opacity: 0.3 }}>⬡</div>
              <div>AWAITING INPUT</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
