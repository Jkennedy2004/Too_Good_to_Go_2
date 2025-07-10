from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de conexión a PostgreSQL
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:1234@localhost:5433/Too_good_to_go"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
    # No se usa connect_args para PostgreSQL
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
