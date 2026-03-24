import re
from core.detector import RawFinding

_MASK = "[REDACTED]"

_MASK_PATTERNS = [
    re.compile(r'(?i)(password\s*[=:]\s*)\S+'),
    re.compile(r'(?i)(api[-_]?key\s*[=:]\s*|sk-[a-z0-9\-]+\s*[=:]\s*)\S+'),
    re.compile(r'(?i)(token\s*[=:]\s*|bearer\s+)\S+'),
    re.compile(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}'),
]

def apply(content: str, findings: list[RawFinding], mask: bool, block_high_risk: bool) -> tuple[str, str]:
    risk_levels = {f.risk for f in findings}

    if block_high_risk and ("critical" in risk_levels or "high" in risk_levels):
        return content, "blocked"

    if mask:
        for pattern in _MASK_PATTERNS:
            content = pattern.sub(lambda m: m.group(1) + _MASK if m.lastindex else _MASK, content)
        return content, "masked"

    return content, "allowed"
