from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import crud, schemas
from app.database import get_db

router = APIRouter(
    prefix="/productos",
    tags=["Productos"]
)

@router.post("/", response_model=schemas.ProductoInDB)
def create_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    db_restaurante = crud.get_restaurante(db, restaurante_id=producto.restaurante_id)
    if not db_restaurante:
        raise HTTPException(status_code=400, detail="El restaurante no existe")
    return crud.create_producto(db=db, producto=producto)

@router.get("/", response_model=List[schemas.ProductoInDB])
def read_productos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    productos = crud.get_productos(db, skip=skip, limit=limit)
    return productos

@router.get("/{producto_id}", response_model=schemas.ProductoInDB)
def read_producto(producto_id: int, db: Session = Depends(get_db)):
    db_producto = crud.get_producto(db, producto_id=producto_id)
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto

@router.get("/restaurante/{restaurante_id}", response_model=List[schemas.ProductoInDB])
def read_productos_by_restaurante(restaurante_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    productos = crud.get_productos_by_restaurante(db, restaurante_id=restaurante_id, skip=skip, limit=limit)
    if not productos:
        raise HTTPException(status_code=404, detail="No se encontraron productos para este restaurante")
    return productos

@router.put("/{producto_id}", response_model=schemas.ProductoInDB)
def update_producto(producto_id: int, producto: schemas.ProductoUpdate, db: Session = Depends(get_db)):
    db_producto = crud.update_producto(db, producto_id=producto_id, producto=producto)
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto

@router.delete("/{producto_id}", response_model=schemas.ProductoInDB)
def delete_producto(producto_id: int, db: Session = Depends(get_db)):
    db_producto = crud.delete_producto(db, producto_id=producto_id)
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto