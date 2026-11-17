<template>
  <section class="admin-panel tarjeta">
    <h1 class="titulo-seccion borde-azul">Panel de administración</h1>

    <form v-if="!estaLogueado" class="formulario-admin" @submit.prevent="iniciarSesion">
      <label for="admin-usuario">Nombre</label>
      <input
        id="admin-usuario"
        v-model.trim="usuario"
        autocomplete="username"
        required
        :disabled="enviando"
      />

      <label for="admin-clave">Contraseña</label>
      <input
        id="admin-clave"
        v-model="clave"
        type="password"
        autocomplete="current-password"
        required
        :disabled="enviando"
      />

      <button type="submit" :disabled="enviando">
        {{ enviando ? 'Iniciando sesión...' : 'Iniciar sesión' }}
      </button>
    </form>

    <div v-else class="admin-autenticado">
      <div class="admin-acciones">
        <p>Sesión iniciada. Puedes publicar una noticia.</p>
        <button type="button" class="boton-secundario" @click="cerrarSesion">Cerrar Sesión</button>
      </div>

      <form class="formulario-admin" @submit.prevent="publicarNoticia">
        <label for="noticia-red">Red Social</label>
        <select id="noticia-red" v-model="noticia.red_social" required :disabled="enviando">
          <option value="Facebook">Facebook</option>
          <option value="Instagram">Instagram</option>
        </select>

        <label for="noticia-titulo">Título de la noticia</label>
        <input
          id="noticia-titulo"
          v-model.trim="noticia.titulo"
          required
          :disabled="enviando"
        />

        <label for="noticia-texto">Texto de la publicación</label>
        <textarea
          id="noticia-texto"
          v-model.trim="noticia.texto"
          rows="5"
          required
          :disabled="enviando"
        />

        <label for="noticia-imagen">Imagen de la publicación</label>
        <input
          id="noticia-imagen"
          v-model.trim="noticia.imagen_url"
          type="url"
          placeholder="https://..."
          :disabled="enviando"
        />

        <label for="noticia-enlace">Enlace al post original</label>
        <input
          id="noticia-enlace"
          v-model.trim="noticia.enlace_original"
          type="url"
          placeholder="https://www.facebook.com/... o https://www.instagram.com/..."
          required
          :disabled="enviando"
        />

        <button type="submit" :disabled="enviando">
          {{ enviando ? 'Publicando...' : 'Publicar noticia' }}
        </button>
      </form>

      <section class="seccion-publicaciones" aria-labelledby="titulo-publicaciones">
        <h2 id="titulo-publicaciones" class="titulo-seccion borde-azul">Noticias Publicadas</h2>
        <p v-if="cargandoPublicaciones" class="estado-publicaciones" aria-live="polite">
          Cargando noticias...
        </p>
        <p v-else-if="errorPublicaciones" class="estado-publicaciones error-publicaciones" role="alert">
          {{ errorPublicaciones }}
        </p>
        <p v-else-if="publicaciones.length === 0" class="estado-publicaciones">
          No hay noticias publicadas.
        </p>

        <ul v-else class="lista-publicaciones">
          <li v-for="publicacion in publicaciones" :key="publicacion.id" class="item-publicacion">
            <div class="detalle-publicacion">
              <div class="meta-publicacion">
                <strong>{{ publicacion.titulo || 'Sin título' }}</strong>
                <time v-if="publicacion.fecha" :datetime="publicacion.fecha">
                  {{ formatearFecha(publicacion.fecha) }}
                </time>
              </div>
              <span class="red-publicacion-admin">{{ publicacion.red_social }}</span>
              <p>{{ extracto(publicacion.texto) }}</p>
            </div>
            <button
              type="button"
              class="boton-eliminar"
              :disabled="eliminandoId === publicacion.id"
              @click="eliminarNoticia(publicacion)"
            >
              {{ eliminandoId === publicacion.id ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </li>
        </ul>
      </section>
    </div>

    <p v-if="mensaje" :class="['mensaje-admin', tipoMensaje]" role="status" aria-live="polite">
      {{ mensaje }}
    </p>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { backendUrl } from '../config/backend.js'

const TOKEN_KEY = 'token_admin'

const usuario = ref('')
const clave = ref('')
const tokenAdmin = ref(localStorage.getItem(TOKEN_KEY) || '')
const estaLogueado = ref(Boolean(tokenAdmin.value))
const enviando = ref(false)
const mensaje = ref('')
const tipoMensaje = ref('exito')
const publicaciones = ref([])
const cargandoPublicaciones = ref(false)
const errorPublicaciones = ref('')
const eliminandoId = ref(null)
const noticia = reactive({
  titulo: '',
  red_social: 'Facebook',
  texto: '',
  imagen_url: '',
  enlace_original: ''
})

async function leerRespuesta(respuesta) {
  let datos
  try {
    datos = await respuesta.json()
  } catch {
    throw new Error('El servidor devolvió una respuesta que no es JSON válido.')
  }

  if (!respuesta.ok || datos.success === false) {
    throw new Error(datos.message || datos.error || `Error del servidor (${respuesta.status}).`)
  }

  return datos
}

function mostrarError(causa, mensajeGenerico) {
  tipoMensaje.value = 'error'
  mensaje.value = causa instanceof Error ? causa.message : mensajeGenerico
}

async function iniciarSesion() {
  enviando.value = true
  mensaje.value = ''

  try {
    const respuesta = await fetch(backendUrl('login.php'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: usuario.value, contrasena: clave.value })
    })
    const datos = await leerRespuesta(respuesta)

    if (datos.success !== true || typeof datos.token !== 'string' || !datos.token.trim()) {
      throw new Error(datos.message || 'El servidor no confirmó el acceso o no devolvió un token.')
    }

    tokenAdmin.value = datos.token
    localStorage.setItem(TOKEN_KEY, datos.token)
    estaLogueado.value = true
    clave.value = ''
    tipoMensaje.value = 'exito'
    mensaje.value = 'Inicio de sesión correcto.'
    await cargarPublicaciones()
  } catch (causa) {
    mostrarError(causa, 'No se pudo iniciar sesión. Verifica las credenciales y la conexión.')
  } finally {
    enviando.value = false
  }
}

