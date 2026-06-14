import json
import re
from core.config import groq_client, MODEL, MAX_TOKENS, LOG_CHAR_LIMIT

def build_prompt(log_format: str, patterns: dict, logs: str) -> str:
    logs_for_ai = logs[:LOG_CHAR_LIMIT] + ("\n... [truncated]" if len(logs) > LOG_CHAR_LIMIT else "")

    return f"""You are an expert DevOps/backend engineer analyzing server logs.

Log format detected: {log_format}

Pre-analyzed patterns:
- Total lines: {patterns['total_lines']}
- Errors found: {patterns['error_count']}
- Warnings found: {patterns['warning_count']}
- HTTP error codes: {patterns['status_codes']}
- Recurring error clusters: {patterns['error_clusters']}
- Time range: {patterns['time_range']}

Full logs:

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

def run_analysis(log_format: str, patterns: dict, logs: str) -> dict:
    prompt = build_prompt(log_format, patterns, logs)

    response = groq_client.chat.completions.create(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.choices[0].message.content.strip()
    raw = re.sub(r'^```json\s*', '', raw)
    raw = re.sub(r'^```\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)

    return json.loads(raw)