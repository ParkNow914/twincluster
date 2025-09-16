from fastapi import APIRouter

from app.api.api_v1.endpoints import users, auth, service_orders, assets

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(service_orders.router, prefix="/service-orders", tags=["Service Orders"])
api_router.include_router(assets.router, prefix="/assets", tags=["Assets & Inventory"])
