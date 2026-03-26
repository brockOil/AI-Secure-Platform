# AI Secure Data Intelligence Platform

A robust, full-stack application for analyzing, classifying, and securing sensitive data using advanced AI models. It provides deep insights into structured and unstructured data while ensuring privacy and compliance through intelligent masking and risk assessment.

## 🚀 Features

- **AI-Powered Data Analysis:** Utilizes Mistral AI to scan logs, texts, and files for security vulnerabilities and anomalies.
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
- Mistral AI Python Client

**Deployment:**
- Docker & Docker Compose
- Nginx (Frontend proxy)

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
MISTRAL_API_KEY=your_mistral_api_key_here
POSTGRES_USER=aiplatform
POSTGRES_PASSWORD=aiplatform
POSTGRES_DB=aiplatform
```

**Backend level (`/backend/.env`):**
```ini
DATABASE_URL=postgresql+asyncpg://aiplatform:aiplatform@localhost:5434/aiplatform
MISTRAL_API_KEY=your_mistral_api_key_here
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
└── docker-compose.yml      # Multi-container orchestration
```

## 🔒 Security & Privacy

This platform prioritizes data security. All uploaded files and text strings are scanned locally for high-risk data (like API keys, passwords, and PII) utilizing predefined patterns and entropy checks before any data is sent to external LLMs.
