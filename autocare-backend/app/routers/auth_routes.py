from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Usuario
from app.schemas import UsuarioCreate, UsuarioLogin, UsuarioOut, Token
from app.auth import gerar_hash_senha, verificar_senha, criar_token

router = APIRouter(prefix="/auth", tags=["Autenticação"])

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally: 
        db.close()

@router.post('/registro', response_model= UsuarioOut)
def registrar( usuario: UsuarioCreate, db: Session = Depends(get_db) ):
    existe = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if existe:
        raise HTTPException(status_code=400, detail="Email já cadastrado!")

    novo_usuario = Usuario(
        nome = usuario.nome,
        email = usuario.email,
        senha_hash = gerar_hash_senha(usuario.senha)
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario


@router.post('/login', response_model = Token)
def login(dados: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == dados.email).first()

    if not usuario or not verificar_senha(dados.senha, usuario.senha_hash):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")

    token = criar_token({"sub": usuario.email})
    return {"access_token": token, "token_type": "bearer"}