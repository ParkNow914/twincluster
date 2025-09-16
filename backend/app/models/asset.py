from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum

class AssetType(str, enum.Enum):
    EQUIPMENT = "equipment"
    MACHINE = "machine"
    VEHICLE = "vehicle"
    FACILITY = "facility"
    TOOL = "tool"
    COMPONENT = "component"
    OTHER = "other"

class AssetStatus(str, enum.Enum):
    OPERATIONAL = "operational"
    MAINTENANCE = "maintenance"
    OUT_OF_SERVICE = "out_of_service"
    DECOMMISSIONED = "decommissioned"
    QUARANTINE = "quarantine"

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    asset_type = Column(Enum(AssetType), nullable=False)
    status = Column(Enum(AssetStatus), default=AssetStatus.OPERATIONAL)
    
    # Identification
    serial_number = Column(String, unique=True, nullable=True)
    model_number = Column(String, nullable=True)
    manufacturer = Column(String, nullable=True)
    
    # Ownership
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    current_location = Column(String, nullable=True)
    installation_date = Column(DateTime(timezone=True), nullable=True)
    expected_life = Column(Integer, nullable=True)  # in months
    
    # Specifications (stored as JSON for flexibility)
    specifications = Column(JSON, nullable=True)
    
    # Maintenance information
    last_maintenance_date = Column(DateTime(timezone=True), nullable=True)
    next_maintenance_date = Column(DateTime(timezone=True), nullable=True)
    maintenance_interval = Column(Integer, nullable=True)  # in days
    
    # System fields
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    owner = relationship("User", foreign_keys=[owner_id])
    service_orders = relationship("ServiceOrder", back_populates="asset")
    documents = relationship("Document", back_populates="asset")
    parts = relationship("InventoryItem", back_populates="asset")

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    sku = Column(String, unique=True, nullable=False)
    
    # Relationships
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    
    # Inventory details
    quantity_on_hand = Column(Integer, default=0)
    quantity_reserved = Column(Integer, default=0)
    reorder_point = Column(Integer, default=0)
    reorder_quantity = Column(Integer, default=1)
    unit_of_measure = Column(String, default="unit")
    
    # Pricing
    cost_price = Column(Float, nullable=True)
    selling_price = Column(Float, nullable=True)
    
    # Location
    location = Column(String, nullable=True)
    bin_location = Column(String, nullable=True)
    
    # System fields
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    asset = relationship("Asset", back_populates="parts")
    supplier = relationship("Supplier", back_populates="inventory_items")

class Supplier(Base):
    __tablename__ = "suppliers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    website = Column(String, nullable=True)
    tax_id = Column(String, nullable=True)  # CNPJ/CPF
    
    # Address
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    
    # Additional information
    lead_time = Column(Integer, nullable=True)  # in days
    payment_terms = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    
    # System fields
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    inventory_items = relationship("InventoryItem", back_populates="supplier")
