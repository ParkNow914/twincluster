from typing import List, Optional, Dict, Any

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import Asset, InventoryItem, User
from app.schemas.asset import AssetCreate, AssetUpdate, InventoryItemCreate, InventoryItemUpdate

class CRUDAsset(CRUDBase[Asset, AssetCreate, AssetUpdate]):
    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Asset]:
        return (
            db.query(self.model)
            .filter(Asset.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def create_with_owner(
        self, db: Session, *, obj_in: AssetCreate, created_by: int
    ) -> Asset:
        obj_in_data = obj_in.dict()
        db_obj = self.model(
            **obj_in_data,
            created_by=created_by
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

class CRUDInventoryItem(CRUDBase[InventoryItem, InventoryItemCreate, InventoryItemUpdate]):
    def get_multi_by_asset(
        self, db: Session, *, asset_id: int, skip: int = 0, limit: int = 100
    ) -> List[InventoryItem]:
        return (
            db.query(self.model)
            .filter(InventoryItem.asset_id == asset_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[InventoryItem]:
        return (
            db.query(self.model)
            .join(Asset, InventoryItem.asset_id == Asset.id)
            .filter(Asset.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def create_with_asset(
        self, db: Session, *, obj_in: InventoryItemCreate, asset_id: int
    ) -> InventoryItem:
        obj_in_data = obj_in.dict()
        db_obj = self.model(
            **obj_in_data,
            asset_id=asset_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

asset = CRUDAsset(Asset)
inventory_item = CRUDInventoryItem(InventoryItem)
