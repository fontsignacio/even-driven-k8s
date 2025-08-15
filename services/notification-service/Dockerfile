FROM python:3.10-slim-buster

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Exponer el puerto en el que FastAPI escuchará
EXPOSE 8000

# Comando para iniciar la aplicación usando Uvicorn
# --host 0.0.0.0 es necesario para que el servicio sea accesible desde fuera del contenedor
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
