from fastapi import FastAPI
from sqlalchemy import text

from app.database import Base, engine
from app import models
from app.routes import products


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gaming Shop API")

app.include_router(products.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}