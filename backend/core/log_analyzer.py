import re
from collections import defaultdict
from core.detector import detect, RawFinding

_FAILURE_PATTERN_KEYWORDS = ("failed", "unauthorized", "403", "401", "login failed", "invalid credentials")
BRUTE_FORCE_THRESHOLD = 5

_INJECTION_PATTERNS = [
    ("SQL Injection", re.compile(r'(?i)(?:union\s+all\s+select|select\s+.*\s+from|insert\s+into\s+.*\s+values|drop\s+table|\b1\s*=\s*1\b)')),
    ("Cross-Site Scripting (XSS)", re.compile(r'(?i)(?:<script>|javascript:|onerror\s*=)')),
    ("Directory Traversal", re.compile(r'(?:\.\./\.\./|\.\.\\\.\.\\|%2e%2e%2f)')),
]

def analyze_log(content: str) -> tuple[list[RawFinding], list[str]]:
    findings = detect(content)
    
    failure_counts: dict[str, int] = defaultdict(int)
    anomalies: list[str] = []

    lines = content.splitlines()
    for i, line in enumerate(lines, start=1):
        lowered = line.lower()
        for keyword in _FAILURE_PATTERN_KEYWORDS:
            if keyword in lowered:
                failure_counts[keyword] += 1
                
        for inj_name, inj_pattern in _INJECTION_PATTERNS:
            if inj_pattern.search(line):
                anomalies.append(f"{inj_name} attempt detected at line {i}")

    for keyword, count in failure_counts.items():
        if count >= BRUTE_FORCE_THRESHOLD:
            anomalies.append(f"Repeated failure pattern detected: '{keyword}' ({count} occurrences) — possible brute-force")

    seen_types = {f.type for f in findings}
    if "stack_trace" in seen_types:
        anomalies.append("Stack trace detected — internal system details may be exposed")
    if any(k in seen_types for k in ("api_key", "aws_key", "stripe_key", "jwt_token")):
        anomalies.append("API keys/Tokens exposed in logs")
    if "password" in seen_types:
        anomalies.append("Plaintext password found in logs")

    return findings, anomalies
