from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()

# Assets
@router.get("/", response_model=List[schemas.Asset])
def read_assets(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve assets.
    """
    # Regular users can only see their own assets
    if not crud.user.is_superuser(current_user):
        assets = crud.asset.get_multi_by_owner(
            db, owner_id=current_user.id, skip=skip, limit=limit
        )
    # Admins can see all assets
    else:
        assets = crud.asset.get_multi(db, skip=skip, limit=limit)
    
    return assets

@router.post("/", response_model=schemas.Asset, status_code=status.HTTP_201_CREATED)
def create_asset(
    *,
    db: Session = Depends(deps.get_db),
    asset_in: schemas.AssetCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new asset.
    """
    # Only admins can create assets for other users
    if not crud.user.is_superuser(current_user) and asset_in.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to create an asset for another user",
        )
    
    # Create the asset
    asset = crud.asset.create_with_owner(
        db=db, obj_in=asset_in, created_by=current_user.id
    )
    
    return asset

@router.get("/{asset_id}", response_model=schemas.AssetWithServiceOrders)
def read_asset(
    *,
    db: Session = Depends(deps.get_db),
    asset_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get asset by ID.
    """
    asset = crud.asset.get(db, id=asset_id)
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The asset does not exist",
        )
    
    # Check permissions
    if not crud.user.is_superuser(current_user) and asset.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this asset",
        )
    
    return asset

@router.put("/{asset_id}", response_model=schemas.Asset)
def update_asset(
    *,
    db: Session = Depends(deps.get_db),
    asset_id: int,
    asset_in: schemas.AssetUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update an asset.
    """
    asset = crud.asset.get(db, id=asset_id)
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The asset does not exist",
        )
    
    # Check permissions
    if not crud.user.is_superuser(current_user) and asset.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this asset",
        )
    
    # Update the asset
    asset = crud.asset.update(db, db_obj=asset, obj_in=asset_in)
    
    return asset

@router.delete("/{asset_id}", response_model=schemas.Asset)
def delete_asset(
    *,
    db: Session = Depends(deps.get_db),
    asset_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete an asset.
    """
    asset = crud.asset.get(db, id=asset_id)
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The asset does not exist",
        )
    
    # Check permissions
    if not crud.user.is_superuser(current_user) and asset.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this asset",
        )
    
    # Delete the asset
    asset = crud.asset.remove(db=db, id=asset_id)
    return asset

# Inventory Items
@router.get("/inventory/", response_model=List[schemas.InventoryItem])
def read_inventory_items(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve inventory items.
    """
    # Regular users can only see their own inventory items
    if not crud.user.is_superuser(current_user):
        inventory_items = crud.inventory_item.get_multi_by_owner(
            db, owner_id=current_user.id, skip=skip, limit=limit
        )
    # Admins can see all inventory items
    else:
        inventory_items = crud.inventory_item.get_multi(db, skip=skip, limit=limit)
    
    return inventory_items

@router.post("/inventory/", response_model=schemas.InventoryItem, status_code=status.HTTP_201_CREATED)
def create_inventory_item(
    *,
    db: Session = Depends(deps.get_db),
    inventory_item_in: schemas.InventoryItemCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new inventory item.
    """
    # Only admins can create inventory items for other users' assets
    if inventory_item_in.asset_id:
        asset = crud.asset.get(db, id=inventory_item_in.asset_id)
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="The specified asset does not exist",
            )
        if not crud.user.is_superuser(current_user) and asset.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to add inventory to this asset",
            )
    
    # Create the inventory item
    inventory_item = crud.inventory_item.create(
        db=db, obj_in=inventory_item_in
    )
    
    return inventory_item

@router.get("/inventory/{item_id}", response_model=schemas.InventoryItem)
def read_inventory_item(
    *,
    db: Session = Depends(deps.get_db),
    item_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get inventory item by ID.
    """
    inventory_item = crud.inventory_item.get(db, id=item_id)
    if not inventory_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The inventory item does not exist",
        )
    
    # Check permissions if the item is associated with an asset
    if inventory_item.asset_id:
        asset = crud.asset.get(db, id=inventory_item.asset_id)
        if not crud.user.is_superuser(current_user) and asset.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to access this inventory item",
            )
    
    return inventory_item

@router.put("/inventory/{item_id}", response_model=schemas.InventoryItem)
def update_inventory_item(
    *,
    db: Session = Depends(deps.get_db),
    item_id: int,
    inventory_item_in: schemas.InventoryItemUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update an inventory item.
    """
    inventory_item = crud.inventory_item.get(db, id=item_id)
    if not inventory_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The inventory item does not exist",
        )
    
    # Check permissions if the item is associated with an asset
    if inventory_item.asset_id:
        asset = crud.asset.get(db, id=inventory_item.asset_id)
        if not crud.user.is_superuser(current_user) and asset.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to update this inventory item",
            )
    
    # Update the inventory item
    inventory_item = crud.inventory_item.update(
        db, db_obj=inventory_item, obj_in=inventory_item_in
    )
    
    return inventory_item

@router.delete("/inventory/{item_id}", response_model=schemas.InventoryItem)
def delete_inventory_item(
    *,
    db: Session = Depends(deps.get_db),
    item_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete an inventory item.
    """
    inventory_item = crud.inventory_item.get(db, id=item_id)
    if not inventory_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The inventory item does not exist",
        )
    
    # Check permissions if the item is associated with an asset
    if inventory_item.asset_id:
        asset = crud.asset.get(db, id=inventory_item.asset_id)
        if not crud.user.is_superuser(current_user) and asset.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to delete this inventory item",
            )
    
    # Delete the inventory item
    inventory_item = crud.inventory_item.remove(db=db, id=item_id)
    return inventory_item
