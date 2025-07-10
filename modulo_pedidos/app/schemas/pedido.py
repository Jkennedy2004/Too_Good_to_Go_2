from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Importar los esquemas reales para que Pydantic pueda procesarlos
from .detalle_pedido import DetallePedidoInDB, DetallePedidoCreate

class PedidoBase(BaseModel):
    usuario_id: int
    restaurante_id: int
    estado: Optional[str] = "pendiente"
    total: Optional[float] = 0.0

class PedidoCreate(PedidoBase):
    detalles: List[DetallePedidoCreate]

class PedidoUpdate(BaseModel):
    estado: Optional[str] = None
    total: Optional[float] = None

class PedidoInDB(PedidoBase):
    id: int
    fecha_creacion: datetime
    detalles_pedido: List[DetallePedidoInDB] = []

    class Config:
        from_attributes = True

# Reconstruir los modelos para evitar errores en Pydantic v2
DetallePedidoCreate.model_rebuild()
DetallePedidoInDB.model_rebuild()
PedidoCreate.model_rebuild()
PedidoInDB.model_rebuild()
