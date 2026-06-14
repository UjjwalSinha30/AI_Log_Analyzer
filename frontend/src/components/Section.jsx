export default function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20, border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
      <div style={{
        padding: "8px 14px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb",
        fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em"
      }}>
        {title}
      </div>
      <div style={{ padding: "14px" }}>{children}</div>
    </div>
  );
}