# .

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Backend local con XAMPP

El frontend elige automáticamente la base del backend con `import.meta.env.DEV`: usa
`http://localhost/plasist-backend/` durante el desarrollo y `https://plasist.org` en producción.

- `login.php` recibe `POST` JSON con `usuario` y `contrasena`, y devuelve `success: true` junto con `token` si las credenciales son válidas.
- `obtener_datos.php` devuelve `success: true` y un arreglo `publicaciones`. Cada publicación incluye `id`, `titulo`, `red_social`, `fecha`, `texto`, `imagen_url` y `enlace_original`. También puede devolver los datos del censo.
- `guardar_datos.php` recibe `POST` JSON con `titulo`, `red_social`, `texto`, `imagen_url` y `enlace_original`; debe validar el token recibido en la cabecera `X-Session-ID`.

Agrega la columna de título a la tabla antes de reemplazar los endpoints:

```sql
ALTER TABLE publicaciones
ADD COLUMN titulo VARCHAR(255) NOT NULL DEFAULT '' AFTER red_social;
```

Como el frontend envía JSON y una cabecera personalizada, Apache/PHP debe responder a las solicitudes `OPTIONS` de preflight y permitir `Content-Type` y `X-Session-ID` en CORS. Restringe el origen al dominio del frontend fuera del entorno local y usa HTTPS.
