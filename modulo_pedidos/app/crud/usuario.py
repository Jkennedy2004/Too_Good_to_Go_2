from sqlalchemy.orm import Session
from app.models import Usuario
from app.schemas import UsuarioCreate, UsuarioUpdate

def get_usuario(db: Session, usuario_id: int):
    return db.query(Usuario).filter(Usuario.id == usuario_id).first()

def get_usuario_by_email(db: Session, email: str):
    return db.query(Usuario).filter(Usuario.email == email).first()

def get_usuarios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Usuario).offset(skip).limit(limit).all()

def create_usuario(db: Session, usuario: UsuarioCreate):
    # NOTA: Aquí deberías hashear la contraseña antes de guardarla
    fake_hashed_password = usuario.password + "notreallyhashed" # Ejemplo, usar librerías de hashing
    db_usuario = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        hashed_password=fake_hashed_password,
        direccion=usuario.direccion,
        telefono=usuario.telefono
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

def update_usuario(db: Session, usuario_id: int, usuario: UsuarioUpdate):
    db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if db_usuario:
        for key, value in usuario.dict(exclude_unset=True).items():
            if key == "password":
                db_usuario.hashed_password = value + "notreallyhashed" # Hashear nueva contraseña
            else:
                setattr(db_usuario, key, value)
        db.commit()
        db.refresh(db_usuario)
    return db_usuario

def delete_usuario(db: Session, usuario_id: int):
    db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if db_usuario:
        db.delete(db_usuario)
        db.commit()
    return db_usuario