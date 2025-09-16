import logging
import sys
from typing import Optional

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.user import User, UserRole

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_superuser(
    email: str, 
    password: str, 
    full_name: str = "Admin User",
    company_name: str = "TwinGrid"
) -> User:
    """Create a superuser."""
    db = SessionLocal()
    try:
        # Check if user already exists
        user = db.query(User).filter(User.email == email).first()
        if user:
            logger.warning(f"User with email {email} already exists")
            return user
        
        # Create new superuser
        user = User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            company_name=company_name,
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        logger.info(f"Created superuser with email: {email}")
        return user
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating superuser: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python -m scripts.create_superuser <email> <password>")
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2]
    
    try:
        user = create_superuser(email=email, password=password)
        print(f"Superuser created successfully with ID: {user.id}")
    except Exception as e:
        print(f"Error creating superuser: {e}")
        sys.exit(1)
