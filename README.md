# TwinGrid / ClusterOps Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ParkNow914/twincluster/pulls)
[![GitHub stars](https://img.shields.io/github/stars/ParkNow914/twincluster?style=social)](https://github.com/ParkNow914/twincluster/stargazers)

A comprehensive industrial maintenance and logistics orchestration platform built with Next.js, FastAPI, and PostgreSQL.

## ✨ Features

- **Multi-role Authentication** (Admin, Client, Provider, Operator)
- **Service Order Management** with real-time updates
- **Asset & Inventory Tracking** with maintenance scheduling
- **Document Management** with version control
- **Payment Processing** with multiple payment methods
- **Real-time Notifications**
- **Responsive Design** for all devices
- **Dark/Light Mode**

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: FastAPI, Python 3.11+
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with refresh tokens
- **Storage**: Local filesystem (S3 compatible)
- **Real-time**: WebSockets
- **Testing**: Jest, React Testing Library, Pytest

## 🛠️ Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- pnpm (recommended) or npm
- Docker (optional)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ParkNow914/twincluster.git
cd twincluster
```

### 2. Set up the backend

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload
```

### 3. Set up the frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install  # or npm install

# Start the development server
pnpm dev
```

### 4. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📦 Project Structure

```
twincluster/
├── backend/               # FastAPI backend
│   ├── app/               # Application code
│   │   ├── api/           # API routes
│   │   ├── core/          # Core functionality
│   │   ├── crud/          # Database operations
│   │   ├── db/            # Database configuration
│   │   ├── models/        # SQLAlchemy models
│   │   └── schemas/       # Pydantic models
│   ├── tests/             # Backend tests
│   └── alembic/           # Database migrations
│
├── frontend/              # Next.js frontend
│   ├── public/            # Static files
│   └── src/               # Source code
│       ├── app/           # App router
│       ├── components/    # Reusable components
│       ├── lib/           # Utilities and API client
│       └── styles/        # Global styles
│
└── docs/                  # Documentation
└── scripts/             # Utility scripts
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+ (for frontend)
- PostgreSQL 13+

### Backend Setup

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Run the development server:
   ```bash
   cd app
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

Frontend setup instructions will be added once the React/Next.js application is set up.

## API Documentation

Once the server is running, you can access:
- Interactive API docs: `http://localhost:8000/docs`
- Alternative API docs: `http://localhost:8000/redoc`

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
DATABASE_URL=postgresql://user:password@localhost/twingrid
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

## Development

### Code Style

- Backend: Follow PEP 8 and Google Python Style Guide
- Frontend: Follow Airbnb JavaScript Style Guide
- Use type hints in Python
- Document all public functions and classes

### Git Workflow

1. Create a new branch for each feature/bugfix
2. Write tests for new features
3. Submit a pull request for review
4. Squash and merge after approval

## License

Proprietary - All rights reserved
