from fastapi import APIRouter

from . import usuario, restaurante, producto, pedido, detalle_pedido

api_router = APIRouter()
api_router.include_router(usuario.router)
api_router.include_router(restaurante.router)
api_router.include_router(producto.router)
api_router.include_router(pedido.router)
api_router.include_router(detalle_pedido.router)