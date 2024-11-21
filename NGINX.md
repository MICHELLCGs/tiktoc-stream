# Configuración de NGINX con CORS y Proxy Cache

Este archivo describe cómo configurar NGINX para manejar CORS (Cross-Origin Resource Sharing) y un proxy con caché optimizado.

## Requisitos previos

- Tener instalado **NGINX**.
- Configuración para servir contenido desde un backend, como un servidor Node.js o Rclone.
- Archivos de configuración disponibles:
  - `nginx.conf`

## Configuración de NGINX

### Habilitación de CORS

Para permitir solicitudes desde dominios específicos (como `https://tiktoc.pro` y `http://localhost`), se utiliza la siguiente lógica:

```nginx
set $cors_origin "";

# Validar origen
if ($http_origin ~* "(https://tiktoc.pro|http://localhost)") {
    set $cors_origin $http_origin;
}

add_header Access-Control-Allow-Origin $cors_origin;
add_header Access-Control-Allow-Methods "GET, OPTIONS";
add_header Access-Control-Allow-Headers "Authorization, Content-Type";
add_header Access-Control-Allow-Credentials "true"; # Permitir cookies y encabezados personalizados.
```

-   **`Access-Control-Allow-Origin`**: Permite solicitudes solo desde dominios válidos.
-   **`Access-Control-Allow-Methods`**: Especifica los métodos HTTP permitidos (como `GET` y `OPTIONS`).
-   **`Access-Control-Allow-Headers`**: Permite encabezados personalizados como `Authorization`.
-   **`Access-Control-Allow-Credentials`**: Habilita el envío de cookies y credenciales.

### Manejo de solicitudes preflight (OPTIONS)

Para manejar solicitudes `OPTIONS` correctamente:

```nginx
if ($request_method = OPTIONS) {
    return 204;
}
```
Esto asegura que las solicitudes preflight devuelvan un estado vacío (`204 No Content`), evitando respuestas innecesarias.

### Configuración del Proxy Cache

La configuración del caché optimiza las respuestas del backend:

```nginx

proxy_cache_path /tmp/nginx_cache levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=1h use_temp_path=off;

proxy_cache my_cache;
proxy_cache_valid 200 1h;       # Cachea respuestas exitosas por 1 hora.
proxy_cache_valid 404 10s;      # Cachea errores 404 por 10 segundos.
proxy_cache_background_update on;  # Actualiza el caché en segundo plano.
proxy_cache_use_stale updating;    # Sirve contenido viejo mientras actualiza.` 
```
-   **`proxy_cache_path`**: Define el almacenamiento del caché en disco.
-   **`proxy_cache_valid`**: Configura tiempos de validez del caché.
-   **`proxy_cache_background_update`**: Actualiza el caché en segundo plano.
-   **`proxy_cache_use_stale`**: Sirve contenido cacheado mientras se actualiza.

### Bloque de servidor completo

```nginx

server {
    listen 80;
    server_name cdn.tiktoc.pro localhost;

    location / {
        set $token_valid "no";

        if ($arg_token = "xxxxxxxxxxxxxxxxxxxxxxxxxx") {
            set $token_valid "yes";
        }
        if ($http_authorization = "Bearer xxxxxxxxxxxxxx") {
            set $token_valid "yes";
        }

        if ($token_valid = "no") {
            return 403;
        }

        # Configuración de CORS
        set $cors_origin "";
        if ($http_origin ~* "(https://tiktoc.pro|http://localhost)") {
            set $cors_origin $http_origin;
        }

        add_header Access-Control-Allow-Origin $cors_origin;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "Authorization, Content-Type";
        add_header Access-Control-Allow-Credentials "true";

        if ($request_method = OPTIONS) {
            return 204;
        }

        # Configuración del Proxy y Cache
        proxy_cache my_cache;
        proxy_cache_valid 200 1h;
        proxy_cache_valid 404 10s;
        proxy_cache_background_update on;
        proxy_cache_use_stale updating;

        proxy_pass http://nodejs:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        add_header Cache-Control "public, max-age=600";
    }

    error_page 403 /403.html;
    location = /403.html {
        internal;
        default_type text/html;
        return 403 '<h1>403 Forbidden TikTok</h1>';
    }
}
```
## Reinicio del servidor

Para aplicar los cambios, reinicia el contenedor o el servicio de NGINX:

```bash
docker-compose restart nginx
```
## Verificación

1.  Prueba solicitudes desde dominios permitidos (`https://tiktoc.pro` y `http://localhost`).
2.  Asegúrate de que las cabeceras CORS se incluyan en las respuestas:
    
   ``` http
    
    Access-Control-Allow-Origin: https://tiktoc.pro
    Access-Control-Allow-Methods: GET, OPTIONS
    Access-Control-Allow-Headers: Authorization, Content-Type
    Access-Control-Allow-Credentials: true
   ```