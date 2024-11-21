# **Tiktoc API**

Sistema de backend para la gestión y transmisión de videos utilizando `Node.js`, `rclone`, `Nginx` como proxy inverso, y Cloudflare para optimización y seguridad.

## **Características**

-   Gestión de videos mediante `rclone` y Google Drive.
-   Seguridad con tokens en las cabeceras o parámetros de la URL.
-   Soporte para CORS para restringir acceso solo a dominios autorizados.
-   Caché de respuestas con Nginx y Cloudflare.
-   Compresión y optimización de contenido estático (`mp4`, `json`, etc.).

----------

## **Requisitos**

1.  **Node.js** (v18 o superior).
2.  **Docker** y **Docker Compose**.
3.  **Google Drive configurado en `rclone`**.
4.  **Dominio registrado y configurado en Cloudflare**.

----------

## **Configuración**

### 1. Variables de Entorno

Configura el archivo `.env` en la raíz de tu proyecto:
```env
PORT=3000 
RCLONE_ADDR=:8080
RCLONE_CONFIG_PATH=/root/.config/rclone/rclone.conf
RCLONE_LOG_PATH=/tmp/rclone.log
AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxx 
```
### 2. Configuración de Rclone

Crea un archivo `rclone.conf` con las credenciales de Google Drive:
```ini
[tiktoc]
type = drive
client_id = YOUR_CLIENT_ID.apps.googleusercontent.com
client_secret = YOUR_CLIENT_SECRET
scope = drive
token = {"access_token":"YOUR_ACCESS_TOKEN","token_type":"Bearer","refresh_token":"YOUR_REFRESH_TOKEN","expiry":"2024-11-22T00:00:00Z"}
```

## **Ejecución**

### 1. Construir y ejecutar con Docker Compose

Ejecuta los siguientes comandos:

```bash
docker compose up -d
```
Esto levantará los servicios:

-   **API en Node.js**: `http://localhost:3000`
-   **Rclone** (mediante Nginx): `http://cdn.tiktoc.pro`

----------

## **Uso de la API**

### **1. Subir Video**

**Endpoint**: `POST /videos/upload`  
**Headers**:

-   `Authorization: Bearer YOUR_AUTH_TOKEN`

**Body (multipart/form-data)**:
```json
{
  "video": "<archivo.mp4>"
}
```
**Respuesta**:
```json
{
  "videoName": "1679421245.mp4",
  "message": "Video uploaded successfully"
}
```
### **2. Obtener Lista de Videos**

**Endpoint**: `GET /videos`  
**Headers**:

-   `Authorization: Bearer YOUR_AUTH_TOKEN`

**Respuesta**:
```json
[
  "video1.mp4",
  "video2.mp4",
  "video3.mp4"
]
```
### **3. Descargar Video**

**URL Base**: `http://cdn.tiktoc.pro`  
**Ruta del Video**: `/nombre_del_video.mp4`  
**Headers**:

-   `Authorization: Bearer YOUR_AUTH_TOKEN`

```bash
curl -H "Authorization: Bearer YOUR_AUTH_TOKEN" http://cdn.tiktoc.pro/video1.mp4
```

## **Configuración Adicional**

### **Caché con Nginx**

Nginx está configurado para almacenar en caché respuestas exitosas durante 24 horas:

-   Encabezado de caché:
    ```json
    `"X-Cache-Status": "HIT"` 
      ```

### **CORS**

Solo solicitudes desde `https://cdn.tiktoc.pro` son permitidas.

### **Cloudflare**

Cloudflare se utiliza para optimización global y mayor seguridad:

1.  Habilitar HTTPS y Brotli.
2.  Configurar reglas de caché.

----------

## **Tecnologías**

-   **Node.js**: Backend principal.
-   **rclone**: Conexión con Google Drive.
-   **Nginx**: Proxy inverso y caché.
-   **Cloudflare**: CDN y optimización.

----------

## **Contribuciones**

Si deseas contribuir, sigue los pasos:

1.  Clona el repositorio.
2.  Crea un branch: `git checkout -b feature/nueva-funcionalidad`.
3.  Haz tus cambios y realiza un PR.

----------

¡Gracias por usar Tiktoc API! 🚀