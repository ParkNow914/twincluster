# TwinGrid - Industrial Platform

A modern industrial platform for managing service orders, assets, and maintenance operations.

![TwinGrid Logo](https://via.placeholder.com/150x50?text=TwinGrid)

## 🚀 Features

- **Authentication & Authorization**
  - User registration and login
  - Email verification
  - Password reset
  - Role-based access control (Admin, Client, Provider, Operator)

- **Service Order Management**
  - Create and track service orders
  - Assign service providers
  - Track order status in real-time
  - Digital checklists and documentation

- **Asset Management**
  - Comprehensive asset tracking
  - Maintenance history and scheduling
  - Document management
  - Barcode/QR code support

- **Document Management**
  - Secure file upload and storage
  - Version control
  - Team collaboration

- **Real-time Dashboard**
  - Live notifications
  - Activity feed
  - Performance analytics

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: React Query + Context API
- **Form Handling**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library

### Backend
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy 2.0
- **Async**: asyncio + httpx
- **Background Tasks**: Celery + Redis

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Prometheus
- **Logging**: Loguru + ELK Stack

## 🚀 Quick Start
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
