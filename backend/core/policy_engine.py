from core.detector import RawFinding

_MASK = "[REDACTED]"

def apply(content: str, findings: list[RawFinding], mask: bool, block_high_risk: bool) -> tuple[str, str]:
    risk_levels = {f.risk for f in findings}

    if block_high_risk and ("critical" in risk_levels or "high" in risk_levels):
        return content, "blocked"

    if mask and findings:
        sorted_findings = sorted(findings, key=lambda x: x.start)
        merged = []
        for current in sorted_findings:
            if not merged:
                merged.append([current.start, current.end])
            else:
                last = merged[-1]
                if current.start <= last[1]:
                    last[1] = max(last[1], current.end)
                else:
                    merged.append([current.start, current.end])

        result = list(content)
        for m_start, m_end in reversed(merged):
            m_start = max(0, min(m_start, len(result)))
            m_end = max(0, min(m_end, len(result)))
            result[m_start:m_end] = list(_MASK)
            
        return "".join(result), "masked"

    return content, "allowed"
