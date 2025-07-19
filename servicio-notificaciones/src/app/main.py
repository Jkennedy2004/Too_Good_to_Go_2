# servicio-notificaciones/src/app/main.py

import json
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

from websocket_manager.manager import websocket_manager
from app.schemas import SendNotificationRequest, WebSocketMessage
import config 


app = FastAPI(
    title="Servicio de Notificaciones (WebSocket)",
    description="Microservicio para gestionar y enviar notificaciones en tiempo real a través de WebSockets y HTTP."
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint HTTP para recibir notificaciones de otros microservicios
@app.post("/send-notification", status_code=status.HTTP_200_OK)
async def send_notification_http(request: SendNotificationRequest):
    try:
        notification_data = WebSocketMessage(
            user_id=request.user_id,
            message=request.message,
            type=request.type,
            data=request.data,
            timestamp=str(asyncio.current_task()._loop.time())
        )
        
        json_message = notification_data.model_dump_json()

        if request.user_id.lower() == "all":
            await websocket_manager.broadcast(json_message)
        else:
            await websocket_manager.send_personal_message(json_message, request.user_id)

        return {"status": "success", "message": "Notification processed and sent"}
    except Exception as e:
        print(f"Error al procesar y enviar notificación: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error sending notification: {e}")

# Endpoint WebSocket para que los clientes frontend se conecten
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept() # <--- ¡¡¡AÑADE ESTA LÍNEA AQUÍ!!!
    await websocket_manager.connect(websocket, user_id)
    try:
        while True:
            # Puedes recibir mensajes del cliente si tu aplicación lo necesita,
            # pero para notificaciones push, esta línea a veces solo espera.
            data = await websocket.receive_text()
            print(f"Mensaje recibido de {user_id}: {data}") 
    except WebSocketDisconnect:
        print(f"Cliente WebSocket '{user_id}' desconectado.")
    except Exception as e:
        print(f"Error inesperado en WebSocket de '{user_id}': {e}")
    finally:
        await websocket_manager.disconnect(websocket, user_id)

# (Opcional) Una página HTML simple para probar la conexión WebSocket desde el navegador
@app.get("/", response_class=HTMLResponse)
async def get_test_page():
    return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>WebSocket Test Page</title>
            <style>body { font-family: sans-serif; margin: 20px; }</style>
        </head>
        <body>
            <h1>Servicio de Notificaciones</h1>
            <p>Estado de la conexión: <span id="status" style="color: red;">Desconectado</span></p>
            <div id="messages"></div>
            <script>
                const userId = prompt("Ingresa tu User ID para el WebSocket:");
                const wsUrl = `ws://localhost:""" + str(config.HTTP_PORT) + """/ws/${userId}`;
                const ws = new WebSocket(wsUrl);
                const statusSpan = document.getElementById('status');
                const messagesDiv = document.getElementById('messages');

                ws.onopen = function(event) {
                    console.log("Conectado al WebSocket!", event);
                    statusSpan.textContent = "Conectado";
                    statusSpan.style.color = "green";
                };

                ws.onmessage = function(event) {
                    console.log("Mensaje del servidor:", event.data);
                    const p = document.createElement('p');
                    p.textContent = `Notificación: ${event.data}`;
                    messagesDiv.appendChild(p);
                };

                ws.onclose = function(event) {
                    console.log("Desconectado del WebSocket.", event);
                    statusSpan.textContent = "Desconectado";
                    statusSpan.style.color = "red";
                };

                ws.onerror = function(error) {
                    console.error("Error WebSocket:", error);
                    statusSpan.textContent = "Error";
                    statusSpan.style.color = "orange";
                };
            </script>
        </body>
        </html>
    """