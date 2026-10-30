from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/aiplatform"
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-3.6-flash"

    class Config:
        env_file = ".env"

settings = Settings()
