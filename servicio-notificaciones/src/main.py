import uvicorn
# CAMBIA ESTAS LÍNEAS PARA ELIMINAR EL PREFIJO 'src.'
from app.main import app  # Antes: from src.app.main import app
from config import HTTP_PORT # Antes: from src.config import HTTP_PORT

if __name__ == "__main__":
    print(f"Iniciando el Servicio de Notificaciones (FastAPI/Uvicorn) en el puerto: {HTTP_PORT}")
    print(f"Endpoint HTTP para enviar notificaciones: POST http://localhost:{HTTP_PORT}/send-notification")
    print(f"Endpoint WebSocket para clientes: ws://localhost:{HTTP_PORT}/ws/{{user_id}}")
    print(f"\nPara probar el WebSocket en el navegador, visita http://localhost:{HTTP_PORT}")
    
    uvicorn.run(app, host="0.0.0.0", port=HTTP_PORT)