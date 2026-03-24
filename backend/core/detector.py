import re
from dataclasses import dataclass
from typing import Optional

@dataclass
class RawFinding:
    type: str
    risk: str
    value: Optional[str]
    line: Optional[int] = None

_PATTERNS = [
    ("password",  "critical", re.compile(r'(?i)password\s*[=:]\s*\S+')),
    ("api_key",   "high",     re.compile(r'(?i)(api[-_]?key|sk-[a-z0-9\-]+)\s*[=:]\s*\S+')),
    ("token",     "high",     re.compile(r'(?i)(token|bearer|auth)\s*[=:]\s*\S+')),
    ("stack_trace","medium",  re.compile(r'(?i)(exception|traceback|stack trace|at \w+\.\w+:\d+)')),
    ("email",     "low",      re.compile(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}')),
    ("phone",     "low",      re.compile(r'\b\+?[\d\s\-().]{9,15}\b')),
]

def detect(content: str, line_number: Optional[int] = None) -> list[RawFinding]:
    findings = []
    for ftype, risk, pattern in _PATTERNS:
        for match in pattern.finditer(content):
            findings.append(RawFinding(
                type=ftype,
                risk=risk,
                value=match.group()[:80],
                line=line_number,
            ))
    return findings
