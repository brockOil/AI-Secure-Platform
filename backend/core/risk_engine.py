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
    if not findings:
        return 0, "low"

    base_score = sum(_SCORE_MAP.get(f.risk, 0) for f in findings)
    
    multiplier = 1.0
    if len(findings) > 10:
        multiplier = 2.0
    elif len(findings) > 5:
        multiplier = 1.5
        
    total = int(base_score * multiplier)
    
    has_identity = any(f.type in ("email", "username") for f in findings)
    has_secret = any(f.type in ("password", "api_key", "aws_key", "jwt_token", "token") for f in findings)
    
    override_level = None
    if has_identity and has_secret:
        identities = [f for f in findings if f.type in ("email", "username")]
        secrets = [f for f in findings if f.type in ("password", "api_key", "aws_key", "jwt_token", "token")]
        
        for i in identities:
            for s in secrets:
                if (i.line and i.line == s.line) or abs(i.start - s.start) < 100:
                    override_level = "critical"
                    total = max(total, 20)
                    break
            if override_level:
                break

    total = min(total, 20)
    
    if override_level:
        return total, override_level

    for threshold, level in _LEVEL_THRESHOLDS:
        if total >= threshold:
            return total, level
            
    return total, "low"
