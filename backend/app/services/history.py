import json
from core.config import get_db

def save_analysis(log_format: str, patterns: dict, analysis: dict):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO analyses (log_format, severity, summary, total_lines, error_count, warning_count, time_range, full_analysis)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        log_format,
        analysis["severity"],
        analysis["summary"],
        patterns["total_lines"],
        patterns["error_count"],
        patterns["warning_count"],
        patterns["time_range"],
        json.dumps(analysis),
    ))
    conn.commit()
    cursor.close()
    conn.close()

def get_history(limit: int = 20):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, log_format, severity, summary, total_lines, error_count, created_at FROM analyses ORDER BY created_at DESC LIMIT %s", (limit,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows