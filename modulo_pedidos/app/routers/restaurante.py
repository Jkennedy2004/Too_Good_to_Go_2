from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import crud, schemas
from app.database import get_db

router = APIRouter(
    prefix="/restaurantes",
    tags=["Restaurantes"]
)

@router.post("/", response_model=schemas.RestauranteInDB)
def create_restaurante(restaurante: schemas.RestauranteCreate, db: Session = Depends(get_db)):
    # Podrías agregar una verificación de email si lo necesitas, similar a usuarios
    return crud.create_restaurante(db=db, restaurante=restaurante)

@router.get("/", response_model=List[schemas.RestauranteInDB])
def read_restaurantes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    restaurantes = crud.get_restaurantes(db, skip=skip, limit=limit)
    return restaurantes

@router.get("/{restaurante_id}", response_model=schemas.RestauranteInDB)
def read_restaurante(restaurante_id: int, db: Session = Depends(get_db)):
    db_restaurante = crud.get_restaurante(db, restaurante_id=restaurante_id)
    if db_restaurante is None:
        raise HTTPException(status_code=404, detail="Restaurante no encontrado")
    return db_restaurante

@router.put("/{restaurante_id}", response_model=schemas.RestauranteInDB)
def update_restaurante(restaurante_id: int, restaurante: schemas.RestauranteUpdate, db: Session = Depends(get_db)):
    db_restaurante = crud.update_restaurante(db, restaurante_id=restaurante_id, restaurante=restaurante)
    if db_restaurante is None:
        raise HTTPException(status_code=404, detail="Restaurante no encontrado")
    return db_restaurante

@router.delete("/{restaurante_id}", response_model=schemas.RestauranteInDB)
def delete_restaurante(restaurante_id: int, db: Session = Depends(get_db)):
    db_restaurante = crud.delete_restaurante(db, restaurante_id=restaurante_id)
    if db_restaurante is None:
        raise HTTPException(status_code=404, detail="Restaurante no encontrado")
    return db_restaurante