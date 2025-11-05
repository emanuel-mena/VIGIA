#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from typing import List
import pandas as pd
import unicodedata

# -----------------------------------------------------------
# CONFIGURACIÓN
# -----------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent  # ← __file__, correcto
DATA_FILE_PATH = BASE_DIR / "data.csv"      # Ajusta si tu CSV está en otra carpeta
EGRESOS_FILE_PATH = BASE_DIR / "egresos.csv"

app = FastAPI(
    title="API de Análisis de Contrataciones Públicas",
    description="Servicio web que analiza licitaciones/adjudicaciones y egresos a partir de archivos CSV",
    version="1.1.0"
)

FRONTEND_ORIGINS = [
    "https://vigia.up.railway.app",  # dominio público del frontend
    "http://localhost:5173",         # dev vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=False,   # False si no usas cookies/autenticación de navegador
    allow_methods=["*"],       # GET, POST, PUT, DELETE, OPTIONS…
    allow_headers=["*"],       # Content-Type, Authorization, etc.
    expose_headers=["*"],      # opcional
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
# MAPEOS DE MESES
# -----------------------------------------------------------
MONTH_ALIASES = {
    "1":1, "01":1, "ene":1, "enero":1,
    "2":2, "02":2, "feb":2, "febrero":2,
    "3":3, "03":3, "mar":3, "marzo":3,
    "4":4, "04":4, "abr":4, "abril":4,
    "5":5, "05":5, "may":5, "mayo":5,
    "6":6, "06":6, "jun":6, "junio":6,
    "7":7, "07":7, "jul":7, "julio":7,
    "8":8, "08":8, "ago":8, "agosto":8,
    "9":9, "09":9, "sep":9, "sept":9, "septiembre":9,
    "10":10, "oct":10, "octubre":10,
    "11":11, "nov":11, "noviembre":11,
    "12":12, "dic":12, "diciembre":12,
}

def to_month_number(m) -> int | None:
    """Convierte 'Enero', 'ene', '03', 3 → 1..12. Devuelve None si no reconoce."""
    if m is None:
        return None
    s = str(m).strip().lower()
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode("utf-8")
    if s in MONTH_ALIASES:
        return MONTH_ALIASES[s]
    if s.isdigit():
        try:
            n = int(s)
            return n if 1 <= n <= 12 else None
        except Exception:
            return None
    return None

# -----------------------------------------------------------
# CARGA DE DATOS (licitaciones/adjudicaciones + egresos)
# -----------------------------------------------------------
df = pd.DataFrame()
df_egresos = pd.DataFrame()
lista_columnas_egresos: List[str] = []

@app.on_event("startup")
async def load_data():
    """Carga los archivos CSV al iniciar el servidor."""
    global df, df_egresos, lista_columnas_egresos
    try:
        print("📦 Cargando datos de contrataciones...")
        usecols = [
            "Provincia", "Canton", "Distrito", "Institucion",
            "Adjudicatario", "Monto adjudicado en colones"
        ]

        # 🔹 Intentar primero con UTF-8, luego con Latin-1
        try:
            df = pd.read_csv(DATA_FILE_PATH, usecols=usecols, encoding="utf-8-sig")
        except UnicodeDecodeError:
            df = pd.read_csv(DATA_FILE_PATH, usecols=usecols, encoding="latin-1")

        # 🔹 Normalizar texto (quita invisibles y dobles espacios, NO tildes)
        for col in ["Provincia", "Canton", "Distrito", "Institucion", "Adjudicatario"]:
            df[col] = (
                df[col]
                .astype(str)
                .str.normalize("NFKC")
                .str.strip()
                .str.replace(r"\s+", " ", regex=True)
            )

        # 🔹 Limpiar la columna de montos
        df["Monto adjudicado en colones"] = (
            df["Monto adjudicado en colones"]
            .astype(str)
            .str.replace(",", ".", regex=False)
            .str.replace(" ", "", regex=False)
        )
        df["Monto adjudicado en colones"] = pd.to_numeric(df["Monto adjudicado en colones"], errors="coerce")

        print(f"✅ Datos de contrataciones cargados: {len(df):,} registros.")

    except Exception as e:
        print(f"❌ Error al cargar data.csv: {e}")
        df = pd.DataFrame()

    # ---- Egresos
    try:
        print("📦 Cargando datos de egresos...")
        if EGRESOS_FILE_PATH.exists():
            try:
                df_egresos = pd.read_csv(EGRESOS_FILE_PATH, encoding="utf-8-sig")
            except UnicodeDecodeError:
                df_egresos = pd.read_csv(EGRESOS_FILE_PATH, encoding="latin-1")

            # Normaliza columnas clave si existen
            for col in ["Mes", "Titulo_Descripcion"]:
                if col in df_egresos.columns:
                    df_egresos[col] = (
                        df_egresos[col]
                        .astype(str)
                        .str.normalize("NFKC")
                        .str.strip()
                        .str.replace(r"\s+", " ", regex=True)
                    )

            # Convierte potenciales importes de texto → numérico
            for c in df_egresos.columns:
                if c not in ["Mes", "Titulo_Descripcion"]:
                    if df_egresos[c].dtype == "object":
                        df_egresos[c] = (
                            df_egresos[c].astype(str)
                            .str.replace(",", ".", regex=False)
                            .str.replace(" ", "", regex=False)
                        )
                        df_egresos[c] = pd.to_numeric(df_egresos[c], errors="ignore")

            # Detecta columnas numéricas sumables (excluye 'Mes')
            num_cols = df_egresos.select_dtypes(include=["number"]).columns.tolist()
            lista_columnas_egresos = [c for c in num_cols if c not in ["Mes"]]

            print(f"✅ Egresos cargados: {len(df_egresos):,} filas, {len(lista_columnas_egresos)} columnas de monto.")
        else:
            print(f"⚠️ No se encontró {EGRESOS_FILE_PATH}. Endpoints de egresos quedarán vacíos.")
            df_egresos = pd.DataFrame()
            lista_columnas_egresos = []
    except Exception as e:
        print(f"❌ Error al cargar egresos.csv: {e}")
        df_egresos = pd.DataFrame()
        lista_columnas_egresos = []

# -----------------------------------------------------------
# HELPERS PARA EGRESOS -> MultiPercentLineChart
# -----------------------------------------------------------
def construir_multi_percent_rows(
    df_src: pd.DataFrame,
    cols_montos: List[str],
    titulo_exact: str | None = None,
    month_col: str = "Mes",
    title_col: str = "Titulo_Descripcion",
) -> list[dict]:
    """
    Devuelve lista de dicts con forma:
      { "month": <int 1..12 o índice>, "series": <str>, "value": <float %> }
    """
    if df_src.empty or not cols_montos:
        return []

    df_tmp = df_src.copy()

    # Normaliza columnas básicas si existen
    for col in [month_col, title_col]:
        if col in df_tmp.columns:
            df_tmp[col] = (
                df_tmp[col].astype(str)
                .str.normalize("NFKC")
                .str.strip()
                .str.replace(r"\s+", " ", regex=True)
            )

    # Filtro opcional por título exacto (ignorando tildes/mayúsculas)
    if titulo_exact and title_col in df_tmp.columns:
        def _norm(s: str) -> str:
            s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode("utf-8")
            return s.lower().strip()
        t_norm = _norm(titulo_exact)
        df_tmp = df_tmp[df_tmp[title_col].apply(lambda x: _norm(str(x)) == t_norm)]

    # Asegurar columna de mes
    if month_col not in df_tmp.columns:
        raise ValueError(f"El CSV de egresos debe contener la columna '{month_col}'.")

    # Forzar montos a numérico
    for c in cols_montos:
        if c in df_tmp.columns and df_tmp[c].dtype == "object":
            df_tmp[c] = (
                df_tmp[c].astype(str)
                .str.replace(",", ".", regex=False)
                .str.replace(" ", "", regex=False)
            )
        if c in df_tmp.columns:
            df_tmp[c] = pd.to_numeric(df_tmp[c], errors="coerce")

    # Total por fila
    df_tmp["Total_Egreso"] = df_tmp[cols_montos].sum(axis=1, numeric_only=True)

    # Si no existe title_col, creamos una serie única
    if title_col not in df_tmp.columns:
        df_tmp[title_col] = "Total"

    # Mes a número si es necesario
    months_num = df_tmp[month_col].map(to_month_number)
    if months_num.isna().all():
        # Intentar convertir directo a número
        months_num = pd.to_numeric(df_tmp[month_col], errors="coerce")
    df_tmp["_MesNum"] = months_num

    # Si todo NaN, usar orden de aparición como 1..N
    if df_tmp["_MesNum"].isna().all():
        uniq = list(dict.fromkeys(df_tmp[month_col].tolist()))
        idx_map = {v: i + 1 for i, v in enumerate(uniq)}
        df_tmp["_MesNum"] = df_tmp[month_col].map(idx_map)

    # Agrupar por mes y título
    g = (
        df_tmp.groupby(["_MesNum", title_col], as_index=False)["Total_Egreso"]
        .sum()
        .rename(columns={"_MesNum": "MesNum"})
    )

    # Porcentaje por mes
    g["Porcentaje"] = (
        g.groupby("MesNum")["Total_Egreso"]
         .transform(lambda x: (x / x.sum()) * 100 if x.sum() else 0.0)
    )

    # Orden por mes y título
    g = g.sort_values(["MesNum", title_col])

    # Armar salida en el formato del componente React
    out = [
        {"month": int(m), "series": str(s), "value": float(p)}
        for m, s, p in zip(g["MesNum"], g[title_col], g["Porcentaje"])
    ]
    return out

# -----------------------------------------------------------
# ENDPOINTS ORIGINALES
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
            "top-inversiones": "/top-inversiones",
            "egresos-linea-data": "/egresos-linea-data",
            "egresos-series": "/egresos-series",
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
# ENDPOINTS NUEVOS (EGRESOS → MultiPercentLineChart)
# -----------------------------------------------------------
@app.get("/egresos-linea-totales")
def egresos_linea_totales(
    titulo: str | None = Query(None, description="Filtrar por Titulo_Descripcion exacto (opcional)")
):
    """
    Devuelve filas {month, series, value} donde value es el MONTO TOTAL (no %)
    por Mes y Titulo_Descripcion.
    """
    if df_egresos.empty or not lista_columnas_egresos:
        return []

    df_tmp = df_egresos.copy()

    # Normaliza texto clave
    for col in ["Mes", "Titulo_Descripcion"]:
        if col in df_tmp.columns:
            df_tmp[col] = (
                df_tmp[col].astype(str)
                .str.normalize("NFKC")
                .str.strip()
                .str.replace(r"\s+", " ", regex=True)
            )

    # Filtro opcional
    if titulo and "Titulo_Descripcion" in df_tmp.columns:
        def _norm(s: str) -> str:
            s = unicodedata.normalize("NFD", s).encode("ascii","ignore").decode("utf-8")
            return s.lower().strip()
        t_norm = _norm(titulo)
        df_tmp = df_tmp[df_tmp["Titulo_Descripcion"].apply(lambda x: _norm(str(x)) == t_norm)]

    # Montos numéricos y total por fila
    for c in lista_columnas_egresos:
        if c in df_tmp.columns and df_tmp[c].dtype == "object":
            df_tmp[c] = (
                df_tmp[c].astype(str)
                .str.replace(",", ".", regex=False)
                .str.replace(" ", "", regex=False)
            )
        if c in df_tmp.columns:
            df_tmp[c] = pd.to_numeric(df_tmp[c], errors="coerce")

    df_tmp["Total_Egreso"] = df_tmp[lista_columnas_egresos].sum(axis=1, numeric_only=True)

    # Mes a número
    months_num = df_tmp["Mes"].map(to_month_number)
    if months_num.isna().all():
        months_num = pd.to_numeric(df_tmp["Mes"], errors="coerce")
    df_tmp["_MesNum"] = months_num
    if df_tmp["_MesNum"].isna().all():
        uniq = list(dict.fromkeys(df_tmp["Mes"].tolist()))
        idx_map = {v: i+1 for i, v in enumerate(uniq)}
        df_tmp["_MesNum"] = df_tmp["Mes"].map(idx_map)

    # Agrupar y devolver
    g = (
        df_tmp.groupby(["_MesNum", "Titulo_Descripcion"], as_index=False)["Total_Egreso"]
        .sum()
        .rename(columns={"_MesNum": "MesNum"})
        .sort_values(["MesNum", "Titulo_Descripcion"])
    )

    return [
        {"month": int(m), "series": str(s), "value": float(v)}
        for m, s, v in zip(g["MesNum"], g["Titulo_Descripcion"], g["Total_Egreso"])
    ]


@app.get("/egresos-series")
def egresos_series():
    """
    Devuelve la lista de series (Titulo_Descripcion) disponibles para armar filtros en el frontend.
    """
    if df_egresos.empty:
        return []
    col = "Titulo_Descripcion"
    if col not in df_egresos.columns:
        return ["Total"]
    s = (
        df_egresos[col]
        .astype(str)
        .str.normalize("NFKC")
        .str.strip()
        .str.replace(r"\s+", " ", regex=True)
        .dropna()
        .unique()
        .tolist()
    )
    s.sort()
    return s

# -----------------------------------------------------------
# EJECUCIÓN LOCAL
# -----------------------------------------------------------
if __name__ == "__main__":  # ← __name__, correcto
    import uvicorn
    print("\n🚀 Servidor iniciando...\n")
    print("http://127.0.0.1:8000/top-instituciones\t→ Top 3 instituciones con más licitaciones")
    print("http://127.0.0.1:8000/top-instituciones?provincia=San%20José&canton=Escazú\t→ Filtrado por ubicación")
    print("http://127.0.0.1:8000/provincia-top\t→ Provincia con más licitaciones")
    print("http://127.0.0.1:8000/proveedor-top\t→ Proveedor más remunerado")
    print("http://127.0.0.1:8000/top-inversiones\t→ Top 5 instituciones con más inversión")
    print("http://127.0.0.1:8000/egresos-linea-data\t→ JSON para MultiPercentLineChart {month,series,value}")
    print("http://127.0.0.1:8000/egresos-series\t→ Series disponibles (Titulo_Descripcion)")
    print("\nDocumentación interactiva: http://127.0.0.1:8000/docs\n")
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
