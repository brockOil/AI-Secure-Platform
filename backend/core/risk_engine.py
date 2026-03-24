from core.detector import RawFinding

_SCORE_MAP = {
    "critical": 10,
    "high": 7,
    "medium": 4,
    "low": 1,
}

_LEVEL_THRESHOLDS = [
    (15, "critical"),
    (10, "high"),
    (5,  "medium"),
    (0,  "low"),
]

def score(findings: list[RawFinding]) -> tuple[int, str]:
    total = sum(_SCORE_MAP.get(f.risk, 0) for f in findings)
    total = min(total, 20)
    for threshold, level in _LEVEL_THRESHOLDS:
        if total >= threshold:
            return total, level
    return total, "low"
