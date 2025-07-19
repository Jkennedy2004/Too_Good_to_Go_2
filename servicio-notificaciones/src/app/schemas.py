from pydantic import BaseModel, Field
from typing import Any, Optional

# Modelo para la petición HTTP que otros microservicios enviarán
class SendNotificationRequest(BaseModel):
    user_id: str = Field(..., example="user123", description="ID del usuario al que va dirigida la notificación. Usar 'all' para broadcast.")
    message: str = Field(..., example="Tu pedido #123 ha sido enviado.", description="Contenido principal de la notificación.")
    type: str = Field(..., example="order_update", description="Tipo de notificación (ej. 'order_update', 'new_offer').")
    data: Optional[Any] = Field(None, example={"order_id": "123", "status": "shipped"}, description="Datos adicionales relevantes para la notificación.")

# Modelo para el formato de mensaje que se enviará a través de WebSocket
class WebSocketMessage(BaseModel):
    user_id: str
    message: str
    type: str
    data: Optional[Any] = None
    timestamp: Optional[str] = None # Se añadirá al momento de enviar