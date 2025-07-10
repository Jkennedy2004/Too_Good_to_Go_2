from sqlalchemy.orm import Session
from app.models import DetallePedido
from app.schemas import DetallePedidoCreate, DetallePedidoUpdate

def get_detalle_pedido(db: Session, detalle_pedido_id: int):
    return db.query(DetallePedido).filter(DetallePedido.id == detalle_pedido_id).first()

def get_detalles_pedido_by_pedido(db: Session, pedido_id: int, skip: int = 0, limit: int = 100):
    return db.query(DetallePedido).filter(DetallePedido.pedido_id == pedido_id).offset(skip).limit(limit).all()

def create_detalle_pedido(db: Session, detalle_pedido: DetallePedidoCreate, pedido_id: int):
    db_detalle_pedido = DetallePedido(
        pedido_id=pedido_id,
        producto_id=detalle_pedido.producto_id,
        oferta_reducida_id=detalle_pedido.oferta_reducida_id,
        cantidad=detalle_pedido.cantidad,
        precio_unitario=detalle_pedido.precio_unitario,
        subtotal=detalle_pedido.subtotal
    )
    db.add(db_detalle_pedido)
    db.commit()
    db.refresh(db_detalle_pedido)
    return db_detalle_pedido

def update_detalle_pedido(db: Session, detalle_pedido_id: int, detalle_pedido: DetallePedidoUpdate):
    db_detalle_pedido = db.query(DetallePedido).filter(DetallePedido.id == detalle_pedido_id).first()
    if db_detalle_pedido:
        for key, value in detalle_pedido.dict(exclude_unset=True).items():
            setattr(db_detalle_pedido, key, value)
        db.commit()
        db.refresh(db_detalle_pedido)
    return db_detalle_pedido

def delete_detalle_pedido(db: Session, detalle_pedido_id: int):
    db_detalle_pedido = db.query(DetallePedido).filter(DetallePedido.id == detalle_pedido_id).first()
    if db_detalle_pedido:
        db.delete(db_detalle_pedido)
        db.commit()
    return db_detalle_pedido