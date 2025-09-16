import logging
from typing import Any

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base_class import Base
from app.db.session import engine
from app.models import *  # noqa: F401, F403

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db() -> None:
    """Initialize the database by creating all tables."""
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully!")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

def drop_db() -> None:
    """Drop all database tables."""
    try:
        logger.warning("Dropping all database tables...")
        Base.metadata.drop_all(bind=engine)
        logger.warning("All database tables dropped!")
    except Exception as e:
        logger.error(f"Error dropping database tables: {e}")
        raise

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Database initialization script")
    parser.add_argument(
        "--drop", 
        action="store_true", 
        help="Drop all tables before creating them"
    )
    
    args = parser.parse_args()
    
    if args.drop:
        drop_db()
    
    init_db()