async function publicarNoticia() {
  enviando.value = true
  mensaje.value = ''

  try {
    const respuesta = await fetch(backendUrl('guardar_datos.php'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': tokenAdmin.value
      },
      body: JSON.stringify({
        titulo: noticia.titulo,
        red_social: noticia.red_social,
        texto: noticia.texto,
        imagen_url: noticia.imagen_url,
        enlace_original: noticia.enlace_original
      })
    })
    const datos = await leerRespuesta(respuesta)

    if (datos.success !== true) {
      throw new Error(datos.message || 'El servidor no confirmó la publicación.')
    }

    noticia.titulo = ''
    noticia.texto = ''
    noticia.imagen_url = ''
    noticia.enlace_original = ''
    tipoMensaje.value = 'exito'
    mensaje.value = datos.message || 'La noticia se publicó correctamente.'
    await cargarPublicaciones()
  } catch (causa) {
    mostrarError(causa, 'No se pudo publicar la noticia. Inténtalo nuevamente.')
  } finally {
    enviando.value = false
  }
}

async function cargarPublicaciones() {
  cargandoPublicaciones.value = true
  errorPublicaciones.value = ''

  try {
    const respuesta = await fetch(backendUrl('obtener_datos.php'))
    const datos = await leerRespuesta(respuesta)

    if (!Array.isArray(datos.publicaciones)) {
      throw new Error('El backend no devolvió una lista válida de publicaciones.')
    }

    publicaciones.value = datos.publicaciones
  } catch (causa) {
    errorPublicaciones.value = causa instanceof Error
      ? `No se pudieron cargar las noticias: ${causa.message}`
      : 'No se pudieron cargar las noticias del servidor local.'
    console.error(errorPublicaciones.value, causa)
  } finally {
    cargandoPublicaciones.value = false
  }
}

