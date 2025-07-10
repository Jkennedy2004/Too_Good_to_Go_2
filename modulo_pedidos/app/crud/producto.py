from sqlalchemy.orm import Session
from app.models import Producto
from app.schemas import ProductoCreate, ProductoUpdate

def get_producto(db: Session, producto_id: int):
    return db.query(Producto).filter(Producto.id == producto_id).first()

def get_productos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Producto).offset(skip).limit(limit).all()

def get_productos_by_restaurante(db: Session, restaurante_id: int, skip: int = 0, limit: int = 100):
    return db.query(Producto).filter(Producto.restaurante_id == restaurante_id).offset(skip).limit(limit).all()

def create_producto(db: Session, producto: ProductoCreate):
    db_producto = Producto(
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio_regular=producto.precio_regular,
        restaurante_id=producto.restaurante_id
    )
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

def update_producto(db: Session, producto_id: int, producto: ProductoUpdate):
    db_producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if db_producto:
        for key, value in producto.dict(exclude_unset=True).items():
            setattr(db_producto, key, value)
        db.commit()
        db.refresh(db_producto)
    return db_producto

def delete_producto(db: Session, producto_id: int):
    db_producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if db_producto:
        db.delete(db_producto)
        db.commit()
    return db_producto