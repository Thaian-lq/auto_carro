from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth_routes, veiculo_routes, chat_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AutoCare API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(veiculo_routes.router)
app.include_router(chat_routes.router)

@app.get("/")
def raiz():
    return {"status": "AutoCare API rodando"}