async function eliminarNoticia(publicacion) {
  if (!window.confirm('¿Seguro que quieres eliminar esta noticia?')) return

  eliminandoId.value = publicacion.id
  mensaje.value = ''

  try {
    const respuesta = await fetch(backendUrl('eliminar_dato.php'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': tokenAdmin.value
      },
      body: JSON.stringify({ id: publicacion.id })
    })
    const datos = await leerRespuesta(respuesta)

    if (datos.success !== true) {
      throw new Error(datos.message || 'El servidor no confirmó la eliminación.')
    }

    tipoMensaje.value = 'exito'
    mensaje.value = datos.message || 'La noticia se eliminó correctamente.'
    await cargarPublicaciones()
  } catch (causa) {
    mostrarError(causa, 'No se pudo eliminar la noticia. Inténtalo nuevamente.')
  } finally {
    eliminandoId.value = null
  }
}

function extracto(texto) {
  if (typeof texto !== 'string') return ''
  return texto.length > 160 ? `${texto.slice(0, 157).trimEnd()}...` : texto
}

function formatearFecha(valor) {
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime())
    ? valor
    : new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(fecha)
}

function cerrarSesion() {
  localStorage.removeItem(TOKEN_KEY)
  tokenAdmin.value = ''
  estaLogueado.value = false
  publicaciones.value = []
  errorPublicaciones.value = ''
  mensaje.value = 'Sesión cerrada.'
  tipoMensaje.value = 'exito'
}

onMounted(() => {
  if (estaLogueado.value) cargarPublicaciones()
})
</script>

<style scoped>
.admin-panel {
  max-width: 760px;
  margin: 0 auto;
}

.admin-acciones {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.admin-acciones p {
  margin: 0;
  color: #475569;
}

.formulario-admin {
  display: grid;
  gap: 10px;
}

.formulario-admin label {
  color: #334155;
  font-weight: 700;
}

.formulario-admin input,
.formulario-admin select,
.formulario-admin textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
}

.formulario-admin textarea {
  resize: vertical;
}

.formulario-admin input:focus,
.formulario-admin select:focus,
.formulario-admin textarea:focus {
  outline: 2px solid #93c5fd;
  outline-offset: 1px;
}

.formulario-admin button,
.boton-secundario {
  padding: 12px;
  border: 0;
  border-radius: 8px;
  background: #1d4ed8;
  color: white;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.formulario-admin button:disabled {
  cursor: wait;
  opacity: .7;
}

.boton-secundario {
  flex: 0 0 auto;
  padding: 9px 12px;
  background: #475569;
}

.seccion-publicaciones {
  margin-top: 28px;
}

.seccion-publicaciones h2 {
  margin-bottom: 14px;
}

.estado-publicaciones {
  color: #64748b;
}

.error-publicaciones {
  color: #b91c1c;
}

.lista-publicaciones {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.item-publicacion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
}

.detalle-publicacion {
  min-width: 0;
}

.meta-publicacion {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  color: #334155;
  font-size: 13px;
}

.meta-publicacion time {
  color: #64748b;
  font-size: 12px;
}

.detalle-publicacion p {
  margin: 7px 0 0;
  color: #475569;
  font-size: 13px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.boton-eliminar {
  flex: 0 0 auto;
  padding: 9px 13px;
  border: 0;
  border-radius: 7px;
  background: #dc2626;
  color: white;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.boton-eliminar:hover:not(:disabled) {
  background: #b91c1c;
}

.boton-eliminar:disabled {
  cursor: wait;
  opacity: .7;
}

.mensaje-admin {
  margin: 16px 0 0;
  padding: 12px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 14px;
}

.mensaje-admin.exito {
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #166534;
}

.mensaje-admin.error {
  border-color: #fecaca;
  background: #fef2f2;
  color: #991b1b;
}

@media (max-width: 480px) {
  .admin-acciones {
    align-items: flex-start;
    flex-direction: column;
  }

  .item-publicacion {
    align-items: flex-start;
  }
}
</style>
