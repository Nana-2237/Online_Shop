from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_tables
from app.routes import products
from app.routes import auth as auth_router
from app.routes import cart
from app.routes import orders
from app.routes import admin_users
from app.routes import events


create_tables()

app = FastAPI(title="Gaming Shop API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(auth_router.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(admin_users.router)
app.include_router(events.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
    
@app.get("/health2")
def health_check2():
    return {"status": "okok"}