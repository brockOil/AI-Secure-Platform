import { useState, useRef } from "react";

const ACCEPT = ".log,.txt,.pdf,.docx";

export default function FileUpload({ onFile, disabled }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef();

  const handle = (f) => {
    if (!f) return;
    setFile(f);
    onFile(f);
  };

  const clear = (e) => {
    e.stopPropagation();
    setFile(null);
    onFile(null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handle(e.dataTransfer.files[0]);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getIcon = (name) => {
    const ext = name?.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "📕";
    if (ext === "docx" || ext === "doc") return "📘";
    if (ext === "log") return "📋";
    return "📄";
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className="glass-sm"
      style={{
        padding: "36px 24px",
        textAlign: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        borderColor: dragging ? "var(--accent)" : undefined,
        boxShadow: dragging ? "0 0 30px var(--accent-dim), inset 0 0 30px var(--accent-dim)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scan line on drag */}
      {dragging && (
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
          animation: "scan-line 1.5s ease infinite",
          pointerEvents: "none",
        }} />
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        style={{ display: "none" }}
        onChange={(e) => handle(e.target.files[0])}
      />

      {file ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <span style={{ fontSize: 28, animation: "float 3s ease infinite" }}>{getIcon(file.name)}</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{file.name}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>{formatSize(file.size)}</div>
          </div>
          <button
            onClick={clear}
            style={{
              marginLeft: 8,
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "rgba(255,77,106,0.1)",
              color: "var(--red)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              transition: "all 0.2s",
            }}
          >×</button>
        </div>
      ) : (
        <>
          <div style={{
            fontSize: 36,
            marginBottom: 12,
            opacity: dragging ? 1 : 0.4,
            transition: "opacity 0.3s",
            animation: dragging ? "float 1s ease infinite" : "none",
          }}>
            {dragging ? "⬇" : "☁"}
          </div>
          <div style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: dragging ? "var(--accent)" : "var(--text-muted)",
            marginBottom: 6,
            fontWeight: 600,
            letterSpacing: "0.1em",
          }}>
            {dragging ? "DROP TO SCAN" : "DRAG & DROP"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
            .pdf · .docx · .txt · .log — or click to browse
          </div>
        </>
      )}
    </div>
  );
}
