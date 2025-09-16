import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models import (
    User, UserRole, Asset, AssetType, AssetStatus, 
    ServiceOrder, ServiceOrderStatus, ServiceOrderPriority,
    ChecklistItem, Document, DocumentType, Payment, 
    PaymentStatus, PaymentMethod, InventoryItem, Supplier
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_test_data() -> None:
    """Initialize database with test data."""
    db = SessionLocal()
    try:
        # Create test users
        admin = create_user(
            db,
            email="admin@twingrid.com",
            password="admin123",
            full_name="Admin User",
            company_name="TwinGrid",
            role=UserRole.ADMIN,
        )
        
        client1 = create_user(
            db,
            email="client1@example.com",
            password="client123",
            full_name="Client One",
            company_name="Industrial Solutions Inc.",
            role=UserRole.CLIENT,
        )
        
        provider1 = create_user(
            db,
            email="provider1@example.com",
            password="provider123",
            full_name="Provider One",
            company_name="Maintenance Pros",
            role=UserRole.PROVIDER,
            provider_type="mechanical",
            service_areas="SP,RJ,MG"
        )
        
        # Create supplier
        supplier = Supplier(
            name="Industrial Parts Ltd.",
            contact_name="John Supplier",
            email="contact@industrialparts.com",
            phone="+5511999999999",
            address="123 Supplier St, Sao Paulo, SP",
            tax_id="12.345.678/0001-90",
            is_active=True
        )
        db.add(supplier)
        db.flush()
        
        # Create assets
        asset1 = Asset(
            name="CNC Machine X-1000",
            description="Industrial CNC machine for metal works",
            asset_type=AssetType.MACHINE,
            status=AssetStatus.OPERATIONAL,
            serial_number="CNC-X1000-001",
            model_number="X-1000",
            manufacturer="Industrial Machines Inc.",
            owner_id=client1.id,
            current_location="Factory Floor A",
            installation_date=datetime.utcnow() - timedelta(days=365),
            expected_life=120,  # months
            specifications={
                "power": "10kW",
                "weight": "2500kg",
                "dimensions": "3m x 2m x 2m"
            },
            maintenance_interval=90,  # days
            created_by=admin.id
        )
        db.add(asset1)
        db.flush()
        
        # Create inventory items
        inventory_item1 = InventoryItem(
            name="Cutting Tool Set",
            description="High-speed steel cutting tools for CNC",
            sku="CTL-001",
            asset_id=asset1.id,
            supplier_id=supplier.id,
            quantity_on_hand=10,
            reorder_point=2,
            unit_of_measure="set",
            cost_price=450.00,
            selling_price=600.00,
            location="Tool Crib A"
        )
        db.add(inventory_item1)
        
        # Create service order
        service_order = ServiceOrder(
            title="Routine Maintenance - CNC Machine X-1000",
            description="Scheduled maintenance for CNC machine",
            status=ServiceOrderStatus.ASSIGNED,
            priority=ServiceOrderPriority.MEDIUM,
            client_id=client1.id,
            provider_id=provider1.id,
            asset_id=asset1.id,
            scheduled_start=datetime.utcnow() + timedelta(days=1),
            scheduled_end=datetime.utcnow() + timedelta(days=1, hours=4),
            estimated_cost=1200.00,
            location="Factory Floor A",
            requires_approval=False,
            created_by=admin.id
        )
        db.add(service_order)
        db.flush()
        
        # Create checklist items
        checklist_items = [
            ("Check hydraulic pressure", True, "Within normal range"),
            ("Inspect cutting tools", True, "All tools in good condition"),
            ("Lubricate moving parts", False, None),
            ("Calibrate machine", False, None),
            ("Test run with sample material", False, None),
        ]
        
        for i, (desc, is_required, notes) in enumerate(checklist_items):
            item = ChecklistItem(
                service_order_id=service_order.id,
                description=desc,
                is_required=is_required,
                is_completed=is_required,
                notes=notes if is_required else None,
                completed_by=provider1.id if is_required else None,
                completed_at=datetime.utcnow() if is_required else None
            )
            db.add(item)
        
        # Create document
        document = Document(
            name="Maintenance Manual - CNC X-1000.pdf",
            description="Maintenance manual for CNC X-1000 machine",
            document_type=DocumentType.MANUAL,
            file_path="/documents/manuals/cnc_x1000.pdf",
            file_size=2048000,  # 2MB
            mime_type="application/pdf",
            uploaded_by=admin.id,
            asset_id=asset1.id,
            is_public=True
        )
        db.add(document)
        
        # Create payment
        payment = Payment(
            amount=1200.00,
            currency="BRL",
            status=PaymentStatus.PENDING,
            payment_method=PaymentMethod.BANK_TRANSFER,
            payment_details={
                "bank": "Bank of Brazil",
                "branch": "1234",
                "account": "56789-0"
            },
            service_order_id=service_order.id,
            created_by=admin.id
        )
        db.add(payment)
        
        db.commit()
        logger.info("Test data initialized successfully!")
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error initializing test data: {e}")
        raise
    finally:
        db.close()

def create_user(
    db: Session,
    email: str,
    password: str,
    full_name: str,
    company_name: str,
    role: UserRole,
    **kwargs
) -> User:
    """Helper function to create a user."""
    user = db.query(User).filter(User.email == email).first()
    if user:
        logger.warning(f"User with email {email} already exists")
        return user
    
    user = User(
        email=email,
        hashed_password=get_password_hash(password),
        full_name=full_name,
        company_name=company_name,
        role=role,
        is_active=True,
        is_verified=True,
        **kwargs
    )
    
    db.add(user)
    db.flush()
    return user

if __name__ == "__main__":
    logger.info("Initializing test data...")
    init_test_data()
