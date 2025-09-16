from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from ..database import Base
import enum

class UserRole(str, enum.Enum):
    CLIENT = "client"
    PROVIDER = "provider"
    ADMIN = "admin"
    OPERATOR = "operator"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, index=True)
    company_name = Column(String, index=True)
    tax_id = Column(String, unique=True)  # CNPJ/CPF
    phone = Column(String)
    role = Column(Enum(UserRole), default=UserRole.CLIENT)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Provider specific fields
    provider_type = Column(String, nullable=True)  # e.g., mechanical, electrical, etc.
    service_areas = Column(String, nullable=True)  # Comma-separated list of service areas
    certification_level = Column(String, nullable=True)
    
    def __repr__(self):
        return f"<User {self.email} ({self.role})>"

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    bio = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    
    # Additional contact information
    secondary_phone = Column(String, nullable=True)
    whatsapp = Column(String, nullable=True)
    
    # Social media links
    website = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    
    # Business hours
    business_hours = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
