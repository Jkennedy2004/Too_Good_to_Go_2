from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import crud, schemas
from app.database import get_db

router = APIRouter(
    prefix="/pedidos",
    tags=["Pedidos"]
)

@router.post("/", response_model=schemas.PedidoInDB, status_code=status.HTTP_201_CREATED)
def create_pedido(pedido: schemas.PedidoCreate, db: Session = Depends(get_db)):
    # Validaciones previas
    db_usuario = crud.get_usuario(db, usuario_id=pedido.usuario_id)
    if not db_usuario:
        raise HTTPException(status_code=400, detail="El usuario no existe")

    db_restaurante = crud.get_restaurante(db, restaurante_id=pedido.restaurante_id)
    if not db_restaurante:
        raise HTTPException(status_code=400, detail="El restaurante no existe")

    # Asegurarse de que los productos en los detalles existan y pertenezcan al restaurante
    for detalle_data in pedido.detalles:
        db_producto = crud.get_producto(db, producto_id=detalle_data.producto_id)
        if not db_producto or db_producto.restaurante_id != pedido.restaurante_id:
            raise HTTPException(status_code=400, detail=f"Producto con ID {detalle_data.producto_id} no válido para este restaurante.")

    # Calcular subtotal para cada detalle y el total del pedido
    for detalle_data in pedido.detalles:
        db_producto = crud.get_producto(db, producto_id=detalle_data.producto_id)
        # Si hay oferta_reducida_id, podríamos querer obtener el precio de esa oferta desde el otro módulo
        # Por ahora, usaremos el precio_unitario proporcionado en el esquema, que debería venir
        # ya sea del precio regular o del precio de oferta.
        detalle_data.subtotal = detalle_data.cantidad * detalle_data.precio_unitario

    db_pedido = crud.create_pedido(db=db, pedido=pedido)
    return db_pedido

@router.get("/", response_model=List[schemas.PedidoInDB])
def read_pedidos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    pedidos = crud.get_pedidos(db, skip=skip, limit=limit)
    return pedidos

@router.get("/{pedido_id}", response_model=schemas.PedidoInDB)
def read_pedido(pedido_id: int, db: Session = Depends(get_db)):
    db_pedido = crud.get_pedido(db, pedido_id=pedido_id)
    if db_pedido is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return db_pedido

@router.get("/usuario/{usuario_id}", response_model=List[schemas.PedidoInDB])
def read_pedidos_by_usuario(usuario_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    pedidos = crud.get_pedidos_by_usuario(db, usuario_id=usuario_id, skip=skip, limit=limit)
    if not pedidos:
        raise HTTPException(status_code=404, detail="No se encontraron pedidos para este usuario")
    return pedidos

@router.put("/{pedido_id}", response_model=schemas.PedidoInDB)
def update_pedido(pedido_id: int, pedido: schemas.PedidoUpdate, db: Session = Depends(get_db)):
    db_pedido = crud.update_pedido(db, pedido_id=pedido_id, pedido=pedido)
    if db_pedido is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return db_pedido

@router.delete("/{pedido_id}", response_model=schemas.PedidoInDB)
def delete_pedido(pedido_id: int, db: Session = Depends(get_db)):
    db_pedido = crud.delete_pedido(db, pedido_id=pedido_id)
    if db_pedido is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return db_pedido