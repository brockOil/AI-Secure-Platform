import json
from mistralai.client import Mistral
from config import settings

_client = Mistral(api_key=settings.MISTRAL_API_KEY)

def get_insights(findings: list[dict], content_snippet: str, anomalies: list[str], input_type: str = "text") -> tuple[str, list[str]]:
    findings_text = "\n".join(
        f"- {f['type']} ({f['risk']} risk)" + (f" at line {f['line']}" if f.get("line") else "")
        for f in findings
    ) or "None"

    anomalies_text = "\n".join(f"- {a}" for a in anomalies) or "None"

    log_instruction = (
        "This is a Log File. Focus your summary on log activity, identify detected anomalies, and list potential security risks."
        if input_type == "log" else ""
    )

    prompt = f"""You are a security analyst. Analyze the following detection results from a {input_type} scan.
{log_instruction}

Findings:
{findings_text}

Pre-detected anomalies:
{anomalies_text}

Content snippet (first 500 chars):
{content_snippet[:500]}

Respond exactly in this format:
SUMMARY: <one sentence describing overall security posture>
INSIGHTS: <valid JSON array of up to 5 concise insight strings>"""

    response = _client.chat.complete(
        model="mistral-large-latest",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=512,
    )

    raw = response.choices[0].message.content.strip()
    summary = ""
    insights: list[str] = []

    for line in raw.splitlines():
        if line.startswith("SUMMARY:"):
            summary = line.replace("SUMMARY:", "").strip()
        elif line.startswith("INSIGHTS:"):
            try:
                insights = json.loads(line.replace("INSIGHTS:", "").strip())
            except json.JSONDecodeError:
                insights = [line.replace("INSIGHTS:", "").strip()]

    return summary or "Analysis complete.", insights
