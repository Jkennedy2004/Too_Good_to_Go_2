from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import crud, schemas
from app.database import get_db

router = APIRouter(
    prefix="/detalles-pedido",
    tags=["Detalles de Pedido"]
)

# Puedes decidir si permites la creación de detalles de pedido de forma independiente
# o solo como parte de la creación de un pedido completo.
# Para este ejemplo, solo leer y actualizar, ya que la creación se maneja en crud.pedido.create_pedido
# Si necesitas un endpoint POST separado, la lógica sería similar.

@router.get("/pedido/{pedido_id}", response_model=List[schemas.DetallePedidoInDB])
def read_detalles_pedido_by_pedido(pedido_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    db_pedido = crud.get_pedido(db, pedido_id=pedido_id)
    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    detalles = crud.get_detalles_pedido_by_pedido(db, pedido_id=pedido_id, skip=skip, limit=limit)
    return detalles

@router.get("/{detalle_pedido_id}", response_model=schemas.DetallePedidoInDB)
def read_detalle_pedido(detalle_pedido_id: int, db: Session = Depends(get_db)):
    db_detalle = crud.get_detalle_pedido(db, detalle_pedido_id=detalle_pedido_id)
    if db_detalle is None:
        raise HTTPException(status_code=404, detail="Detalle de Pedido no encontrado")
    return db_detalle

@router.put("/{detalle_pedido_id}", response_model=schemas.DetallePedidoInDB)
def update_detalle_pedido(detalle_pedido_id: int, detalle_pedido: schemas.DetallePedidoUpdate, db: Session = Depends(get_db)):
    db_detalle = crud.update_detalle_pedido(db, detalle_pedido_id=detalle_pedido_id, detalle_pedido=detalle_pedido)
    if db_detalle is None:
        raise HTTPException(status_code=404, detail="Detalle de Pedido no encontrado")
    return db_detalle

@router.delete("/{detalle_pedido_id}", response_model=schemas.DetallePedidoInDB)
def delete_detalle_pedido(detalle_pedido_id: int, db: Session = Depends(get_db)):
    db_detalle = crud.delete_detalle_pedido(db, detalle_pedido_id=detalle_pedido_id)
    if db_detalle is None:
        raise HTTPException(status_code=404, detail="Detalle de Pedido no encontrado")
    return db_detalle