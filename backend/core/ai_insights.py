import json
import logging
from google import genai
from google.genai import types
from google.genai.errors import APIError
from config import settings

logger = logging.getLogger(__name__)
_client = genai.Client(api_key=settings.GEMINI_API_KEY)

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

    try:
        response = _client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(max_output_tokens=1024),
        )
    except APIError:
        logger.exception("Gemini insights call failed; returning findings without AI summary")
        return "Analysis complete (AI insights unavailable).", []

    raw = (response.text or "").strip()
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
