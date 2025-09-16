# Import all models here to make them available when importing from .models
from .user import User, UserProfile, UserRole
from .asset import Asset, AssetType, AssetStatus, InventoryItem, Supplier
from .service_order import ServiceOrder, ServiceOrderStatus, ServiceOrderPriority, ChecklistItem
from .document import Document, DocumentType
from .auth import Token, VerificationCode, UserSession
from .payment import Payment, PaymentStatus, PaymentMethod, Invoice
from .notification import Notification, NotificationStatus, NotificationType, NotificationTemplate

# This allows for cleaner imports in other files
__all__ = [
    'User', 'UserProfile', 'UserRole',
    'Asset', 'AssetType', 'AssetStatus', 'InventoryItem', 'Supplier',
    'ServiceOrder', 'ServiceOrderStatus', 'ServiceOrderPriority', 'ChecklistItem',
    'Document', 'DocumentType',
    'Token', 'VerificationCode', 'UserSession',
    'Payment', 'PaymentStatus', 'PaymentMethod', 'Invoice',
    'Notification', 'NotificationStatus', 'NotificationType', 'NotificationTemplate'
]
