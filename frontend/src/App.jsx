// import { useState } from "react";

// const API = "http://localhost:8000";

// const SAMPLE_LOGS = {
//   python: `2024-01-15 10:23:01 ERROR uvicorn.error - Exception in ASGI application
// Traceback (most recent call last):
//   File "/app/main.py", line 45, in get_user
//     result = db.execute(query)
// sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) FATAL: remaining connection slots are reserved
// 2024-01-15 10:23:02 ERROR uvicorn.error - Exception in ASGI application
// sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) FATAL: remaining connection slots are reserved
// 2024-01-15 10:23:03 WARNING uvicorn.access - 500 Internal Server Error /api/users
// 2024-01-15 10:23:04 WARNING uvicorn.access - 500 Internal Server Error /api/orders
// 2024-01-15 10:23:10 ERROR uvicorn.error - Exception in ASGI application
// sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) FATAL: remaining connection slots are reserved`,
//   nginx: `192.168.1.10 - - [15/Jan/2024:10:00:01 +0000] "GET /api/health HTTP/1.1" 200 18
// 192.168.1.22 - - [15/Jan/2024:10:00:45 +0000] "POST /api/upload HTTP/1.1" 413 0
// 192.168.1.33 - - [15/Jan/2024:10:01:02 +0000] "GET /api/users HTTP/1.1" 502 0
// 192.168.1.33 - - [15/Jan/2024:10:01:05 +0000] "GET /api/users HTTP/1.1" 502 0
// 192.168.1.44 - - [15/Jan/2024:10:02:10 +0000] "GET /admin HTTP/1.1" 403 0
// 192.168.1.55 - - [15/Jan/2024:10:02:34 +0000] "GET /api/users HTTP/1.1" 502 0
// 192.168.1.11 - - [15/Jan/2024:10:03:00 +0000] "POST /api/login HTTP/1.1" 429 0
// 192.168.1.11 - - [15/Jan/2024:10:03:01 +0000] "POST /api/login HTTP/1.1" 429 0`,
//   docker: `2024-01-15T10:00:01.123Z container=api-server msg="Server started on port 8000"
// 2024-01-15T10:05:34.456Z container=api-server msg="Database connection established"
// 2024-01-15T10:15:22.789Z container=worker-1 level=error msg="Task failed: timeout after 30s" task_id=abc123
// 2024-01-15T10:15:23.001Z container=worker-1 level=error msg="Task failed: timeout after 30s" task_id=abc124
// 2024-01-15T10:20:00.000Z container=api-server level=warn msg="Memory usage at 87%" mem_mb=870
// 2024-01-15T10:25:10.111Z container=api-server level=error msg="OOM killer invoked" pid=1234
// 2024-01-15T10:25:11.222Z container=api-server msg="Container restarting..."`,
// };

// const severityColor = {
//   critical: "#dc2626",
//   high: "#ea580c",
//   medium: "#ca8a04",
//   low: "#16a34a",
// };

// export default function App() {
//   const [logs, setLogs] = useState("");
//   const [logType, setLogType] = useState("auto");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);

//   async function analyze() {
//     setLoading(true);
//     setError(null);
//     setResult(null);
//     try {
//       const res = await fetch(`${API}/analyze`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ logs, log_type: logType }),
//       });
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.detail || "Analysis failed");
//       }
//       setResult(await res.json());
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem", fontFamily: "monospace" }}>
//       <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🔍 Log Analyzer</h1>
//       <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 13 }}>
//         Paste logs → AI detects errors, clusters, root causes, fixes
//       </p>

//       {/* Controls */}
//       <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
//         <select
//           value={logType}
//           onChange={(e) => setLogType(e.target.value)}
//           style={{ padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13 }}
//         >
//           <option value="auto">Auto-detect format</option>
//           <option value="nginx">Nginx</option>
//           <option value="docker">Docker</option>
//           <option value="python">Python / FastAPI</option>
//         </select>

//         {Object.keys(SAMPLE_LOGS).map((k) => (
//           <button
//             key={k}
//             onClick={() => setLogs(SAMPLE_LOGS[k])}
//             style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 12, cursor: "pointer", background: "#f9fafb" }}
//           >
//             Sample: {k}
//           </button>
//         ))}
//       </div>

//       <textarea
//         value={logs}
//         onChange={(e) => setLogs(e.target.value)}
//         placeholder="Paste your logs here..."
//         style={{
//           width: "100%", height: 220, fontFamily: "monospace", fontSize: 12,
//           border: "1px solid #d1d5db", borderRadius: 8, padding: 12,
//           resize: "vertical", boxSizing: "border-box", background: "#0f172a", color: "#e2e8f0",
//         }}
//       />

//       <button
//         onClick={analyze}
//         disabled={loading || !logs.trim()}
//         style={{
//           marginTop: 10, padding: "10px 24px", background: loading ? "#9ca3af" : "#1d4ed8",
//           color: "white", border: "none", borderRadius: 8, fontSize: 14,
//           cursor: loading ? "not-allowed" : "pointer", fontWeight: 600,
//         }}
//       >
//         {loading ? "Analyzing..." : "Analyze Logs"}
//       </button>

//       {error && (
//         <div style={{ marginTop: 16, padding: 12, background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, color: "#b91c1c", fontSize: 13 }}>
//           ❌ {error}
//         </div>
//       )}

//       {result && <Results result={result} />}
//     </div>
//   );
// }

// function Results({ result }) {
//   const { log_format, patterns, analysis } = result;
//   const sev = analysis.severity;

