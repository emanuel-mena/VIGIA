# VIGÍA – Observatorio de Contrataciones Públicas

VIGÍA es una plataforma web que analiza, resume y visualiza información de contrataciones y egresos del sector público costarricense. El proyecto combina un backend en FastAPI que limpia y expone los datos a través de endpoints especializados, con un frontend en React que transforma esos resultados en gráficos interactivos y narrativas accesibles para la ciudadanía.

## Arquitectura en alto nivel

- **Backend (`backend/`)** – API en FastAPI que carga los archivos `data.csv` y `egresos.csv`, normaliza campos geográficos y económicos con pandas y expone endpoints para obtener rankings de instituciones, proveedores y series de gasto.
- **Frontend (`vigia/`)** – Aplicación React + Vite con Tailwind CSS, D3 y Framer Motion para visualizaciones (donut, líneas, tarjetas interactivas) y componentes de storytelling.
- **Infraestructura** – Dockerfile en la raíz para generar la imagen estática del frontend con Nginx. El backend puede desplegarse aparte con Uvicorn o en un servicio gestionado (Railway, Render, etc.).

```
VIGIA/
├── backend/                # FastAPI + pandas
│   ├── main.py             # Lógica de normalización y endpoints REST
│   ├── data.csv            # Fuente de contrataciones (privada)
│   └── egresos.csv         # Fuente de egresos (privada)
├── vigia/                  # Aplicación SPA en React
│   ├── src/                # Componentes y hooks personalizados
│   ├── public/             # Activos estáticos (imágenes del equipo, íconos)
│   └── nginx.conf          # Reglas para servir la SPA con Nginx
└── Dockerfile              # Build multi-stage del frontend
```

## Funcionalidades destacadas

- Agregaciones dinámicas de adjudicaciones por provincia, cantón, distrito, institución y adjudicatario.
- Visualización del top de proveedores y montos adjudicados mediante gráficas de dona y rankings.
- Series temporales de egresos anuales y mensuales, con filtros por categoría.
- Página pública con narrativa, animaciones y sección del equipo coordinador.
- Configuración CORS lista para entorno local y el dominio público `vigia.up.railway.app`.

## Requisitos previos

- Node.js 20+ y npm.
- Python 3.11+ con `pip`.
- (Opcional) Docker para empaquetar el frontend.

## Configuración del backend (FastAPI)

1. Crear y activar un entorno virtual.
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   ```
2. Instalar dependencias.
   ```bash
   pip install -r requirements.txt
   ```
3. Colocar los archivos `data.csv` y `egresos.csv` en la carpeta `backend/`.
4. Ejecutar el servidor en modo desarrollo.
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Endpoints principales

| Método | Ruta                       | Descripción                                                |
|--------|----------------------------|------------------------------------------------------------|
| GET    | `/top-instituciones`       | Ranking de instituciones por cantidad de adjudicaciones.   |
| GET    | `/provincia-top`           | Total de adjudicaciones agregadas por provincia.           |
| GET    | `/proveedor-top`           | Top de proveedores por monto adjudicado.                   |
| GET    | `/top-inversiones`         | Adjudicaciones destacadas, agrupadas por institución.      |
| GET    | `/egresos-linea-totales`   | Series temporales de egresos para visualización lineal.    |
| GET    | `/egresos-series`          | Listado de series de gasto disponibles para filtrar.       |

Los endpoints devuelven JSON listo para consumirse por el frontend. Todos normalizan cadenas (tildes, espacios) y montos monetarios antes de calcular agregaciones.

## Configuración del frontend (React + Vite)

1. Instalar dependencias.
   ```bash
   cd vigia
   npm install
   ```
2. Crear un archivo `.env` en `vigia/` si deseas apuntar a un backend externo.
   ```bash
   VITE_API_BASE=https://tu-backend.example.com
   ```
   Por defecto, la aplicación consumirá `/api`, lo que permite proxear hacia FastAPI desde la misma infraestructura.
3. Levantar la aplicación en modo desarrollo.
   ```bash
   npm run dev
   ```
4. Ejecutar builds de producción o análisis de linting.
   ```bash
   npm run build
   npm run lint
   ```

## Despliegue con Docker (frontend)

La imagen multi-stage incluida construye la SPA y la sirve con Nginx.

```bash
# En la raíz del proyecto
docker build -t vigia-frontend .
docker run -p 8080:80 vigia-frontend
```

Para exponer el backend, construye tu propia imagen FastAPI (puedes usar `backend/dockerBackend.dockerfile` como base) o despliega el servicio en una plataforma gestionada.

## Buenas prácticas y mantenimiento

- Actualiza los archivos CSV con la misma estructura esperada para evitar errores de parseo.
- Verifica en `backend/main.py` la lista de columnas utilizadas antes de cargar nuevos datos.
- Ajusta `FRONTEND_ORIGINS` si cambias el dominio público del frontend.
- Integra un pipeline de CI que ejecute `npm run lint` y pruebas sobre los datos antes de desplegar.

## Licencia

Este proyecto se distribuye bajo la licencia [MIT](LICENSE). Revísala antes de reutilizar o distribuir el código.
