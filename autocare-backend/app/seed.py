from app.database import SessionLocal, Base, engine
from app.models import Componente

Base.metadata.create_all(bind=engine)

CATALOGO = [
    {"nome": "Óleo do motor", "area": "motor", "intervalo_km": 10000, "intervalo_meses": 12},
    {"nome": "Filtro de óleo", "area": "motor", "intervalo_km": 10000, "intervalo_meses": 12},
    {"nome": "Velas de ignição", "area": "motor", "intervalo_km": 30000, "intervalo_meses": None},
    {"nome": "Filtro de ar", "area": "motor", "intervalo_km": 15000, "intervalo_meses": None},
    {"nome": "Correia dentada", "area": "motor", "intervalo_km": 60000, "intervalo_meses": None},
    {"nome": "Pneus", "area": "rodas", "intervalo_km": 40000, "intervalo_meses": 60},
    {"nome": "Alinhamento e balanceamento", "area": "rodas", "intervalo_km": 10000, "intervalo_meses": None},
    {"nome": "Rodízio de pneus", "area": "rodas", "intervalo_km": 10000, "intervalo_meses": None},
    {"nome": "Pastilhas de freio", "area": "freios", "intervalo_km": 20000, "intervalo_meses": None},
    {"nome": "Discos de freio", "area": "freios", "intervalo_km": 40000, "intervalo_meses": None},
    {"nome": "Fluido de freio", "area": "freios", "intervalo_km": 20000, "intervalo_meses": 24},
    {"nome": "Bateria", "area": "eletrica", "intervalo_km": None, "intervalo_meses": 30},
    {"nome": "Lâmpadas", "area": "eletrica", "intervalo_km": None, "intervalo_meses": None},
]

def popular():
    db = SessionLocal()
    try:
        if db.query(Componente).count() > 0:
            print("Catálogo já existe, nada a fazer.")
            return

        for item in CATALOGO:
            db.add(Componente(**item))
        db.commit()
        print(f"{len(CATALOGO)} componentes inseridos.")
    finally:
        db.close()

if __name__ == "__main__":
    popular()