//   return (
//     <div style={{ marginTop: 24 }}>
//       {/* Header */}
//       <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
//         <span style={{
//           padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
//           background: severityColor[sev] + "20", color: severityColor[sev], border: `1px solid ${severityColor[sev]}`,
//           textTransform: "uppercase"
//         }}>{sev}</span>
//         <span style={{ fontSize: 13, color: "#6b7280" }}>Format: <b>{log_format}</b> · {patterns.total_lines} lines · {patterns.error_count} errors · {patterns.warning_count} warnings</span>
//       </div>

//       {/* Summary */}
//       <Section title="Summary">
//         <p style={{ margin: 0, lineHeight: 1.6, color: "#1f2937" }}>{analysis.summary}</p>
//         {analysis.timeline && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6b7280" }}>⏱ {analysis.timeline}</p>}
//       </Section>

//       {/* Stats row */}
//       {Object.keys(patterns.status_codes).length > 0 && (
//         <Section title="HTTP Status Codes">
//           <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//             {Object.entries(patterns.status_codes).map(([code, count]) => (
//               <span key={code} style={{
//                 padding: "4px 12px", borderRadius: 6, fontSize: 13,
//                 background: code.startsWith("5") ? "#fef2f2" : "#fff7ed",
//                 color: code.startsWith("5") ? "#b91c1c" : "#c2410c",
//                 border: `1px solid ${code.startsWith("5") ? "#fca5a5" : "#fed7aa"}`
//               }}>
//                 {code} × {count}
//               </span>
//             ))}
//           </div>
//         </Section>
//       )}

//       {/* Root Causes */}
//       <Section title="Root Causes">
//         {analysis.root_causes.map((rc, i) => (
//           <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < analysis.root_causes.length - 1 ? "1px solid #f3f4f6" : "none" }}>
//             <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
//               <span style={{ fontSize: 16 }}>{i === 0 ? "🎯" : "•"}</span>
//               <div>
//                 <p style={{ margin: 0, fontWeight: 600, color: "#111827" }}>{rc.cause}</p>
//                 <code style={{ fontSize: 11, color: "#6b7280", display: "block", marginTop: 4, background: "#f9fafb", padding: "4px 8px", borderRadius: 4 }}>
//                   {rc.evidence}
//                 </code>
//                 <span style={{ fontSize: 11, color: rc.confidence === "high" ? "#16a34a" : "#ca8a04" }}>
//                   {rc.confidence} confidence
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </Section>

//       {/* Error Clusters */}
//       {analysis.error_clusters?.length > 0 && (
//         <Section title="Error Clusters">
//           {analysis.error_clusters.map((ec, i) => (
//             <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
//               <span style={{ minWidth: 28, height: 28, background: "#fef2f2", color: "#b91c1c", borderRadius: 6, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 {ec.count}
//               </span>
//               <div>
//                 <code style={{ fontSize: 12, color: "#374151" }}>{ec.pattern}</code>
//                 <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{ec.meaning}</p>
//               </div>
//             </div>
//           ))}
//         </Section>
//       )}

//       {/* Anomalies */}
//       {analysis.anomalies?.length > 0 && (
//         <Section title="Anomalies">
//           {analysis.anomalies.map((a, i) => (
//             <div key={i} style={{ marginBottom: 6, fontSize: 13 }}>
//               <span style={{ fontWeight: 600 }}>⚠ {a.type}:</span> {a.description}
//             </div>
//           ))}
//         </Section>
//       )}

//       {/* Fixes */}
//       <Section title="Fix Suggestions">
//         {analysis.fixes.map((fix, i) => (
//           <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < analysis.fixes.length - 1 ? "1px solid #f3f4f6" : "none" }}>
//             <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
//               <span style={{
//                 fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 600,
//                 background: fix.priority === "immediate" ? "#fef2f2" : fix.priority === "soon" ? "#fff7ed" : "#f0fdf4",
//                 color: fix.priority === "immediate" ? "#b91c1c" : fix.priority === "soon" ? "#c2410c" : "#15803d",
//               }}>
//                 {fix.priority}
//               </span>
//               <b style={{ fontSize: 14 }}>{fix.title}</b>
//             </div>
//             <ol style={{ margin: 0, paddingLeft: 20 }}>
//               {fix.steps.map((step, j) => (
//                 <li key={j} style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>{step}</li>
//               ))}
//             </ol>
//           </div>
//         ))}
//       </Section>
//     </div>
//   );
// }

// function Section({ title, children }) {
//   return (
//     <div style={{ marginBottom: 20, border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
//       <div style={{ padding: "8px 14px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>
//         {title}
//       </div>
//       <div style={{ padding: "14px" }}>{children}</div>
//     </div>
//   );
// }


import { useState } from "react";
import LogInput from "./components/LogInput";
import Results from "./components/Results";
import { analyzeLogs } from "./services/api";

export default function App() {
  const [logs, setLogs] = useState("");
  const [logType, setLogType] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await analyzeLogs(logs, logType));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem", fontFamily: "monospace" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🔍 AI Log Analyzer</h1>
      <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 13 }}>
        Paste logs → AI detects errors, clusters, root causes, fixes
      </p>
      <LogInput logs={logs} setLogs={setLogs} logType={logType} setLogType={setLogType} onAnalyze={handleAnalyze} loading={loading} />
      {error && (
        <div style={{ marginTop: 16, padding: 12, background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, color: "#b91c1c", fontSize: 13 }}>
          ❌ {error}
        </div>
      )}
      {result && <Results result={result} />}
    </div>
  );
}
