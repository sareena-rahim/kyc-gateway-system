from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine.url import URL

engine = create_engine(URL.create(
    drivername="mysql+pymysql",
    username="root",
    password="Anusha@116",
    host="192.168.0.173",
    port=3306,
    database="kyc_gateway_system"
))

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()