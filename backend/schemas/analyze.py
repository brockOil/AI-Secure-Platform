from pydantic import BaseModel
from typing import Literal, Optional

class AnalyzeOptions(BaseModel):
    mask: bool = True
    block_high_risk: bool = True
    log_analysis: bool = True

class AnalyzeRequest(BaseModel):
    input_type: Literal["text", "file", "sql", "chat", "log"]
    content: str
    options: AnalyzeOptions = AnalyzeOptions()

class Finding(BaseModel):
    type: str
    risk: Literal["low", "medium", "high", "critical"]
    value: Optional[str] = None
    line: Optional[int] = None

class AnalyzeResponse(BaseModel):
    summary: str
    content_type: str
    findings: list[Finding]
    risk_score: int
    risk_level: Literal["low", "medium", "high", "critical"]
    action: str
    insights: list[str]
