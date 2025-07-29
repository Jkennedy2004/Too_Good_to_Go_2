from sqlalchemy.orm import Session
from app.models import Restaurante # Asegúrate que esta importación sea correcta
from app.schemas import RestauranteCreate, RestauranteUpdate # Asegúrate que esta importación sea correcta
import requests # Importa la librería requests para hacer peticiones HTTP
import os # Para leer variables de entorno
import logging # Para logging

# Configuración del logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(_name_)

# URL del endpoint HTTP de tu servicio de notificaciones
# ¡IMPORTANTE! En un entorno real, usa variables de entorno.
# Asegúrate de que esta variable de entorno esté definida en el entorno donde corra tu app Python.
NOTIFICATION_SERVICE_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:3011/send-notification") 

def _send_notification(user_id: str, message: str, notification_type: str, data: dict = None):
    """
    Función auxiliar para enviar una notificación al servicio de notificaciones.
    """
    if data is None:
        data = {}
    
    payload = {
        "user_id": user_id,
        "message": message,
        "type": notification_type,
        "data": data
    }
    
    try:
        response = requests.post(NOTIFICATION_SERVICE_URL, json=payload, timeout=5) # Añadir timeout
        response.raise_for_status() # Lanza una excepción para códigos de estado HTTP 4xx/5xx
        logger.info(f"Notificación enviada con éxito para usuario {user_id} (tipo: {notification_type}).")
    except requests.exceptions.Timeout:
        logger.error(f"Timeout al enviar notificación a {NOTIFICATION_SERVICE_URL}")
    except requests.exceptions.RequestException as e:
        logger.error(f"Error al enviar notificación al servicio de notificaciones: {e}")
        if e.response:
            logger.error(f"Detalles del error de respuesta: {e.response.status_code} - {e.response.text}")
    except Exception as e:
        logger.error(f"Error inesperado al enviar notificación: {e}")


def get_restaurante(db: Session, restaurante_id: int):
    return db.query(Restaurante).filter(Restaurante.id == restaurante_id).first()

def get_restaurantes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Restaurante).offset(skip).limit(limit).all()

def create_restaurante(db: Session, restaurante: RestauranteCreate):
    db_restaurante = Restaurante(
        nombre=restaurante.nombre,
        direccion=restaurante.direccion,
        telefono=restaurante.telefono,
        email=restaurante.email
    )
    db.add(db_restaurante)
    db.commit()
    db.refresh(db_restaurante)
    
    # --- Notificación después de crear un restaurante ---
    # Notificar a un administrador o a un sistema de gestión de restaurantes
    # Puedes usar un ID fijo para pruebas, o un ID de administrador real.
    _send_notification(
        user_id="admin_restaurantes", # ID del usuario/grupo a notificar
        message=f"¡Nuevo restaurante '{db_restaurante.nombre}' (ID: {db_restaurante.id}) ha sido registrado!",
        notification_type="new_restaurante_registered",
        data={"restaurante_id": db_restaurante.id, "nombre": db_restaurante.nombre, "email": db_restaurante.email}
    )
    
    return db_restaurante

def update_restaurante(db: Session, restaurante_id: int, restaurante_update: RestauranteUpdate):
    db_restaurante = db.query(Restaurante).filter(Restaurante.id == restaurante_id).first()
    if db_restaurante:
        # Guardar el estado anterior para comparar si es necesario
        old_email = db_restaurante.email 
        old_nombre = db_restaurante.nombre

        update_data = restaurante_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_restaurante, key, value)
        
        db.commit()
        db.refresh(db_restaurante)

        # --- Notificación después de actualizar un restaurante ---
        message = f"El restaurante '{db_restaurante.nombre}' (ID: {db_restaurante.id}) ha sido actualizado."
        notification_type = "restaurante_updated"
        
        # Ejemplo: Notificar si el email o nombre cambiaron
        if 'email' in update_data and update_data['email'] != old_email:
            message += f" El email cambió de '{old_email}' a '{db_restaurante.email}'."
            notification_type = "restaurante_email_changed"
        elif 'nombre' in update_data and update_data['nombre'] != old_nombre:
            message += f" El nombre cambió de '{old_nombre}' a '{db_restaurante.nombre}'."
            notification_type = "restaurante_name_changed"

        _send_notification(
            user_id="admin_restaurantes", # ID del usuario/grupo a notificar
            message=message,
            notification_type=notification_type,
            data={"restaurante_id": db_restaurante.id, "nombre": db_restaurante.nombre, "email": db_restaurante.email, "updated_fields": list(update_data.keys())}
        )
    return db_restaurante

def delete_restaurante(db: Session, restaurante_id: int):
    db_restaurante = db.query(Restaurante).filter(Restaurante.id == restaurante_id).first()
    if db_restaurante:
        restaurante_nombre = db_restaurante.nombre # Guardar el nombre antes de eliminar
        db.delete(db_restaurante)
        db.commit()
        
        # --- Notificación después de eliminar un restaurante ---
        _send_notification(
            user_id="admin_restaurantes", # ID del usuario/grupo a notificar
            message=f"El restaurante '{restaurante_nombre}' (ID: {restaurante_id}) ha sido eliminado.",
            notification_type="restaurante_deleted",
            data={"restaurante_id": restaurante_id, "nombre_eliminado": restaurante_nombre}
        )
    return db_restaurante
