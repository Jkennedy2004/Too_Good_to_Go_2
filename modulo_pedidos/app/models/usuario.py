from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String) # Considera almacenar contraseñas hasheadas
    direccion = Column(String)
    telefono = Column(String)

    pedidos = relationship("Pedido", back_populates="usuario")