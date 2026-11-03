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

1. Copia los archivos PHP de `public` al directorio del proyecto dentro de `htdocs` (por ejemplo, `C:\xampp\htdocs\ayuda-venezuela`).
2. Inicia Apache y MySQL desde el panel de XAMPP e importa `database/schema.sql` en phpMyAdmin o con el cliente MySQL.
3. La cuenta local inicial es `admin` / `password`. Es solo para desarrollo: cambia la contraseña antes de desplegar.
4. El frontend puede llamar a `http://localhost/ayuda-venezuela/login.php`, `obtener_datos.php` y `guardar_datos.php`. El inicio de sesión devuelve un `token` de sesión; envíalo como cabecera `X-Session-ID` al guardar publicaciones.

Los endpoints habilitan CORS con `*` para facilitar las pruebas locales. No uses esa política permisiva en producción; limita el origen al dominio del frontend y usa HTTPS.
