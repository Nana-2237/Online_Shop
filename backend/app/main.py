from fastapi import FastAPI

from app.database import create_tables
from app.routes import products
from app.routes import auth as auth_router


create_tables()

app = FastAPI(title="Gaming Shop API")

app.include_router(products.router)
app.include_router(auth_router.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}