from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())


class Veiculo(Base):
    __tablename__ = "veiculos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    tipo = Column(String, nullable=False)
    marca = Column(String, nullable=False)
    modelo = Column(String, nullable=False)
    ano = Column(Integer, nullable=False)
    km_atual = Column(Integer, nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())


class Componente(Base):
    __tablename__ = "componentes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    area = Column(String, nullable=False)
    intervalo_km = Column(Integer, nullable=True)
    intervalo_meses = Column(Integer, nullable=True)


class Troca(Base):
    __tablename__ = "trocas"

    id = Column(Integer, primary_key=True, index=True)
    veiculo_id = Column(Integer, ForeignKey("veiculos.id"), nullable=False)
    componente_id = Column(Integer, ForeignKey("componentes.id"), nullable=False)
    data_troca = Column(DateTime(timezone=True), nullable=False)
    km_na_troca = Column(Integer, nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())