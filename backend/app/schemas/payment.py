from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, Dict, Any, List
from enum import Enum

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"
    CANCELLED = "cancelled"
    EXPIRED = "expired"

class PaymentMethod(str, Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    BANK_TRANSFER = "bank_transfer"
    PIX = "pix"
    BOLETO = "boleto"
    CASH = "cash"
    OTHER = "other"

class PaymentBase(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str = "BRL"
    status: PaymentStatus = PaymentStatus.PENDING
    payment_method: PaymentMethod
    payment_details: Optional[Dict[str, Any]] = None
    service_order_id: Optional[int] = None
    invoice_id: Optional[str] = None

class PaymentCreate(PaymentBase):
    client_id: int

class PaymentUpdate(BaseModel):
    status: Optional[PaymentStatus] = None
    payment_details: Optional[Dict[str, Any]] = None
    paid_at: Optional[datetime] = None
    refunded_at: Optional[datetime] = None

class Payment(PaymentBase):
    id: int
    client_id: int
    created_by: int
    paid_at: Optional[datetime] = None
    refunded_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class InvoiceBase(BaseModel):
    invoice_number: str
    amount: float = Field(..., gt=0)
    tax_amount: float = Field(0.0, ge=0)
    discount_amount: float = Field(0.0, ge=0)
    total_amount: float = Field(..., gt=0)
    billing_name: str
    billing_tax_id: Optional[str] = None
    billing_address: Optional[str] = None
    due_date: datetime
    service_order_id: Optional[int] = None

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    status: Optional[PaymentStatus] = None
    paid_date: Optional[datetime] = None
    notes: Optional[str] = None

class Invoice(InvoiceBase):
    id: int
    status: PaymentStatus = PaymentStatus.PENDING
    paid_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    payments: List[Payment] = []

    class Config:
        orm_mode = True

class PaymentIntentCreate(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str = "BRL"
    payment_method: PaymentMethod
    service_order_id: Optional[int] = None
    description: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class PaymentIntentResponse(BaseModel):
    id: str
    client_secret: Optional[str] = None
    status: str
    amount: float
    currency: str
    payment_method: str
    created_at: datetime
    next_action: Optional[Dict[str, Any]] = None

class PaymentWebhook(BaseModel):
    event_type: str
    data: Dict[str, Any]
    created: datetime

class PaymentFilter(BaseModel):
    status: Optional[PaymentStatus] = None
    payment_method: Optional[PaymentMethod] = None
    client_id: Optional[int] = None
    service_order_id: Optional[int] = None
    invoice_id: Optional[str] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None

class PaymentStats(BaseModel):
    total_amount: float
    total_count: int
    by_status: Dict[PaymentStatus, int]
    by_payment_method: Dict[PaymentMethod, int]
    avg_payment_amount: float
    total_refunded: float
