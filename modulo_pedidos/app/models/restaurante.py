from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Restaurante(Base):
    __tablename__ = "restaurantes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    direccion = Column(String)
    telefono = Column(String)
    email = Column(String, unique=True, index=True)

    productos = relationship("Producto", back_populates="restaurante")
    pedidos = relationship("Pedido", back_populates="restaurante")