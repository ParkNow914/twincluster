from typing import List, Optional, Dict, Any

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import ServiceOrder, User, ChecklistItem
from app.schemas.service_order import ServiceOrderCreate, ServiceOrderUpdate, ChecklistItemCreate, ChecklistItemUpdate

class CRUDServiceOrder(CRUDBase[ServiceOrder, ServiceOrderCreate, ServiceOrderUpdate]):
    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[ServiceOrder]:
        return (
            db.query(self.model)
            .filter(ServiceOrder.client_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_multi_by_provider(
        self, db: Session, *, provider_id: int, skip: int = 0, limit: int = 100
    ) -> List[ServiceOrder]:
        return (
            db.query(self.model)
            .filter(ServiceOrder.provider_id == provider_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def create_with_owner(
        self, db: Session, *, obj_in: ServiceOrderCreate, owner_id: int, created_by: int
    ) -> ServiceOrder:
        obj_in_data = obj_in.dict()
        db_obj = self.model(
            **obj_in_data,
            client_id=owner_id,
            created_by=created_by
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

class CRUDChecklistItem(CRUDBase[ChecklistItem, ChecklistItemCreate, ChecklistItemUpdate]):
    def get_multi_by_order(
        self, db: Session, *, order_id: int, skip: int = 0, limit: int = 100
    ) -> List[ChecklistItem]:
        return (
            db.query(self.model)
            .filter(ChecklistItem.service_order_id == order_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def create_with_order(
        self, db: Session, *, obj_in: ChecklistItemCreate, order_id: int
    ) -> ChecklistItem:
        obj_in_data = obj_in.dict()
        db_obj = self.model(
            **obj_in_data,
            service_order_id=order_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

service_order = CRUDServiceOrder(ServiceOrder)
checklist_item = CRUDChecklistItem(ChecklistItem)
