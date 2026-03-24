import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from db.session import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    input_type: Mapped[str] = mapped_column(String)
    risk_level: Mapped[str] = mapped_column(String)
    risk_score: Mapped[int] = mapped_column(Integer)
    findings: Mapped[list] = mapped_column(JSON)
    insights: Mapped[list] = mapped_column(JSON)
    action: Mapped[str] = mapped_column(String)
