import re
from collections import Counter

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