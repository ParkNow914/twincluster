from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from typing import Optional, Dict, Any
from enum import Enum

class DocumentType(str, Enum):
    INVOICE = "invoice"
    QUOTE = "quote"
    CONTRACT = "contract"
    REPORT = "report"
    CERTIFICATE = "certificate"
    MANUAL = "manual"
    IMAGE = "image"
    OTHER = "other"

class DocumentBase(BaseModel):
    name: str = Field(..., max_length=200)
    description: Optional[str] = None
    document_type: DocumentType = DocumentType.OTHER
    file_path: str
    file_size: Optional[int] = None  # in bytes
    mime_type: Optional[str] = None
    is_public: bool = False
    expiration_date: Optional[datetime] = None

class DocumentCreate(DocumentBase):
    uploaded_by: int
    service_order_id: Optional[int] = None
    asset_id: Optional[int] = None

class DocumentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    document_type: Optional[DocumentType] = None
    is_public: Optional[bool] = None
    expiration_date: Optional[datetime] = None
    is_active: Optional[bool] = None

class Document(DocumentBase):
    id: int
    uploaded_by: int
    service_order_id: Optional[int] = None
    asset_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class DocumentWithUrl(Document):
    download_url: Optional[str] = None
    preview_url: Optional[str] = None

class DocumentFilter(BaseModel):
    document_type: Optional[DocumentType] = None
    uploaded_by: Optional[int] = None
    service_order_id: Optional[int] = None
    asset_id: Optional[int] = None
    is_public: Optional[bool] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
