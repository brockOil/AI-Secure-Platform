from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from db.models import Analysis
from schemas.analyze import AnalyzeRequest, AnalyzeResponse, AnalyzeOptions, Finding
from core.detector import detect
from core.log_analyzer import analyze_log
from core.risk_engine import score
from core.policy_engine import apply
from core.ai_insights import get_insights
from core.parser import parse_upload

import json

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest, db: AsyncSession = Depends(get_db)):
    return await _process(
        content=request.content,
        input_type=request.input_type,
        options=request.options,
        db=db,
    )

@router.post("/analyze/upload", response_model=AnalyzeResponse)
async def analyze_upload(
    file: UploadFile = File(...),
    mask: bool = Form(True),
    block_high_risk: bool = Form(True),
    db: AsyncSession = Depends(get_db),
):
    content, input_type = await parse_upload(file)
    options = AnalyzeOptions(mask=mask, block_high_risk=block_high_risk)
    return await _process(content=content, input_type=input_type, options=options, db=db)

async def _process(content: str, input_type: str, options: AnalyzeOptions, db: AsyncSession) -> AnalyzeResponse:
    anomalies: list[str] = []

    if input_type == "log" and options.log_analysis:
        raw_findings, anomalies = analyze_log(content)
    else:
        raw_findings = detect(content)

    risk_score, risk_level = score(raw_findings)

    _, action = apply(content, raw_findings, mask=options.mask, block_high_risk=options.block_high_risk)

    if action == "blocked":
        raise HTTPException(status_code=403, detail="Content blocked: high/critical risk detected")

    findings_dicts = [
        {"type": f.type, "risk": f.risk, "value": f.value, "line": f.line}
        for f in raw_findings
    ]

    summary, insights = get_insights(findings_dicts, content, anomalies)

    record = Analysis(
        input_type=input_type,
        risk_level=risk_level,
        risk_score=risk_score,
        findings=findings_dicts,
        insights=insights,
        action=action,
    )
    db.add(record)
    await db.commit()

    return AnalyzeResponse(
        summary=summary,
        content_type=input_type,
        findings=[Finding(**f) for f in findings_dicts],
        risk_score=risk_score,
        risk_level=risk_level,
        action=action,
        insights=insights + anomalies,
    )
