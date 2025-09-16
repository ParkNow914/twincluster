from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, Dict, Any, List
from enum import Enum

class AssetType(str, Enum):
    EQUIPMENT = "equipment"
    MACHINE = "machine"
    VEHICLE = "vehicle"
    FACILITY = "facility"
    TOOL = "tool"
    COMPONENT = "component"
    OTHER = "other"

class AssetStatus(str, Enum):
    OPERATIONAL = "operational"
    MAINTENANCE = "maintenance"
    OUT_OF_SERVICE = "out_of_service"
    DECOMMISSIONED = "decommissioned"
    QUARANTINE = "quarantine"

class AssetBase(BaseModel):
    name: str = Field(..., max_length=200)
    description: Optional[str] = None
    asset_type: AssetType
    status: AssetStatus = AssetStatus.OPERATIONAL
    serial_number: Optional[str] = None
    model_number: Optional[str] = None
    manufacturer: Optional[str] = None
    current_location: Optional[str] = None
    installation_date: Optional[datetime] = None
    expected_life: Optional[int] = Field(None, gt=0, description="Expected life in months")
    maintenance_interval: Optional[int] = Field(None, gt=0, description="Maintenance interval in days")
    specifications: Optional[Dict[str, Any]] = None

class AssetCreate(AssetBase):
    owner_id: int

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    asset_type: Optional[AssetType] = None
    status: Optional[AssetStatus] = None
    serial_number: Optional[str] = None
    model_number: Optional[str] = None
    manufacturer: Optional[str] = None
    current_location: Optional[str] = None
    installation_date: Optional[datetime] = None
    expected_life: Optional[int] = None
    maintenance_interval: Optional[int] = None
    last_maintenance_date: Optional[datetime] = None
    next_maintenance_date: Optional[datetime] = None
    specifications: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class Asset(AssetBase):
    id: int
    owner_id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_active: bool = True

    class Config:
        orm_mode = True

class AssetWithServiceOrders(Asset):
    service_orders: List[Any] = []

class InventoryItemBase(BaseModel):
    name: str = Field(..., max_length=200)
    description: Optional[str] = None
    sku: str
    quantity_on_hand: int = 0
    quantity_reserved: int = 0
    reorder_point: int = 0
    reorder_quantity: int = 1
    unit_of_measure: str = "unit"
    cost_price: Optional[float] = None
    selling_price: Optional[float] = None
    location: Optional[str] = None
    bin_location: Optional[str] = None

class InventoryItemCreate(InventoryItemBase):
    asset_id: Optional[int] = None
    supplier_id: Optional[int] = None

class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sku: Optional[str] = None
    quantity_on_hand: Optional[int] = None
    quantity_reserved: Optional[int] = None
    reorder_point: Optional[int] = None
    reorder_quantity: Optional[int] = None
    unit_of_measure: Optional[str] = None
    cost_price: Optional[float] = None
    selling_price: Optional[float] = None
    location: Optional[str] = None
    bin_location: Optional[str] = None
    is_active: Optional[bool] = None

class InventoryItem(InventoryItemBase):
    id: int
    asset_id: Optional[int] = None
    supplier_id: Optional[int] = None
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class SupplierBase(BaseModel):
    name: str = Field(..., max_length=200)
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    tax_id: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    lead_time: Optional[int] = None
    payment_terms: Optional[str] = None
    notes: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(SupplierBase):
    name: Optional[str] = None
    is_active: Optional[bool] = None

class Supplier(SupplierBase):
    id: int
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
