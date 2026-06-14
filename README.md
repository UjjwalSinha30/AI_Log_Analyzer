# AI Log Analyzer

Paste logs → AI detects errors, clusters, root causes, fix suggestions.

Supports: FastAPI/Python, Nginx, Docker, generic formats.

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your_key_here
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# opens at http://localhost:5173
```

## What it does

1. **Auto-detects** log format (nginx, docker, python, fastapi)
2. **Pre-analyzes** patterns: error counts, HTTP status codes, recurring error clusters
3. **Sends to Claude** with structured context for deep analysis
4. **Returns:**
   - Severity level (critical / high / medium / low)
   - Root causes with evidence from actual log lines
   - Error clusters (same error repeating = one cluster, not noise)
   - Anomalies detected
   - Fix suggestions with priority (immediate / soon / optional)

## API

`POST /analyze`
```json
{
  "logs": "...your log text...",
  "log_type": "auto"  // or: nginx, docker, python, fastapi
}
```

Response:
```json
{
  "log_format": "nginx",
  "patterns": { "total_lines": 100, "error_count": 12, ... },
  "analysis": {
    "summary": "...",
    "severity": "high",
    "root_causes": [...],
    "error_clusters": [...],
    "anomalies": [...],
    "fixes": [...]
  }
}
```

## Resume Bullet
"Built AI-powered log analyzer using FastAPI + Claude API that ingests server logs, detects error patterns and anomalies using LLM analysis, and returns root cause analysis with prioritized fix suggestions — supports Docker, FastAPI, Nginx, and Python log formats"
