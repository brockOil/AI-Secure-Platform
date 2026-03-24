import { useState, useRef } from "react";

const ACCEPT = ".log,.txt,.pdf,.doc";

export default function FileUpload({ onFile, disabled }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef();

  const handle = (f) => {
    if (!f) return;
    setFile(f);
    onFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handle(e.dataTransfer.files[0]);
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      style={{
        border: `1.5px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
        background: dragging ? "var(--accent-dim)" : "var(--surface)",
        boxShadow: dragging ? "0 0 20px var(--accent-glow)" : "none",
        borderRadius: 8,
        padding: "32px 24px",
        textAlign: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        style={{ display: "none" }}
        onChange={(e) => handle(e.target.files[0])}
      />
      <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent)", marginBottom: 8 }}>
        {dragging ? "DROP TO SCAN" : "DRAG & DROP"}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
        {file ? (
          <span style={{ color: "var(--text)" }}>📄 {file.name}</span>
        ) : (
          <span>.log · .txt · .pdf · .doc — or click to browse</span>
        )}
      </div>
    </div>
  );
}
