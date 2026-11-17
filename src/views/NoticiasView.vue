<template>
  <section class="noticias">
    <header class="encabezado-noticias">
      <p class="etiqueta-noticias">PLASIST.ORG</p>
      <h1 class="titulo-seccion borde-azul">Noticias</h1>
      <p class="introduccion-noticias">Publicaciones y actualizaciones de nuestras redes sociales.</p>
    </header>

    <p v-if="cargando" class="estado-noticias" aria-live="polite">Cargando noticias...</p>
    <p v-else-if="error" class="estado-noticias error-noticias" role="alert">{{ error }}</p>
    <p v-else-if="publicaciones.length === 0" class="estado-noticias">
      Todavía no hay noticias publicadas.
    </p>

    <div v-else class="grid-noticias">
      <article v-for="publicacion in publicaciones" :key="publicacion.id" class="tarjeta-noticia">
        <img
          v-if="urlSegura(publicacion.imagen_url)"
          class="imagen-noticia"
          :src="urlSegura(publicacion.imagen_url)"
          :alt="`Imagen de la publicación de ${publicacion.red_social || 'Plasist'}`"
          loading="lazy"
        />
        <div class="contenido-noticia">
          <header class="meta-noticia">
            <span class="red-noticia">{{ publicacion.red_social || 'Red social' }}</span>
            <time v-if="publicacion.fecha" :datetime="publicacion.fecha">
              {{ formatearFecha(publicacion.fecha) }}
            </time>
          </header>
          <p class="texto-noticia">{{ publicacion.texto }}</p>
          <a
            v-if="urlSegura(publicacion.enlace_original)"
            class="enlace-noticia"
            :href="urlSegura(publicacion.enlace_original)"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver publicación original
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const API_URL = 'https://plasist.org/obtener_datos.php'

const publicaciones = ref([])
const cargando = ref(true)
const error = ref('')

async function cargarPublicaciones() {
  cargando.value = true
  error.value = ''

  try {
    const respuesta = await fetch(API_URL)
    if (!respuesta.ok) {
      throw new Error(`El servidor respondió con el estado ${respuesta.status}.`)
    }

    const datos = await respuesta.json()
    if (datos.success === false) {
      throw new Error(datos.message || 'El backend no pudo cargar las noticias.')
    }
    if (!Array.isArray(datos.publicaciones)) {
      throw new Error('El backend no devolvió una lista válida de publicaciones.')
    }

    publicaciones.value = datos.publicaciones
  } catch (causa) {
    error.value = causa instanceof Error
      ? `No se pudieron cargar las noticias: ${causa.message}`
      : 'No se pudieron cargar las noticias del servidor local.'
    console.error(error.value, causa)
  } finally {
    cargando.value = false
  }
}

function urlSegura(valor) {
  if (typeof valor !== 'string' || !valor.trim()) return ''

  try {
    const url = new URL(valor)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : ''
  } catch {
    return ''
  }
}

function formatearFecha(valor) {
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime())
    ? valor
    : new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(fecha)
}

onMounted(cargarPublicaciones)
</script>

<style scoped>
.noticias {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.encabezado-noticias {
  margin-bottom: 20px;
}

.etiqueta-noticias {
  margin: 0 0 5px;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .1em;
}

.encabezado-noticias .titulo-seccion {
  margin-bottom: 8px;
}

.introduccion-noticias,
.estado-noticias {
  color: #64748b;
  line-height: 1.5;
}

.introduccion-noticias,
.estado-noticias {
  margin: 0;
}

.grid-noticias {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 290px), 1fr));
  gap: 18px;
}

.tarjeta-noticia {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: white;
  box-shadow: 0 8px 24px rgba(15, 23, 42, .07);
}

.imagen-noticia {
  display: block;
  width: 100%;
  max-height: 320px;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  background: #f1f5f9;
}

.contenido-noticia {
  padding: 16px;
}

.meta-noticia {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #64748b;
  font-size: 12px;
}

.red-noticia {
  padding: 5px 9px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 800;
}

.texto-noticia {
  margin: 14px 0 18px;
  color: #334155;
  line-height: 1.6;
  white-space: pre-wrap;
}

.enlace-noticia {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #1d4ed8;
  font-weight: 750;
  text-decoration: none;
}

.enlace-noticia:hover {
  text-decoration: underline;
}

.error-noticias {
  color: #b91c1c;
}
</style>
