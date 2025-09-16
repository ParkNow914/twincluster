from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class NotificationType(str, enum.Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    IN_APP = "in_app"
    SYSTEM = "system"

class NotificationStatus(str, enum.Enum):
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
    FAILED = "failed"

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(Enum(NotificationType), default=NotificationType.IN_APP)
    status = Column(Enum(NotificationStatus), default=NotificationStatus.PENDING)
    
    # Recipient
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Reference to related entity
    reference_type = Column(String, nullable=True)  # e.g., 'service_order', 'payment', etc.
    reference_id = Column(Integer, nullable=True)   # ID of the referenced entity
    
    # Metadata
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    # System fields
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="notifications")

class NotificationTemplate(Base):
    __tablename__ = "notification_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    
    # Content
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    
    # Type and category
    notification_type = Column(Enum(NotificationType), nullable=False)
    category = Column(String, nullable=True)  # e.g., 'billing', 'maintenance', 'security'
    
    # Variables (stored as JSON)
    variables = Column(Text, nullable=True)  # JSON string of available variables
    
    # System fields
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<NotificationTemplate {self.name} ({self.notification_type})>"
