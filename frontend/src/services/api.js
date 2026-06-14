const API = "http://localhost:8000/api";

export async function analyzeLogs(logs, logType = "auto") {
  const res = await fetch(`${API}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ logs, log_type: logType }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Analysis failed");
  }

  return res.json();
}