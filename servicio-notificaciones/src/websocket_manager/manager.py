import asyncio
import json
from typing import List, Dict, Optional
from fastapi import WebSocket 
# --- ¡AÑADE ESTA IMPORTACIÓN! ---
from starlette.websockets import WebSocketState # Para comparar los estados del WebSocket

class ConnectionManager:
    def __init__(self):
        self.all_connections: List[WebSocket] = []
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str = "anon"):
        self.all_connections.append(websocket)
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        print(f"Cliente conectado: {user_id}. Total: {len(self.all_connections)} conexiones activas.")

    async def disconnect(self, websocket: WebSocket, user_id: str = "anon"):
        if websocket in self.all_connections:
            self.all_connections.remove(websocket)
        
        if user_id in self.active_connections and websocket in self.active_connections[user_id]:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        print(f"Cliente desconectado: {user_id}. Total: {len(self.all_connections)} conexiones restantes.")

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                # DEBUG: Ahora imprimimos también el valor numérico para mayor claridad
                print(f"DEBUG: Intentando enviar a {user_id}. Estado de conexión: {connection.client_state} (Valor: {connection.client_state.value})") 
                try:
                    # --- ¡CAMBIA ESTA LÍNEA! ---
                    if connection.client_state == WebSocketState.CONNECTED: # Comparar directamente con el Enum
                        await connection.send_text(message) 
                        print(f"Mensaje enviado a {user_id}: {message[:50]}...")
                    else:
                        # DEBUG: Mensaje de advertencia actualizado
                        print(f"ADVERTENCIA: Conexión para {user_id} no está en estado CONNECTED (estado actual: {connection.client_state}).")
                except Exception as e:
                    print(f"Error enviando mensaje personal a {user_id}: {e}")
        else:
            print(f"Usuario '{user_id}' no tiene conexiones WebSocket activas.")

    async def broadcast(self, message: str):
        disconnected_connections = []
        for connection in self.all_connections:
            # DEBUG: Ahora imprimimos también el valor numérico para mayor claridad
            print(f"DEBUG: Intentando broadcast. Estado de conexión: {connection.client_state} (Valor: {connection.client_state.value})") 
            try:
                # --- ¡CAMBIA ESTA LÍNEA! ---
                if connection.client_state == WebSocketState.CONNECTED: # Comparar directamente con el Enum
                    await connection.send_text(message) 
                else:
                    # DEBUG: Mensaje de advertencia actualizado
                    print(f"ADVERTENCIA: Conexión para broadcast no está en estado CONNECTED (estado actual: {connection.client_state}).")
            except Exception as e:
                print(f"Error en broadcast, cliente desconectado: {e}")
                disconnected_connections.append(connection)
        
        for conn in disconnected_connections:
            if conn in self.all_connections:
                self.all_connections.remove(conn)
        print(f"Broadcast enviado a {len(self.all_connections)} clientes activos. Mensaje: {message[:50]}...")

websocket_manager = ConnectionManager()