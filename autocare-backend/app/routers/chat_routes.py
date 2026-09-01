from fastapi import APIRouter, Depends
from app.auth import get_usuario_atual
from app.models import Usuario
from app.schemas import ChatRequest, ChatResponse
from app.chat import gerar_resposta

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/", response_model=ChatResponse)
def conversar(dados: ChatRequest, usuario: Usuario = Depends(get_usuario_atual)):
    resposta = gerar_resposta(dados.pergunta, dados.contexto or "")
    return {"resposta": resposta}