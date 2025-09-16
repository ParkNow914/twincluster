from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()

@router.get("/", response_model=List[schemas.ServiceOrder])
def read_service_orders(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve service orders.
    """
    # Regular users can only see their own service orders
    if current_user.role == schemas.UserRole.CLIENT:
        service_orders = crud.service_order.get_multi_by_owner(
            db, owner_id=current_user.id, skip=skip, limit=limit
        )
    # Providers can see service orders assigned to them
    elif current_user.role == schemas.UserRole.PROVIDER:
        service_orders = crud.service_order.get_multi_by_provider(
            db, provider_id=current_user.id, skip=skip, limit=limit
        )
    # Admins can see all service orders
    else:
        service_orders = crud.service_order.get_multi(db, skip=skip, limit=limit)
    
    return service_orders

@router.post("/", response_model=schemas.ServiceOrder, status_code=status.HTTP_201_CREATED)
def create_service_order(
    *,
    db: Session = Depends(deps.get_db),
    service_order_in: schemas.ServiceOrderCreate,
    current_user: models.User = Depends(deps.get_current_active_client),
) -> Any:
    """
    Create new service order.
    """
    # Only clients can create service orders
    if current_user.role != schemas.UserRole.CLIENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only clients can create service orders",
        )
    
    # Set the client_id to the current user
    service_order_in.client_id = current_user.id
    
    # Create the service order
    service_order = crud.service_order.create_with_owner(
        db=db, obj_in=service_order_in, owner_id=current_user.id
    )
    
    return service_order

@router.put("/{service_order_id}", response_model=schemas.ServiceOrder)
def update_service_order(
    *,
    db: Session = Depends(deps.get_db),
    service_order_id: int,
    service_order_in: schemas.ServiceOrderUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a service order.
    """
    service_order = crud.service_order.get(db, id=service_order_id)
    if not service_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The service order does not exist",
        )
    
    # Check permissions
    if not crud.user.is_superuser(current_user) and (service_order.client_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this service order",
        )
    
    service_order = crud.service_order.update(
        db, db_obj=service_order, obj_in=service_order_in
    )
    
    return service_order

@router.get("/{service_order_id}", response_model=schemas.ServiceOrderWithChecklist)
def read_service_order(
    *,
    db: Session = Depends(deps.get_db),
    service_order_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get service order by ID.
    """
    service_order = crud.service_order.get(db, id=service_order_id)
    if not service_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The service order does not exist",
        )
    
    # Check permissions
    if not crud.user.is_superuser(current_user) and \
       service_order.client_id != current_user.id and \
       service_order.provider_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this service order",
        )
    
    return service_order

@router.post("/{service_order_id}/checklist/", response_model=schemas.ChecklistItem)
def create_checklist_item(
    *,
    db: Session = Depends(deps.get_db),
    service_order_id: int,
    checklist_item_in: schemas.ChecklistItemCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a checklist item for a service order.
    """
    # Check if service order exists
    service_order = crud.service_order.get(db, id=service_order_id)
    if not service_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The service order does not exist",
        )
    
    # Check permissions
    if not crud.user.is_superuser(current_user) and \
       service_order.client_id != current_user.id and \
       service_order.provider_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to add checklist items to this service order",
        )
    
    # Create the checklist item
    checklist_item = crud.checklist_item.create_with_order(
        db=db, obj_in=checklist_item_in, order_id=service_order_id
    )
    
    return checklist_item

@router.put("/checklist/{checklist_item_id}", response_model=schemas.ChecklistItem)
def update_checklist_item(
    *,
    db: Session = Depends(deps.get_db),
    checklist_item_id: int,
    checklist_item_in: schemas.ChecklistItemUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a checklist item.
    """
    checklist_item = crud.checklist_item.get(db, id=checklist_item_id)
    if not checklist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The checklist item does not exist",
        )
    
    # Get the service order
    service_order = crud.service_order.get(db, id=checklist_item.service_order_id)
    
    # Check permissions
    if not crud.user.is_superuser(current_user) and \
       service_order.client_id != current_user.id and \
       service_order.provider_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this checklist item",
        )
    
    # Update the checklist item
    checklist_item = crud.checklist_item.update(
        db, db_obj=checklist_item, obj_in=checklist_item_in
    )
    
    return checklist_item

@router.post("/{service_order_id}/assign/{provider_id}", response_model=schemas.ServiceOrder)
def assign_service_order(
    *,
    db: Session = Depends(deps.get_db),
    service_order_id: int,
    provider_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Assign a service order to a provider.
    """
    # Check if service order exists
    service_order = crud.service_order.get(db, id=service_order_id)
    if not service_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The service order does not exist",
        )
    
    # Check if provider exists and is a provider
    provider = crud.user.get(db, id=provider_id)
    if not provider or provider.role != schemas.UserRole.PROVIDER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The specified user is not a valid provider",
        )
    
    # Check permissions - only client or admin can assign
    if not crud.user.is_superuser(current_user) and service_order.client_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to assign this service order",
        )
    
    # Update the service order
    service_order_update = schemas.ServiceOrderUpdate(
        provider_id=provider_id,
        status=schemas.ServiceOrderStatus.ASSIGNED
    )
    
    service_order = crud.service_order.update(
        db, db_obj=service_order, obj_in=service_order_update
    )
    
    return service_order
