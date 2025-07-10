from sqlalchemy.orm import Session
from app.models import Pedido, DetallePedido
from app.schemas import PedidoCreate, PedidoUpdate, DetallePedidoCreate

def get_pedido(db: Session, pedido_id: int):
    return db.query(Pedido).filter(Pedido.id == pedido_id).first()

def get_pedidos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Pedido).offset(skip).limit(limit).all()

def get_pedidos_by_usuario(db: Session, usuario_id: int, skip: int = 0, limit: int = 100):
    return db.query(Pedido).filter(Pedido.usuario_id == usuario_id).offset(skip).limit(limit).all()

def create_pedido(db: Session, pedido: PedidoCreate):
    # Calcular el total del pedido
    total_pedido = 0.0
    for detalle_data in pedido.detalles:
        total_pedido += detalle_data.subtotal

    db_pedido = Pedido(
        usuario_id=pedido.usuario_id,
        restaurante_id=pedido.restaurante_id,
        estado=pedido.estado,
        total=total_pedido
    )
    db.add(db_pedido)
    db.commit()
    db.refresh(db_pedido)

    # Crear los detalles del pedido
    for detalle_data in pedido.detalles:
        db_detalle_pedido = DetallePedido(
            pedido_id=db_pedido.id,
            producto_id=detalle_data.producto_id,
            oferta_reducida_id=detalle_data.oferta_reducida_id,
            cantidad=detalle_data.cantidad,
            precio_unitario=detalle_data.precio_unitario,
            subtotal=detalle_data.subtotal
        )
        db.add(db_detalle_pedido)
    db.commit()
    db.refresh(db_pedido) # Refrescar para que incluya los detalles

    # NOTA IMPORTANTE PARA EL SEGUNDO PARCIAL:
    # Aquí es donde, después de crear el pedido, podrías querer notificar al módulo de ofertas
    # y/o al servicio de notificaciones sobre un nuevo pedido.
    # Por ejemplo, llamando a un endpoint en el servicio de notificaciones.
    # Esto lo veremos más adelante.

    return db_pedido

def update_pedido(db: Session, pedido_id: int, pedido: PedidoUpdate):
    db_pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if db_pedido:
        for key, value in pedido.dict(exclude_unset=True).items():
            setattr(db_pedido, key, value)
        db.commit()
        db.refresh(db_pedido)
    return db_pedido

def delete_pedido(db: Session, pedido_id: int):
    db_pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if db_pedido:
        # También elimina los detalles del pedido asociados
        db.query(DetallePedido).filter(DetallePedido.pedido_id == pedido_id).delete()
        db.delete(db_pedido)
        db.commit()
    return db_pedido