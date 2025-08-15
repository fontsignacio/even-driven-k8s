# orders-service/Dockerfile

FROM node:20-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copia los archivos package.json y package-lock.json.
# Esto permite que Docker use el caché de capas para las dependencias si no cambian.
COPY package*.json ./

# Instala las dependencias de Node.js.
# El --omit=dev es importante para no instalar dependencias de desarrollo en la imagen final.
RUN npm install --omit=dev

# Copia el resto del código de la aplicación.
COPY . .

# Expone el puerto en el que la aplicación Express escuchará.
EXPOSE 8080

# Comando para iniciar la aplicación cuando el contenedor se ejecute.
# Usa 'node index.js' o 'npm start' si tienes un script 'start' en package.json.
CMD ["node", "index.js"]
