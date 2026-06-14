from pydantic import BaseModel
from typing import Optional

class LogRequest(BaseModel):
    logs: str
    log_type: str = "auto"

class RootCause(BaseModel):
    cause: str
    evidence: str
    confidence: str

class ErrorCluster(BaseModel):
    pattern: str
    count: int
    meaning: str

class Anomaly(BaseModel):
    type: str
    description: str

class Fix(BaseModel):
    title: str
    steps: list[str]
    priority: str

class Analysis(BaseModel):
    summary: str
    severity: str
    root_causes: list[RootCause]
    error_clusters: list[ErrorCluster]
    anomalies: list[Anomaly]
    fixes: list[Fix]
    timeline: Optional[str] = None

class Patterns(BaseModel):
    total_lines: int
    error_count: int
    warning_count: int
    status_codes: dict
    error_clusters: dict
    time_range: str
    error_lines_sample: list[str]

class AnalyzeResponse(BaseModel):
    log_format: str
    patterns: Patterns
    analysis: Analysis