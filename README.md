# AI Secure Data Intelligence Platform
## 🚀 Live Demo

- **Live Website:** https://ai-secure-platform-sam.vercel.app
- **API Documentation:** https://ai-secure-platform-0d1w.onrender.com/docs

  
A robust, full-stack application for analyzing, classifying, and securing sensitive data using advanced AI models. It provides deep insights into structured and unstructured data while ensuring privacy and compliance through intelligent masking and risk assessment.

## 🚀 Features

- **AI-Powered Data Analysis:** Utilizes Google Gemini to scan logs, texts, and files for security vulnerabilities and anomalies.
- **Sensitive Data Masking:** Automatically detects and redacts PII and sensitive information before processing or storage.
- **Modern UI/UX:** A responsive, interactive dashboard built with React and Tailwind CSS featuring glassmorphism design.
- **Robust Backend:** High-performance REST API powered by FastAPI and PostgreSQL.
- **Containerized Deployment:** Ready to deploy via Docker Compose.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Axios for API communication

**Backend:**
- Python 3.12
- FastAPI & Uvicorn
- PostgreSQL (asyncpg)
- SQLAlchemy (asyncio)
- Google Gemini (google-genai) Python Client

**Deployment:**
- Docker & Docker Compose (local / self-hosted)
- Vercel Services (frontend + backend as a single project)
- Supabase (managed Postgres for the Vercel deployment)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) (v18+ recommended) for local frontend development
- [Python 3.10+](https://www.python.org/) for local backend development

## 🔧 Setup & Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd AI-Secure-Platform
```

### 2. Configure Environment Variables

Create `.env` files based on the provided examples.

**Root level (`/.env`):**
```ini
GEMINI_API_KEY=your_gemini_api_key_here
POSTGRES_USER=aiplatform
POSTGRES_PASSWORD=aiplatform
POSTGRES_DB=aiplatform
```

**Backend level (`/backend/.env`):**
```ini
DATABASE_URL=postgresql+asyncpg://aiplatform:aiplatform@localhost:5434/aiplatform
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🏃‍♂️ Running the Application

### Option A: Using Docker Compose (Recommended)

The easiest way to run the entire stack (Database, Backend, Frontend) is using Docker Compose.

1. Build and start the containers:
   ```bash
   docker compose up -d --build
   ```

2. Access the application:
   - **Frontend:** `http://localhost:3002`
   - **Backend API Docs:** `http://localhost:8001/docs`

3. To stop the containers:
   ```bash
   docker compose down
   ```

### Option B: Local Development Setup

If you need to run the services individually for development:

**1. Start the Database:**
```bash
docker compose up -d db
```

**2. Start the Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**3. Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*The frontend will be available at `http://localhost:5173`.*

---

## ☁️ Deploying to Vercel

This repo deploys as a single Vercel project using [Vercel Services](https://vercel.com/docs/services): `frontend` (Vite static build) and `backend` (FastAPI) are declared in the root `vercel.json`, with `backend` exposed publicly only at `/api/*` and `frontend` serving everything else. No per-service dashboard configuration is needed — both services build from the same project.

1. **Database:** local Docker Postgres isn't reachable from Vercel's serverless functions. Use a managed Postgres instead — this project is set up for [Supabase](https://supabase.com/). In the Supabase dashboard, grab the **Transaction pooler** connection string (Settings → Database → Connect → Connection string → Transaction pooler, port `6543`), then adapt it:
   - scheme `postgresql://` → `postgresql+asyncpg://` (SQLAlchemy needs the async driver explicit, otherwise it defaults to `psycopg`, which isn't installed)
   - append `?ssl=require` (Supabase enforces SSL; `asyncpg` needs this spelled `ssl=require`, not the libpq-style `sslmode=require`)
   - if the password contains special characters (`%`, `@`, `:`, `/`, etc.), percent-encode them (e.g. a literal `%` becomes `%25`) — or avoid the hassle entirely by resetting the DB password to an alphanumeric-only string

   Final shape:
   ```
   postgresql+asyncpg://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?ssl=require
   ```
   Run the schema once in Supabase's SQL Editor:
   ```sql
   create table if not exists public.analyses (
     id text primary key,
     created_at timestamptz not null default now(),
     input_type text not null,
     risk_level text not null,
     risk_score integer not null,
     findings jsonb not null,
     insights jsonb not null,
     action text not null
   );
   ```

2. **Environment variables:** set these in Vercel → Settings → Environment Variables:
   - `DATABASE_URL` — the Supabase string above
   - `GEMINI_API_KEY` — same value as local `.env`

3. **Deploy** via the Git integration (push → auto-deploy) or `npx vercel --prod` from the repo root. Keep Root Directory at `./` in project settings — the `services` config in `vercel.json` expects to see the whole repo, not just `frontend/`.

## 📁 Project Structure

```
AI-Secure-Platform/
├── backend/                # FastAPI application
│   ├── api/                # API routes and endpoints
│   ├── core/               # AI integration and logic
│   ├── db/                 # Database configuration and models
│   ├── schemas/            # Pydantic validation schemas
│   ├── main.py             # Application entry point
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Docker config
├── frontend/               # React application
│   ├── src/                # React components, pages, and API calls
│   ├── public/             # Static assets
│   ├── package.json        # Node.js dependencies
│   ├── tailwind.config.js  # Styling configuration
│   └── Dockerfile          # Frontend Docker config
├── docker-compose.yml      # Multi-container orchestration
└── vercel.json             # Vercel Services config (frontend + backend)
```

## 🔒 Security & Privacy

This platform prioritizes data security. All uploaded files and text strings are scanned locally for high-risk data (like API keys, passwords, and PII) utilizing predefined patterns and entropy checks before any data is sent to external LLMs.
