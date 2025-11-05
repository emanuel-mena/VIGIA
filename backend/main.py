from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path
import unicodedata
import os

# -----------------------------------------------------------
# CONFIGURACIÓN
# -----------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent  # ← se escribe __file__, no _file_
DATA_FILE_PATH = BASE_DIR / "data.csv"      # ajusta ruta si tu CSV está en otra carpeta

app = FastAPI(
    title="API de Análisis de Contrataciones Públicas",
    description="Servicio web que analiza licitaciones y adjudicaciones a partir de un archivo CSV",
    version="1.0.0"
)

# CORS (permite peticiones desde cualquier origen, útil para dashboards)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------
# FUNCIÓN AUXILIAR DE NORMALIZACIÓN
# -----------------------------------------------------------
def normalizar(texto: str) -> str:
    """Elimina tildes y convierte a minúsculas para comparación flexible."""
    if not isinstance(texto, str):
        return ""
    texto = unicodedata.normalize("NFD", texto)
    texto = texto.encode("ascii", "ignore").decode("utf-8")  # elimina tildes
    return texto.lower().strip()

# -----------------------------------------------------------
# CARGA DE DATOS
# -----------------------------------------------------------
df = pd.DataFrame()

@app.on_event("startup")
async def load_data():
    """Carga el archivo CSV al iniciar el servidor."""
    global df
    try:
        print("📦 Cargando datos...")
        usecols = [
            "Provincia", "Canton", "Distrito", "Institucion",
            "Adjudicatario", "Monto adjudicado en colones"
        ]

        # 🔹 Intentar primero con UTF-8, luego con Latin-1
        try:
            df = pd.read_csv(DATA_FILE_PATH, usecols=usecols, encoding="utf-8-sig")
        except UnicodeDecodeError:
            df = pd.read_csv(DATA_FILE_PATH, usecols=usecols, encoding="latin-1")

        # 🔹 Normalizar texto (quita caracteres invisibles y dobles espacios, pero NO tildes)
        for col in ["Provincia", "Canton", "Distrito", "Institucion", "Adjudicatario"]:
            df[col] = (
                df[col]
                .astype(str)
                .str.normalize("NFKC")   # Normaliza caracteres Unicode sin perder tildes
                .str.strip()             # Quita espacios al inicio y final
                .str.replace(r"\s+", " ", regex=True)  # Colapsa espacios múltiples
            )

        # 🔹 Limpiar la columna de montos
        df["Monto adjudicado en colones"] = (
            df["Monto adjudicado en colones"]
            .astype(str)
            .str.replace(",", ".", regex=False)
            .str.replace(" ", "", regex=False)
        )
        df["Monto adjudicado en colones"] = pd.to_numeric(df["Monto adjudicado en colones"], errors="coerce")

        print(f"✅ Datos cargados correctamente: {len(df):,} registros.")

    except Exception as e:
        print(f"❌ Error al cargar datos: {e}")
        df = pd.DataFrame()

# -----------------------------------------------------------
# ENDPOINTS
# -----------------------------------------------------------

@app.get("/")
def root():
    if df.empty:
        return {"status": "error", "message": "No se cargaron datos"}
    return {
        "status": "ok",
        "filas": len(df),
        "endpoints": {
            "top-instituciones": "/top-instituciones",
            "provincia-top": "/provincia-top",
            "proveedor-top": "/proveedor-top",
            "top-inversiones": "/top-inversiones"
        }
    }

@app.get("/top-instituciones")
def top_instituciones(
    provincia: str | None = Query(None),
    canton: str | None = Query(None),
    distrito: str | None = Query(None)
):
    if df.empty:
        return []

    datos = df.copy()

    if provincia:
        prov_norm = normalizar(provincia)
        datos = datos[datos["Provincia"].apply(lambda x: normalizar(x) == prov_norm)]
    if canton:
        canton_norm = normalizar(canton)
        datos = datos[datos["Canton"].apply(lambda x: normalizar(x) == canton_norm)]
    if distrito:
        dist_norm = normalizar(distrito)
        datos = datos[datos["Distrito"].apply(lambda x: normalizar(x) == dist_norm)]

    conteo = datos["Institucion"].value_counts().head(3)
    resultado = conteo.reset_index().rename(columns={"index": "Institucion", "Institucion": "Cantidad"})
    return resultado.to_dict(orient="records")

@app.get("/provincia-top")
def provincia_top():
    if df.empty:
        return {}
    conteo = df["Provincia"].value_counts().head(1).reset_index()
    conteo.columns = ["Provincia", "Cantidad"]
    return conteo.to_dict(orient="records")[0]

@app.get("/proveedor-top")
def proveedor_top():
    if df.empty:
        return []
    proveedor_sum = df.groupby("Adjudicatario")["Monto adjudicado en colones"].sum().reset_index()
    top_proveedores = proveedor_sum.sort_values(by="Monto adjudicado en colones", ascending=False).head(3)
    return top_proveedores.to_dict(orient="records")


@app.get("/top-inversiones")
def top_inversiones():
    if df.empty:
        return []
    agrupado = df.groupby("Institucion")["Monto adjudicado en colones"].sum().reset_index()
    top5 = agrupado.sort_values(by="Monto adjudicado en colones", ascending=False).head(5)
    return top5.to_dict(orient="records")

# -----------------------------------------------------------
# EJECUCIÓN LOCAL
# -----------------------------------------------------------
if __name__ == "__main__":  # ← se escribe __name__, no _name_
    import uvicorn
    print("\n🚀 Servidor iniciando...\n")
    print("http://127.0.0.1:8000/top-instituciones\t→ Top 3 instituciones con más licitaciones")
    print("http://127.0.0.1:8000/top-instituciones?provincia=San%20José&canton=Escazú\t→ Filtrado por ubicación")
    print("http://127.0.0.1:8000/provincia-top\t→ Provincia con más licitaciones")
    print("http://127.0.0.1:8000/proveedor-top\t→ Proveedor más remunerado")
    print("http://127.0.0.1:8000/top-inversiones\t→ Top 5 instituciones con más inversión")
    print("\nDocumentación interactiva: http://127.0.0.1:8000/docs\n")
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
