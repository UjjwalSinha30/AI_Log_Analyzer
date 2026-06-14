import Section from "./Section";
import { SEVERITY_COLOR } from "../utils/sampleLogs";

export default function Results({ result }) {
  const { log_format, patterns, analysis } = result;
  const sev = analysis.severity;

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span style={{
          padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
          background: SEVERITY_COLOR[sev] + "20", color: SEVERITY_COLOR[sev],
          border: `1px solid ${SEVERITY_COLOR[sev]}`, textTransform: "uppercase"
        }}>{sev}</span>
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          Format: <b>{log_format}</b> · {patterns.total_lines} lines · {patterns.error_count} errors · {patterns.warning_count} warnings
        </span>
      </div>

      <Section title="Summary">
        <p style={{ margin: 0, lineHeight: 1.6, color: "#1f2937" }}>{analysis.summary}</p>
        {analysis.timeline && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6b7280" }}>⏱ {analysis.timeline}</p>}
      </Section>

      {Object.keys(patterns.status_codes).length > 0 && (
        <Section title="HTTP Status Codes">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(patterns.status_codes).map(([code, count]) => (
              <span key={code} style={{
                padding: "4px 12px", borderRadius: 6, fontSize: 13,
                background: code.startsWith("5") ? "#fef2f2" : "#fff7ed",
                color: code.startsWith("5") ? "#b91c1c" : "#c2410c",
                border: `1px solid ${code.startsWith("5") ? "#fca5a5" : "#fed7aa"}`
              }}>{code} × {count}</span>
            ))}
          </div>
        </Section>
      )}

      <Section title="Root Causes">
        {analysis.root_causes.map((rc, i) => (
          <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < analysis.root_causes.length - 1 ? "1px solid #f3f4f6" : "none" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span>{i === 0 ? "🎯" : "•"}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: "#111827" }}>{rc.cause}</p>
                <code style={{ fontSize: 11, color: "#6b7280", display: "block", marginTop: 4, background: "#f9fafb", padding: "4px 8px", borderRadius: 4 }}>
                  {rc.evidence}
                </code>
                <span style={{ fontSize: 11, color: rc.confidence === "high" ? "#16a34a" : "#ca8a04" }}>
                  {rc.confidence} confidence
                </span>
              </div>
            </div>
          </div>
        ))}
      </Section>

      {analysis.error_clusters?.length > 0 && (
        <Section title="Error Clusters">
          {analysis.error_clusters.map((ec, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ minWidth: 28, height: 28, background: "#fef2f2", color: "#b91c1c", borderRadius: 6, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {ec.count}
              </span>
              <div>
                <code style={{ fontSize: 12, color: "#374151" }}>{ec.pattern}</code>
                <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{ec.meaning}</p>
              </div>
            </div>
          ))}
        </Section>
      )}

      {analysis.anomalies?.length > 0 && (
        <Section title="Anomalies">
          {analysis.anomalies.map((a, i) => (
            <div key={i} style={{ marginBottom: 6, fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>⚠ {a.type}:</span> {a.description}
            </div>
          ))}
        </Section>
      )}

      <Section title="Fix Suggestions">
        {analysis.fixes.map((fix, i) => (
          <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < analysis.fixes.length - 1 ? "1px solid #f3f4f6" : "none" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <span style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 600,
                background: fix.priority === "immediate" ? "#fef2f2" : fix.priority === "soon" ? "#fff7ed" : "#f0fdf4",
                color: fix.priority === "immediate" ? "#b91c1c" : fix.priority === "soon" ? "#c2410c" : "#15803d",
              }}>{fix.priority}</span>
              <b style={{ fontSize: 14 }}>{fix.title}</b>
            </div>
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              {fix.steps.map((step, j) => (
                <li key={j} style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </Section>
    </div>
  );
}