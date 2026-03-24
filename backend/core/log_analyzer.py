from collections import defaultdict
from core.detector import detect, RawFinding

_FAILURE_PATTERN_KEYWORDS = ("failed", "unauthorized", "403", "401", "login failed", "invalid credentials")
BRUTE_FORCE_THRESHOLD = 5

def analyze_log(content: str) -> tuple[list[RawFinding], list[str]]:
    lines = content.splitlines()
    findings: list[RawFinding] = []
    failure_counts: dict[str, int] = defaultdict(int)
    anomalies: list[str] = []

    for i, line in enumerate(lines, start=1):
        line_findings = detect(line, line_number=i)
        findings.extend(line_findings)

        lowered = line.lower()
        for keyword in _FAILURE_PATTERN_KEYWORDS:
            if keyword in lowered:
                failure_counts[keyword] += 1

    for keyword, count in failure_counts.items():
        if count >= BRUTE_FORCE_THRESHOLD:
            anomalies.append(f"Repeated failure pattern detected: '{keyword}' ({count} occurrences) — possible brute-force")

    seen_types = {f.type for f in findings}
    if "stack_trace" in seen_types:
        anomalies.append("Stack trace detected — internal system details may be exposed")
    if "api_key" in seen_types:
        anomalies.append("API key exposed in logs")
    if "password" in seen_types:
        anomalies.append("Plaintext password found in logs")

    return findings, anomalies
