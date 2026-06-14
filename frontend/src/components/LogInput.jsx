import { SAMPLE_LOGS } from "../utils/sampleLogs";

export default function LogInput({ logs, setLogs, logType, setLogType, onAnalyze, loading }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <select
          value={logType}
          onChange={(e) => setLogType(e.target.value)}
          style={{ padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13 }}
        >
          <option value="auto">Auto-detect format</option>
          <option value="nginx">Nginx</option>
          <option value="docker">Docker</option>
          <option value="python">Python / FastAPI</option>
        </select>

        {Object.keys(SAMPLE_LOGS).map((k) => (
          <button
            key={k}
            onClick={() => setLogs(SAMPLE_LOGS[k])}
            style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 12, cursor: "pointer", background: "#f9fafb" }}
          >
            Sample: {k}
          </button>
        ))}
      </div>

      <textarea
        value={logs}
        onChange={(e) => setLogs(e.target.value)}
        placeholder="Paste your logs here..."
        style={{
          width: "100%", height: 220, fontFamily: "monospace", fontSize: 12,
          border: "1px solid #d1d5db", borderRadius: 8, padding: 12,
          resize: "vertical", boxSizing: "border-box", background: "#0f172a", color: "#e2e8f0",
        }}
      />

      <button
        onClick={onAnalyze}
        disabled={loading || !logs.trim()}
        style={{
          marginTop: 10, padding: "10px 24px",
          background: loading ? "#9ca3af" : "#1d4ed8",
          color: "white", border: "none", borderRadius: 8, fontSize: 14,
          cursor: loading ? "not-allowed" : "pointer", fontWeight: 600,
        }}
      >
        {loading ? "Analyzing..." : "Analyze Logs"}
      </button>
    </div>
  );
}