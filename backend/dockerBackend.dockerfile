# backend/dockerBackend.dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Dependencias del sistema (si en el futuro necesitas 'pandas' con más libs, añade aquí)
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instala deps de Python
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copia el backend
COPY . /app

# Railway asigna $PORT. FastAPI debe escuchar en 0.0.0.0:$PORT
ENV PORT=8000
CMD ["bash", "-lc", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
