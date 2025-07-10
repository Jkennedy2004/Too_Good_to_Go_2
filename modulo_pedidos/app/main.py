from fastapi import FastAPI
from app.database import engine, Base  # ✅ Importa Base desde database.py
from app import models
from app.routers import api_router

# Crea las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)  # ✅ Ahora sí funciona

app = FastAPI(
    title="Módulo de Pedidos - Too Good To Go",
    description="API para gestionar usuarios, restaurantes, productos y pedidos.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido al Módulo de Pedidos de Too Good To Go"}
