# TwinGrid Backend

Backend API for the TwinGrid platform, built with FastAPI, SQLAlchemy, and PostgreSQL.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Service Order Management**: Create, track, and manage industrial service orders
- **Asset Management**: Track industrial assets and their maintenance history
- **Document Management**: Upload and manage documents related to service orders and assets
- **Payment Processing**: Integrated payment processing with multiple payment methods
- **Notifications**: Email and in-app notifications for important events
- **RESTful API**: Clean, well-documented API following REST principles

## Prerequisites

- Python 3.9+
- PostgreSQL 13+
- pip (Python package manager)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/twingrid-backend.git
   cd twingrid-backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file with your configuration.

5. Initialize the database:
   ```bash
   python -m app.db.init_db
   ```

## Running the Application

### Development

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Production

For production, you should use a production-ready ASGI server like Uvicorn with Gunicorn:

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── api_v1/
│   │       ├── api.py           # Main API router
│   │       └── endpoints/       # API endpoints
│   ├── core/                   # Core functionality
│   ├── crud/                   # Database operations
│   ├── db/                     # Database configuration
│   ├── models/                 # SQLAlchemy models
│   ├── schemas/                # Pydantic schemas
│   └── main.py                 # FastAPI application
├── tests/                      # Test files
├── .env.example               # Environment variables example
├── alembic.ini                # Alembic configuration
├── requirements.txt            # Project dependencies
└── README.md                  # This file
```

## Database Migrations

This project uses Alembic for database migrations.

### Create a new migration

```bash
alembic revision --autogenerate -m "Your migration message"
```

### Apply migrations

```bash
alembic upgrade head
```

## Testing

To run the test suite:

```bash
pytest
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
