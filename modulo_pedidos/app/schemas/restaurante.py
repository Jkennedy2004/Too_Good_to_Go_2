from pydantic import BaseModel, EmailStr
from typing import Optional

class RestauranteBase(BaseModel):
    nombre: str
    direccion: str
    telefono: Optional[str] = None
    email: EmailStr

class RestauranteCreate(RestauranteBase):
    pass

class RestauranteUpdate(RestauranteBase):
    nombre: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[EmailStr] = None

class RestauranteInDB(RestauranteBase):
    id: int

    class Config:
        from_attributes = True

RestauranteInDB.model_rebuild()
