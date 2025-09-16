from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum

class NotificationType(str, Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    IN_APP = "in_app"
    SYSTEM = "system"

class NotificationStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
    FAILED = "failed"

class NotificationBase(BaseModel):
    title: str = Field(..., max_length=200)
    message: str = Field(..., max_length=5000)
    notification_type: NotificationType = NotificationType.IN_APP
    reference_type: Optional[str] = None
    reference_id: Optional[int] = None

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationUpdate(BaseModel):
    status: Optional[NotificationStatus] = None
    is_read: Optional[bool] = None

class Notification(NotificationBase):
    id: int
    user_id: int
    status: NotificationStatus = NotificationStatus.PENDING
    is_read: bool = False
    read_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class NotificationTemplateBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    subject: str = Field(..., max_length=200)
    body: str = Field(...)
    notification_type: NotificationType
    category: Optional[str] = None
    variables: Optional[Dict[str, Any]] = None

class NotificationTemplateCreate(NotificationTemplateBase):
    pass

class NotificationTemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    subject: Optional[str] = None
    body: Optional[str] = None
    notification_type: Optional[NotificationType] = None
    category: Optional[str] = None
    variables: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class NotificationTemplate(NotificationTemplateBase):
    id: int
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class NotificationPreferenceBase(BaseModel):
    email_enabled: bool = True
    sms_enabled: bool = False
    push_enabled: bool = True
    in_app_enabled: bool = True

class NotificationPreferenceCreate(NotificationPreferenceBase):
    user_id: int

class NotificationPreferenceUpdate(NotificationPreferenceBase):
    pass

class NotificationPreference(NotificationPreferenceBase):
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class NotificationFilter(BaseModel):
    user_id: Optional[int] = None
    notification_type: Optional[NotificationType] = None
    status: Optional[NotificationStatus] = None
    is_read: Optional[bool] = None
    reference_type: Optional[str] = None
    reference_id: Optional[int] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
