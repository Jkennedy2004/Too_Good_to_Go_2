from pydantic import BaseModel
from typing import Optional

class ProductoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio_regular: float
    restaurante_id: int

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(ProductoBase):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_regular: Optional[float] = None
    restaurante_id: Optional[int] = None # No debería cambiar un restaurante_id de un producto existente, pero se pone por si acaso

class ProductoInDB(ProductoBase):
    id: int

    class Config:
        from_attributes = True

ProductoInDB.model_rebuild()
