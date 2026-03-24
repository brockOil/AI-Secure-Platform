import re
import math
from dataclasses import dataclass
from typing import Optional
from bisect import bisect_right

@dataclass
class RawFinding:
    type: str
    risk: str
    value: Optional[str]
    start: int
    end: int
    line: Optional[int] = None

_PATTERNS = [
    ("password",    "critical", re.compile(r'(?i)(?:password|passwd|pwd)\s*[=:]\s*([^\s]{5,100})')),
    ("api_key",     "high",     re.compile(r'(?i)(?:api[-_]?key|secret[-_]?key)\s*[=:]\s*([a-zA-Z0-9_\-\.]{10,})')),
    ("aws_key",     "critical", re.compile(r'(?i)(AKIA[0-9A-Z]{16})')),
    ("jwt_token",   "high",     re.compile(r'(?i)(eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)')),
    ("stripe_key",  "high",     re.compile(r'(?i)((?:sk_live|pk_live)_[0-9a-zA-Z]{24})')),
    ("rsa_private", "critical", re.compile(r'(-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----)')),
    ("token",       "high",     re.compile(r'(?i)(?:token|bearer|auth)\s*[=:]\s*([^\s]{10,})')),
    ("credit_card", "high",     re.compile(r'\b(4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b')),
    ("ssn",         "high",     re.compile(r'\b((?!000|666|9\d{2})[0-9]{3}-(?!00)[0-9]{2}-(?!0000)[0-9]{4})\b')),
    ("email",       "low",      re.compile(r'\b([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})\b')),
    ("phone",       "low",      re.compile(r'((?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})')),
    ("stack_trace", "medium",   re.compile(r'(?i)(exception|traceback|stack trace|at \w+\.\w+:\d+)')),
    ("ip_address",  "low",      re.compile(r'\b((?:[0-9]{1,3}\.){3}[0-9]{1,3})\b')),
]

def _shannon_entropy(data: str) -> float:
    if not data:
        return 0.0
    entropy = 0.0
    for char in set(data):
        p = data.count(char) / len(data)
        entropy -= p * math.log2(p)
    return entropy

def detect(content: str, line_number: Optional[int] = None) -> list[RawFinding]:
    findings = []
    
    line_starts = [0] + [m.start() + 1 for m in re.finditer(r'\n', content)]
    def get_line(idx: int) -> int:
        return bisect_right(line_starts, idx)

    for ftype, risk, pattern in _PATTERNS:
        for match in pattern.finditer(content):
            val = match.group(1) if match.lastindex else match.group()
            if match.lastindex:
                start, end = match.span(1)
            else:
                start, end = match.span()
                
            line_num = line_number if line_number is not None else get_line(start)
                
            findings.append(RawFinding(
                type=ftype,
                risk=risk,
                value=val[:80],
                start=start,
                end=end,
                line=line_num,
            ))
            
    for match in re.finditer(r'\b[a-zA-Z0-9+/=_-]{20,100}\b', content):
        val = match.group()
        # skip if already found by regex
        if any(f.start <= match.start() and f.end >= match.end() for f in findings):
            continue
            
        if _shannon_entropy(val) > 4.5:
            line_num = line_number if line_number is not None else get_line(match.start())
            findings.append(RawFinding(
                type="high_entropy_string",
                risk="medium",
                value=val[:80],
                start=match.start(),
                end=match.end(),
                line=line_num,
            ))
            
    return findings
