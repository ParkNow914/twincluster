from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum

class DocumentType(str, enum.Enum):
    INVOICE = "invoice"
    QUOTE = "quote"
    CONTRACT = "contract"
    REPORT = "report"
    CERTIFICATE = "certificate"
    MANUAL = "manual"
    IMAGE = "image"
    OTHER = "other"

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    document_type = Column(Enum(DocumentType), nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=True)  # in bytes
    mime_type = Column(String, nullable=True)
    
    # Relationships
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_order_id = Column(Integer, ForeignKey("service_orders.id"), nullable=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    
    # Metadata
    is_public = Column(Boolean, default=False)
    expiration_date = Column(DateTime(timezone=True), nullable=True)
    
    # System fields
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    service_order = relationship("ServiceOrder", back_populates="documents")
    asset = relationship("Asset", back_populates="documents")
