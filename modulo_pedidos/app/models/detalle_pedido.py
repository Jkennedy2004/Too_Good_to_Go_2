from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class DetallePedido(Base):
    __tablename__ = "detalles_pedido"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"))
    producto_id = Column(Integer, ForeignKey("productos.id"))
    # Opcional: Si el detalle del pedido corresponde a una oferta específica del otro módulo
    oferta_reducida_id = Column(Integer, nullable=True)
    cantidad = Column(Integer)
    precio_unitario = Column(Float) # Precio al momento de la compra (podría ser reducido)
    subtotal = Column(Float)

    pedido = relationship("Pedido", back_populates="detalles_pedido")
    producto = relationship("Producto", back_populates="detalles_pedido")
    # No hay relación directa a OfertaReducida aquí, ya que está en otro microservicio.
    # Simplemente almacenamos el ID para referencia.