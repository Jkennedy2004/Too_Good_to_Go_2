import os
from dotenv import load_dotenv

# Carga las variables de entorno desde el archivo .env
load_dotenv()

# Define los puertos, usando valores por defecto si no están en .env
WS_PORT = int(os.getenv("WS_PORT", 3010))
HTTP_PORT = int(os.getenv("HTTP_PORT", 3011))