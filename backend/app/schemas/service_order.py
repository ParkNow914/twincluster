from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import List, Optional, Dict, Any
from enum import Enum

class ServiceOrderStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ON_HOLD = "on_hold"

class ServiceOrderPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    EMERGENCY = "emergency"

class ServiceOrderBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: str = Field(..., max_length=5000)
    priority: ServiceOrderPriority = ServiceOrderPriority.MEDIUM
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    estimated_duration: Optional[int] = Field(None, gt=0, description="Estimated duration in minutes")
    estimated_cost: Optional[float] = Field(None, gt=0)
    location: Optional[str] = None
    location_details: Optional[str] = None
    asset_id: Optional[int] = None
    is_urgent: bool = False
    requires_approval: bool = False

class ServiceOrderCreate(ServiceOrderBase):
    pass

class ServiceOrderUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ServiceOrderStatus] = None
    priority: Optional[ServiceOrderPriority] = None
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None
    estimated_duration: Optional[int] = None
    estimated_cost: Optional[float] = None
    actual_cost: Optional[float] = None
    location: Optional[str] = None
    location_details: Optional[str] = None
    provider_id: Optional[int] = None
    asset_id: Optional[int] = None
    is_urgent: Optional[bool] = None
    is_approved: Optional[bool] = None
    approval_notes: Optional[str] = None

class ServiceOrder(ServiceOrderBase):
    id: int
    status: ServiceOrderStatus
    client_id: int
    provider_id: Optional[int] = None
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ChecklistItemBase(BaseModel):
    description: str = Field(..., max_length=500)
    is_required: bool = True

class ChecklistItemCreate(ChecklistItemBase):
    pass

class ChecklistItemUpdate(BaseModel):
    description: Optional[str] = None
    is_required: Optional[bool] = None
    is_completed: Optional[bool] = None
    notes: Optional[str] = None

class ChecklistItem(ChecklistItemBase):
    id: int
    service_order_id: int
    is_completed: bool = False
    completed_by: Optional[int] = None
    completed_at: Optional[datetime] = None
    notes: Optional[str] = None

    class Config:
        orm_mode = True

class ServiceOrderWithChecklist(ServiceOrder):
    checklist_items: List[ChecklistItem] = []

class ServiceOrderFilter(BaseModel):
    status: Optional[ServiceOrderStatus] = None
    priority: Optional[ServiceOrderPriority] = None
    client_id: Optional[int] = None
    provider_id: Optional[int] = None
    asset_id: Optional[int] = None
    is_urgent: Optional[bool] = None
    scheduled_start_after: Optional[datetime] = None
    scheduled_end_before: Optional[datetime] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None

class ServiceOrderStats(BaseModel):
    total: int = 0
    by_status: Dict[ServiceOrderStatus, int] = {}
    by_priority: Dict[ServiceOrderPriority, int] = {}
    avg_completion_time: Optional[float] = None  # in hours
    avg_response_time: Optional[float] = None   # in hours
