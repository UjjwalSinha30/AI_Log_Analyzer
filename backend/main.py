from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import re
from collections import Counter
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic()

class LogRequest(BaseModel):
    logs: str
    log_type: str = "auto"  # auto, nginx, docker, python, fastapi

def detect_log_format(logs: str) -> str:
    if re.search(r'\d+\.\d+\.\d+\.\d+ - - \[', logs):
        return "nginx"
    if re.search(r'(ERROR|WARNING|INFO|DEBUG)\s+\w+\s+\[', logs) or "uvicorn" in logs.lower():
        return "fastapi/python"
    if re.search(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}', logs) and "container" in logs.lower():
        return "docker"
    if re.search(r'(Traceback|Exception|Error):', logs):
        return "python"
    return "generic"

def extract_patterns(logs: str) -> dict:
    lines = logs.strip().split("\n")
    error_lines = [l for l in lines if re.search(r'(error|exception|traceback|fatal|critical)', l, re.I)]
    warning_lines = [l for l in lines if re.search(r'(warn|warning)', l, re.I)]
    
    status_codes = re.findall(r'\b(4\d{2}|5\d{2})\b', logs)
    status_counts = Counter(status_codes)
    
    timestamps = re.findall(r'\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}', logs)
    
    error_msgs = re.findall(r'(?:Error|Exception):\s*(.+)', logs)
    error_cluster = Counter(error_msgs)
    
    return {
        "total_lines": len(lines),
        "error_count": len(error_lines),
        "warning_count": len(warning_lines),
        "status_codes": dict(status_counts),
        "error_clusters": dict(error_cluster.most_common(5)),
        "time_range": f"{timestamps[0]} → {timestamps[-1]}" if len(timestamps) >= 2 else (timestamps[0] if timestamps else "N/A"),
        "error_lines_sample": error_lines[:10],
    }

@app.post("/analyze")
async def analyze_logs(req: LogRequest):
    if not req.logs.strip():
        raise HTTPException(status_code=400, detail="Logs cannot be empty")
    
    log_format = req.log_type if req.log_type != "auto" else detect_log_format(req.logs)
    patterns = extract_patterns(req.logs)
    
    # Truncate logs if too large (keep first 8000 chars to stay within token limits)
    logs_for_ai = req.logs[:8000] + ("\n... [truncated]" if len(req.logs) > 8000 else "")
    
    prompt = f"""You are an expert DevOps/backend engineer analyzing server logs. 

Log format detected: {log_format}

Pre-analyzed patterns:
- Total lines: {patterns['total_lines']}
- Errors found: {patterns['error_count']}
- Warnings found: {patterns['warning_count']}
- HTTP error codes: {patterns['status_codes']}
- Recurring error clusters: {patterns['error_clusters']}
- Time range: {patterns['time_range']}

Full logs:
```
{logs_for_ai}
```

Analyze these logs and respond in this EXACT JSON structure (no markdown, just raw JSON):
{{
  "summary": "2-3 sentence plain English summary of what's happening",
  "severity": "critical|high|medium|low",
  "root_causes": [
    {{"cause": "...", "evidence": "exact log line or pattern that proves this", "confidence": "high|medium|low"}}
  ],
  "error_clusters": [
    {{"pattern": "...", "count": 0, "meaning": "what this pattern means"}}
  ],
  "anomalies": [
    {{"type": "...", "description": "..."}}
  ],
  "fixes": [
    {{"title": "...", "steps": ["step1", "step2"], "priority": "immediate|soon|optional"}}
  ],
  "timeline": "Brief description of when/how errors progressed (if timestamps present)"
}}"""

    message = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    import json
    raw = message.content[0].text.strip()
    # strip ```json fences if present
    raw = re.sub(r'^```json\s*', '', raw)
    raw = re.sub(r'^```\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)
    
    analysis = json.loads(raw)
    
    return {
        "log_format": log_format,
        "patterns": patterns,
        "analysis": analysis
    }

@app.get("/health")
def health():
    return {"status": "ok"}
