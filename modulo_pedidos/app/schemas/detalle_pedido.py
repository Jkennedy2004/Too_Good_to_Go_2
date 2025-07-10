from pydantic import BaseModel
from typing import Optional

class DetallePedidoBase(BaseModel):
    producto_id: int
    cantidad: int
    precio_unitario: float
    subtotal: float
    oferta_reducida_id: Optional[int] = None

class DetallePedidoCreate(DetallePedidoBase):
    pass

class DetallePedidoUpdate(DetallePedidoBase):
    cantidad: Optional[int] = None
    precio_unitario: Optional[float] = None
    subtotal: Optional[float] = None
    oferta_reducida_id: Optional[int] = None

class DetallePedidoInDB(DetallePedidoBase):
    id: int
    pedido_id: int

    class Config:
        from_attributes = True

DetallePedidoBase.model_rebuild()
DetallePedidoCreate.model_rebuild()
DetallePedidoUpdate.model_rebuild()
DetallePedidoInDB.model_rebuild()
