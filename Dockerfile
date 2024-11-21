# Usa una imagen base ligera de Alpine Linux
FROM alpine:latest

# Variables de entorno para instalar dependencias
ENV NODE_VERSION 20

# Instalar dependencias necesarias para rclone y Node.js
RUN apk update && apk add --no-cache \
    curl \
    bash \
    ca-certificates \
    git \
    nodejs \
    npm \
    fuse \
    && curl -O https://downloads.rclone.org/rclone-current-linux-amd64.zip \
    && unzip rclone-current-linux-amd64.zip \
    && mv rclone-*-linux-amd64/rclone /usr/bin/rclone \
    && chown root:root /usr/bin/rclone \
    && chmod 755 /usr/bin/rclone \
    && rm -r rclone-*-linux-amd64 \
    && rm rclone-current-linux-amd64.zip

# Crear y definir el directorio de trabajo
WORKDIR /app

# Copiar el código de la API Node.js y las dependencias
COPY package*.json ./ 

# Instalar las dependencias de Node.js
RUN npm install

# Copiar el código fuente de la API Node.js al contenedor
COPY . /app

# Copiar el archivo de configuración rclone.conf al contenedor
COPY rclone.conf /root/.config/rclone/rclone.conf

# Exponer el puerto 3000 para la API Node.js
EXPOSE 3000
EXPOSE 8080

# Configurar el entrypoint para iniciar rclone y el servidor Node.js
CMD ["sh", "-c", "rclone serve http tiktoc:/ --addr :8080 --config /root/.config/rclone/rclone.conf --log-file=/tmp/rclone.log --log-level=DEBUG & node server.js"]