from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from app.database import SessionLocal

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = HTTPBearer()

SECRET_KEY = "trocar-essa-chave-depois-por-uma-de-verdade" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 


def gerar_hash_senha(senha: str) -> str:
    return pwd_context.hash(senha)


def verificar_senha(senha_texto: str, senha_hash: str) -> bool:
    return pwd_context.verify(senha_texto, senha_hash)


def criar_token(dados: dict) -> str:
    to_encode = dados.copy()
    expira = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expira})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verificar_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_usuario_atual(credenciais = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from app.models import Usuario

    token = credenciais.credentials 

    credenciais_invalidas = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = verificar_token(token)
    if payload is None:
        raise credenciais_invalidas

    email = payload.get("sub")
    if email is None:
        raise credenciais_invalidas

    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if usuario is None:
        raise credenciais_invalidas

    return usuario