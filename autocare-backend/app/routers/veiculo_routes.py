from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_usuario_atual, get_db
from app.models import Veiculo, Usuario
from app.schemas import VeiculoCreate, VeiculoOut
from app.models import Componente, Troca
from app.schemas import ComponenteOut, TrocaCreate, TrocaOut

router = APIRouter(prefix="/veiculos", tags=["Veículos"])

@router.post("/", response_model=VeiculoOut)
def criar_veiculo(
    veiculo: VeiculoCreate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_usuario_atual),
):
    novo_veiculo = Veiculo(
        usuario_id=usuario.id,
        tipo=veiculo.tipo,
        marca=veiculo.marca,
        modelo=veiculo.modelo,
        ano=veiculo.ano,
        km_atual=veiculo.km_atual,
    )
    db.add(novo_veiculo)
    db.commit()
    db.refresh(novo_veiculo)
    return novo_veiculo

@router.get("/", response_model=list[VeiculoOut])
def listar_veiculos(
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_usuario_atual),
):
    return db.query(Veiculo).filter(Veiculo.usuario_id == usuario.id).all()

@router.delete("/{veiculo_id}")
def deletar_veiculo(
    veiculo_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_usuario_atual),
):
    veiculo = db.query(Veiculo).filter(
        Veiculo.id == veiculo_id,
        Veiculo.usuario_id == usuario.id
    ).first()

    if not veiculo:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    db.delete(veiculo)
    db.commit()
    return {"detail": "Veículo removido com sucesso"}

@router.put("/{veiculo_id}", response_model=VeiculoOut)
def editar_veiculo(
    veiculo_id: int,
    dados: VeiculoCreate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_usuario_atual),
):
    veiculo = db.query(Veiculo).filter(
        Veiculo.id == veiculo_id,
        Veiculo.usuario_id == usuario.id
    ).first()

    if not veiculo:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    veiculo.tipo = dados.tipo
    veiculo.marca = dados.marca
    veiculo.modelo = dados.modelo
    veiculo.ano = dados.ano
    veiculo.km_atual = dados.km_atual

    db.commit()
    db.refresh(veiculo)
    return veiculo

@router.get("/componentes/{area}", response_model=list[ComponenteOut])
def listar_componentes_por_area(area: str, db: Session = Depends(get_db)):
    return db.query(Componente).filter(Componente.area == area).all()


@router.post("/{veiculo_id}/trocas", response_model=TrocaOut)
def registrar_troca(
    veiculo_id: int,
    troca: TrocaCreate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_usuario_atual),
):
    veiculo = db.query(Veiculo).filter(
        Veiculo.id == veiculo_id,
        Veiculo.usuario_id == usuario.id
    ).first()

    if not veiculo:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    nova_troca = Troca(
        veiculo_id=veiculo_id,
        componente_id=troca.componente_id,
        data_troca=troca.data_troca,
        km_na_troca=troca.km_na_troca,
    )
    db.add(nova_troca)
    db.commit()
    db.refresh(nova_troca)
    return nova_troca


@router.get("/{veiculo_id}/trocas", response_model=list[TrocaOut])
def listar_trocas(
    veiculo_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_usuario_atual),
):
    veiculo = db.query(Veiculo).filter(
        Veiculo.id == veiculo_id,
        Veiculo.usuario_id == usuario.id
    ).first()

    if not veiculo:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    return db.query(Troca).filter(Troca.veiculo_id == veiculo_id).all()