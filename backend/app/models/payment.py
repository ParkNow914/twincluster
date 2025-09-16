from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"
    CANCELLED = "cancelled"

class PaymentMethod(str, enum.Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    BANK_TRANSFER = "bank_transfer"
    PIX = "pix"
    BOLETO = "boleto"
    CASH = "cash"
    OTHER = "other"

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="BRL")
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    
    # Payment details (stored as JSON for flexibility)
    payment_details = Column(Text, nullable=True)
    
    # Reference to the order or invoice
    service_order_id = Column(Integer, ForeignKey("service_orders.id"), nullable=True)
    invoice_id = Column(String, nullable=True)
    
    # Timestamps
    paid_at = Column(DateTime(timezone=True), nullable=True)
    refunded_at = Column(DateTime(timezone=True), nullable=True)
    
    # System fields
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    service_order = relationship("ServiceOrder", back_populates="payments")

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    
    # Billing information
    billing_name = Column(String, nullable=False)
    billing_tax_id = Column(String, nullable=True)  # CNPJ/CPF
    billing_address = Column(Text, nullable=True)
    
    # Status
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    due_date = Column(DateTime(timezone=True), nullable=False)
    paid_date = Column(DateTime(timezone=True), nullable=True)
    
    # Reference
    service_order_id = Column(Integer, ForeignKey("service_orders.id"), nullable=True)
    
    # System fields
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    service_order = relationship("ServiceOrder", back_populates="invoices")
    payments = relationship("Payment", back_populates="invoice")
