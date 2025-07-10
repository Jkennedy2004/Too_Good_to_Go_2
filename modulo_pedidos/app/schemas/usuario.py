from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr
    direccion: Optional[str] = None
    telefono: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    password: str  # Contraseña en texto plano para crear, luego se hashea

class UsuarioUpdate(UsuarioBase):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None  # Para actualizar contraseña

class UsuarioInDB(UsuarioBase):
    id: int

    class Config:
        from_attributes = True

UsuarioInDB.model_rebuild()
