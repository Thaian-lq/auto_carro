from pydantic import BaseModel, EmailStr
from datetime import datetime

class UsuarioCreate(BaseModel):
    nome : str
    email : str
    senha : str

class UsuarioLogin(BaseModel):
    email : EmailStr
    senha : str

class UsuarioOut(BaseModel):
    id: int
    nome: str
    email: EmailStr
    criado_em: datetime

    class Config:
        from_attributes = False

class Token(BaseModel):
    access_token : str
    token_type : str

class VeiculoCreate(BaseModel):
    tipo: str
    marca: str
    modelo: str
    ano: int
    km_atual: int

class VeiculoOut(BaseModel):
    id: int
    tipo: str
    marca: str
    modelo: str
    ano: int
    km_atual: int
    criado_em: datetime

    class Config:
        from_attributes = True

class ComponenteOut(BaseModel):
    id: int
    nome: str
    area: str
    intervalo_km: int | None
    intervalo_meses: int | None

    class Config:
        from_attributes = True


class TrocaCreate(BaseModel):
    componente_id: int
    data_troca: datetime
    km_na_troca: int


class TrocaOut(BaseModel):
    id: int
    componente_id: int
    data_troca: datetime
    km_na_troca: int
    criado_em: datetime

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    pergunta: str
    contexto: str | None = None

class ChatResponse(BaseModel):
    resposta: str