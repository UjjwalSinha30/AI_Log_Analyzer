from fastapi import APIRouter, HTTPException
from models.schemas import LogRequest, AnalyzeResponse
from services.detector import detect_log_format, extract_patterns
from services.analyzer import run_analysis
from services.history import save_analysis, get_history

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_logs(req: LogRequest):
    if not req.logs.strip():
        raise HTTPException(status_code=400, detail="Logs cannot be empty")

    log_format = req.log_type if req.log_type != "auto" else detect_log_format(req.logs)
    patterns = extract_patterns(req.logs)
    analysis = run_analysis(log_format, patterns, req.logs)

    save_analysis(log_format, patterns, analysis)  # save to DB

    return {"log_format": log_format, "patterns": patterns, "analysis": analysis}

@router.get("/history")
def history():
    return get_history()