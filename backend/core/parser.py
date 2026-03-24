from fastapi import UploadFile
import aiofiles

SUPPORTED_FILE_TYPES = {".pdf", ".doc", ".txt", ".log"}

async def parse_upload(file: UploadFile) -> tuple[str, str]:
    filename = file.filename or ""
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    content = (await file.read()).decode("utf-8", errors="replace")

    if ext in (".log", ".txt"):
        return content, "log" if ext == ".log" else "file"

    return content, "file"

def parse_text(content: str, input_type: str) -> str:
    return content.strip()
