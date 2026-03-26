import { useState } from "react";
import ParticleBackground from "../components/ParticleBackground";
import ScanningAnimation from "../components/ScanningAnimation";
import FileUpload from "../components/FileUpload";
import FindingsTable from "../components/FindingsTable";
import InsightsPanel from "../components/InsightsPanel";
import LogViewer from "../components/LogViewer";
import { analyzeText, analyzeFile } from "../api/analyze";

const INPUT_TYPES = ["text", "log", "sql", "chat"];

export default function Home() {
  const [mode, setMode] = useState("text");
  const [inputType, setInputType] = useState("text");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [options, setOptions] = useState({ mask: true, block_high_risk: false });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState("");

  const run = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setFileContent("");
    try {
      let res;
      if (mode === "file") {
        // Read file text for LogViewer display
        if (file) {
          const text = await file.text();
          setFileContent(text);
        }
        res = await analyzeFile(file, options);
      } else {
        res = await analyzeText({ input_type: inputType, content, options });
      }
      setResult(res);
    } catch (e) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  const canRun = loading ? false : mode === "file" ? !!file : !!content.trim();

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <ParticleBackground />

      {/* Header */}
      <header className="fade-up" style={{
        position: "relative",
        zIndex: 10,
        borderBottom: "1px solid var(--border)",
        background: "rgba(6, 8, 13, 0.8)",
        backdropFilter: "blur(20px)",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        height: 60,
        gap: 14,
      }}>
        {/* Logo glow */}
        <div style={{ position: "relative" }}>
          <span style={{
            fontFamily: "var(--mono)",
            fontSize: 15,
            fontWeight: 700,
            background: "linear-gradient(135deg, var(--accent), var(--cyan))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.05em",
          }}>AI//SECURE</span>
          <div style={{
            position: "absolute",
            inset: "-4px -8px",
            background: "radial-gradient(ellipse, var(--accent-dim), transparent)",
            borderRadius: 8,
            zIndex: -1,
            filter: "blur(8px)",
          }} />
        </div>
        <div style={{
          width: 1,
          height: 20,
          background: "var(--border)",
        }} />
        <span style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "var(--text-dim)",
          letterSpacing: "0.18em",
        }}>DATA INTELLIGENCE PLATFORM</span>
        <div style={{ flex: 1 }} />
        <div style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--accent)",
          boxShadow: "0 0 8px var(--accent-glow)",
          animation: "badge-pulse 2s ease infinite",
        }} />
        <span style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "var(--text-dim)",
          letterSpacing: "0.1em",
        }}>SYSTEM ONLINE</span>
      </header>

      {/* Main Content */}
      <div className="main-grid" style={{
        position: "relative",
        zIndex: 10,
        height: "calc(100vh - 60px)",
        width: "100%",
        padding: "24px",
        display: "grid",
        gridTemplateColumns: "400px 1fr",
        gap: 24,
      }}>
        {/* LEFT — Input Panel */}
        <div className="fade-up glass" style={{ 
          padding: "28px", 
          display: "flex", 
          flexDirection: "column",
          height: "100%",
          overflowY: "auto"
        }}>

          {/* Input Mode */}
          <div className="section-label">INPUT MODE</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["text", "file"].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`chip ${mode === m ? "active" : ""}`}
              >
                {m === "text" ? "✏️" : "📁"} {m.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Input Type Chips */}
          {mode === "text" && (
            <>
              <div className="section-label">CONTENT TYPE</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
                {INPUT_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setInputType(t)}
                    className={`chip-sub ${inputType === t ? "active" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Content Area */}
          <div className="section-label">{mode === "file" ? "UPLOAD FILE" : "CONTENT"}</div>
          {mode === "file"
            ? <FileUpload onFile={setFile} disabled={loading} />
            : (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={`Paste ${inputType} content here for security analysis...`}
                rows={10}
                className="input-glass"
              />
            )
          }

          {/* Options */}
          <div style={{ margin: "20px 0" }}>
            <div className="section-label">OPTIONS</div>
            <div style={{ display: "flex", gap: 20 }}>
              {[["mask", "Mask Sensitive Data"], ["block_high_risk", "Block High Risk"]].map(([key, label]) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <div
                    onClick={() => setOptions(o => ({ ...o, [key]: !o[key] }))}
                    className={`toggle-track ${options[key] ? "on" : "off"}`}
                  >
                    <div className="toggle-thumb" style={{ left: options[key] ? 20 : 3 }} />
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 400 }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={run}
            disabled={!canRun}
            className="btn-primary"
            style={{ width: "100%" }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span style={{
                  width: 14,
                  height: 14,
                  border: "2px solid var(--accent)",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "radar-sweep 0.8s linear infinite",
                  display: "inline-block",
                }} />
                SCANNING…
              </span>
            ) : "▶ RUN ANALYSIS"}
          </button>

          {/* Error */}
          {error && (
            <div className="error-banner" style={{ marginTop: 14 }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* RIGHT — Results Panel */}
        <div className="fade-up-1 glass" style={{ 
          padding: "28px", 
          display: "flex", 
          flexDirection: "column",
          height: "100%",
          overflowY: "auto"
        }}>
          {result ? (
            <>
              <div className="section-label">INSIGHTS</div>
              <InsightsPanel result={result} />

              {(result.content_type === "log" || result.content_type === "logs") && (content || fileContent) && (
                <div style={{ marginTop: 20 }}>
                  <div className="section-label">LOG VIEWER</div>
                  <LogViewer content={content || fileContent} findings={result.findings} />
                </div>
              )}

              <div style={{ marginTop: 20 }}>
                <div className="section-label">FINDINGS ({result.findings.length})</div>
                <div className="glass-sm" style={{ overflow: "hidden" }}>
                  <FindingsTable findings={result.findings} />
                </div>
              </div>
            </>
          ) : (
            <div style={{
              height: "100%",
              minHeight: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <ScanningAnimation
                size={140}
                label={loading ? "SCANNING CONTENT…" : "AWAITING INPUT"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
