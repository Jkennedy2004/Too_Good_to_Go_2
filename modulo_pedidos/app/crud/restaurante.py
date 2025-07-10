from sqlalchemy.orm import Session
from app.models import Restaurante
from app.schemas import RestauranteCreate, RestauranteUpdate

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
    return db_restaurante

def update_restaurante(db: Session, restaurante_id: int, restaurante: RestauranteUpdate):
    db_restaurante = db.query(Restaurante).filter(Restaurante.id == restaurante_id).first()
    if db_restaurante:
        for key, value in restaurante.dict(exclude_unset=True).items():
            setattr(db_restaurante, key, value)
        db.commit()
        db.refresh(db_restaurante)
    return db_restaurante

def delete_restaurante(db: Session, restaurante_id: int):
    db_restaurante = db.query(Restaurante).filter(Restaurante.id == restaurante_id).first()
    if db_restaurante:
        db.delete(db_restaurante)
        db.commit()
    return db_restaurante