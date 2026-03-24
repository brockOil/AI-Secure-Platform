from core.detector import detect
from core.risk_engine import score
from core.policy_engine import apply
from core.log_analyzer import analyze_log

def test_detector_api_key():
    content = "Here is my key: api_key=AKIAIOSFODNN7EXAMPLE and secret_key=some_long_secret_key_here"
    findings = detect(content)
    assert len(findings) == 3, findings
    types = [f.type for f in findings]
    assert "aws_key" in types
    assert "api_key" in types

def test_detector_entropy():
    content = "Here is something v1.e2XyZ_4Bd-L9qR1AbCdEfGhIjKlMnOpQrStUvWxYz"
    findings = detect(content)
    types = [f.type for f in findings]
    assert "high_entropy_string" in types

def test_risk_proximity():
    content = "email=admin@test.com password=supersecret"
    findings = detect(content)
    total, level = score(findings)
    assert level == "critical" # proximity of email and password escalates risk

def test_policy_masking():
    content = "My credentials are password: supersecret and don't tell anyone."
    findings = detect(content)
    res, action = apply(content, findings, mask=True, block_high_risk=False)
    assert res == "My credentials are password: [REDACTED] and don't tell anyone."
    assert action == "masked"

def test_log_sqli():
    content = "User attempted login\nselect * from users where 1=1"
    findings, anomalies = analyze_log(content)
    assert any("SQL Injection" in a for a in anomalies)
