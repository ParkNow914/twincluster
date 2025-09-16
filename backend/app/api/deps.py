from typing import Generator, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core import security
from app.core.config import settings
from app.db.session import SessionLocal
from app.models.user import User

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login/access-token"
)

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = crud.user.get(db, id=token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not crud.user.is_active(current_user):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user

def get_current_active_client(
    current_user: User = Depends(get_current_active_user),
) -> User:
    if current_user.role != schemas.UserRole.CLIENT:
        raise HTTPException(
            status_code=400, 
            detail="This action is only allowed for clients"
        )
    return current_user

def get_current_active_provider(
    current_user: User = Depends(get_current_active_user),
) -> User:
    if current_user.role != schemas.UserRole.PROVIDER:
        raise HTTPException(
            status_code=400, 
            detail="This action is only allowed for service providers"
        )
    return current_user

def get_current_active_operator(
    current_user: User = Depends(get_current_active_user),
) -> User:
    if current_user.role != schemas.UserRole.OPERATOR:
        raise HTTPException(
            status_code=400, 
            detail="This action is only allowed for operators"
        )
    return current_user
