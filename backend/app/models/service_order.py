from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum

class ServiceOrderStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ON_HOLD = "on_hold"

class ServiceOrderPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    EMERGENCY = "emergency"

class ServiceOrder(Base):
    __tablename__ = "service_orders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Enum(ServiceOrderStatus), default=ServiceOrderStatus.DRAFT)
    priority = Column(Enum(ServiceOrderPriority), default=ServiceOrderPriority.MEDIUM)
    
    # Relationships
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    
    # Timing information
    scheduled_start = Column(DateTime(timezone=True), nullable=True)
    scheduled_end = Column(DateTime(timezone=True), nullable=True)
    actual_start = Column(DateTime(timezone=True), nullable=True)
    actual_end = Column(DateTime(timezone=True), nullable=True)
    
    # Cost information
    estimated_cost = Column(Float, nullable=True)
    actual_cost = Column(Float, nullable=True)
    tax_amount = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=True)
    
    # Location information
    location = Column(String, nullable=True)
    location_details = Column(Text, nullable=True)
    
    # Additional metadata
    is_urgent = Column(Boolean, default=False)
    requires_approval = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)
    approval_notes = Column(Text, nullable=True)
    
    # System fields
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    client = relationship("User", foreign_keys=[client_id], back_populates="client_orders")
    provider = relationship("User", foreign_keys=[provider_id], back_populates="provider_orders")
    asset = relationship("Asset", back_populates="service_orders")
    checklist_items = relationship("ChecklistItem", back_populates="service_order")
    documents = relationship("Document", back_populates="service_order")

class ChecklistItem(Base):
    __tablename__ = "checklist_items"
    
    id = Column(Integer, primary_key=True, index=True)
    service_order_id = Column(Integer, ForeignKey("service_orders.id"), nullable=False)
    description = Column(String, nullable=False)
    is_required = Column(Boolean, default=True)
    is_completed = Column(Boolean, default=False)
    completed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    service_order = relationship("ServiceOrder", back_populates="checklist_items")
