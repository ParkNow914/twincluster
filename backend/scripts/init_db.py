#!/usr/bin/env python3
"""
Database initialization script for TwinGrid.

This script initializes the database with test data for development.
"""
import asyncio
import logging
import sys
from pathlib import Path

# Add the project root to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.db.session import async_engine, async_session
from app.models import Base
from app.schemas.user import UserCreate
from app.services.user import user_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Test data
TEST_USERS = [
    {
        "email": "admin@twingrid.com",
        "password": "admin123",
        "full_name": "Admin User",
        "is_superuser": True,
        "is_active": True,
        "is_verified": True,
    },
    {
        "email": "manager@twingrid.com",
        "password": "manager123",
        "full_name": "Manager User",
        "is_superuser": False,
        "is_active": True,
        "is_verified": True,
    },
    {
        "email": "user@twingrid.com",
        "password": "user123",
        "full_name": "Regular User",
        "is_superuser": False,
        "is_active": True,
        "is_verified": True,
    },
]


async def create_database() -> None:
    """Create the database if it doesn't exist."""
    # Extract database name from the URL
    db_name = settings.DATABASE_URL.path.split("/")[-1]
    
    # Create a connection to the default database (postgres)
    default_url = settings.DATABASE_URL.with_path("/postgres")
    engine = async_engine.with_url(str(default_url))
    
    # Check if the database exists
    async with engine.connect() as conn:
        result = await conn.execute(
            text(
                "SELECT 1 FROM pg_database WHERE datname = :dbname"
            ),
            {"dbname": db_name}
        )
        db_exists = result.scalar()
        
        if not db_exists:
            logger.info(f"Creating database: {db_name}")
            # Create the database
            await conn.execute(
                text(f'CREATE DATABASE "{db_name}"')
            )
            await conn.commit()
        else:
            logger.info(f"Database {db_name} already exists")
    
    await engine.dispose()


async def drop_database() -> None:
    """Drop the database if it exists."""
    # Extract database name from the URL
    db_name = settings.DATABASE_URL.path.split("/")[-1]
    
    # Create a connection to the default database (postgres)
    default_url = settings.DATABASE_URL.with_path("/postgres")
    engine = async_engine.with_url(str(default_url))
    
    # Disconnect all users from the database
    async with engine.connect() as conn:
        # Terminate all connections to the database
        await conn.execute(
            text(
                "SELECT pg_terminate_backend(pg_stat_activity.pid) "
                "FROM pg_stat_activity "
                "WHERE pg_stat_activity.datname = :dbname "
                "AND pid <> pg_backend_pid()"
            ),
            {"dbname": db_name}
        )
        
        # Drop the database
        logger.warning(f"Dropping database: {db_name}")
        await conn.execute(
            text(f'DROP DATABASE IF EXISTS "{db_name}"')
        )
        await conn.commit()
    
    await engine.dispose()


async def create_tables() -> None:
    """Create all database tables."""
    logger.info("Creating database tables...")
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created")


async def drop_tables() -> None:
    """Drop all database tables."""
    logger.warning("Dropping all database tables...")
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    logger.info("Database tables dropped")


async def create_initial_data() -> None:
    """Create initial data in the database."""
    logger.info("Creating initial data...")
    
    async with async_session() as session:
        # Create test users
        for user_data in TEST_USERS:
            email = user_data["email"]
            existing_user = await user_service.get_by_email(session, email=email)
            
            if not existing_user:
                user_in = UserCreate(
                    email=email,
                    password=user_data["password"],
                    full_name=user_data["full_name"],
                    is_superuser=user_data["is_superuser"],
                    is_active=user_data["is_active"],
                    is_verified=user_data["is_verified"],
                )
                await user_service.create(session, obj_in=user_in)
                logger.info(f"Created user: {email}")
            else:
                logger.info(f"User already exists: {email}")
    
    logger.info("Initial data created")


async def init() -> None:
    """Initialize the database."""
    logger.info("Initializing database...")
    
    # Create the database if it doesn't exist
    await create_database()
    
    # Create all tables
    await create_tables()
    
    # Create initial data
    await create_initial_data()
    
    logger.info("Database initialization complete!")


async def reset() -> None:
    """Reset the database (drop and recreate)."""
    logger.warning("Resetting database...")
    
    # Drop all tables
    await drop_tables()
    
    # Recreate tables
    await create_tables()
    
    # Create initial data
    await create_initial_data()
    
    logger.info("Database reset complete!")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Database initialization script")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Reset the database (drop and recreate all tables)",
    )
    parser.add_argument(
        "--drop-db",
        action="store_true",
        help="Drop the entire database (use with caution!)",
    )
    
    args = parser.parse_args()
    
    try:
        if args.drop_db:
            asyncio.run(drop_database())
        elif args.reset:
            asyncio.run(reset())
        else:
            asyncio.run(init())
    except SQLAlchemyError as e:
        logger.error(f"Database error: {e}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        sys.exit(1)
