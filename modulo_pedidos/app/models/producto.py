from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(String)
    precio_regular = Column(Float)
    restaurante_id = Column(Integer, ForeignKey("restaurantes.id"))

    restaurante = relationship("Restaurante", back_populates="productos")
    detalles_pedido = relationship("DetallePedido", back_populates="producto")