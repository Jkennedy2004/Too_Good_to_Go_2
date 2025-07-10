from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    restaurante_id = Column(Integer, ForeignKey("restaurantes.id")) # Un pedido es de un restaurante
    fecha_creacion = Column(DateTime, server_default=func.now())
    estado = Column(String, default="pendiente") # Ej: "pendiente", "confirmado", "entregado", "cancelado"
    total = Column(Float) # Se calculará a partir de los detalles del pedido

    usuario = relationship("Usuario", back_populates="pedidos")
    restaurante = relationship("Restaurante", back_populates="pedidos")
    detalles_pedido = relationship("DetallePedido", back_populates="pedido")