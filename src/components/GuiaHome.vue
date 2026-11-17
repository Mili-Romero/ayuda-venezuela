<template>
  <div class="guia-home-contenedor">
    <div class="columna-inicio">
      <section class="tarjeta">
        <h1 class="titulo-seccion borde-azul">📌 Propósito de la Plataforma</h1>
        <p class="texto-proposito">
          <strong>plasist.org</strong> es una central de asistencia humanitaria digital e independiente.
          Nuestro objetivo es mitigar la fragmentación de la información durante situaciones de contingencia en Venezuela,
          reuniendo en un solo espacio seguro los canales de comunicación verificados, herramientas de monitoreo y redes de apoyo civil.
        </p>
      </section>

      <section v-if="cargando" class="tarjeta censo-destacado" aria-live="polite">
        <p>Cargando información del censo...</p>
      </section>
      <section v-else-if="censo" class="tarjeta censo-destacado">
        <div class="censo-contenido">
          <div class="censo-visual">
            <img
              class="censo-imagen"
              :src="censo.imagenUrl"
              :alt="`Imagen informativa: ${censo.titulo}`"
            />
            <video
              class="censo-video"
              controls
              preload="metadata"
              :poster="censo.imagenUrl"
              :src="censo.videoUrl"
              aria-label="Video explicativo del registro de constructores"
            >
              Tu navegador no admite la reproducción de video.
            </video>
          </div>

          <div class="censo-texto">
            <p class="etiqueta-censo">INFORMACIÓN CÍVICA</p>
            <h2>{{ censo.titulo }}</h2>
            <p class="censo-eslogan">{{ censo.eslogan }}</p>
            <p class="censo-descripcion">{{ censo.descripcion }}</p>

            <h3>{{ censo.subtituloRequisitos }}</h3>
            <ul>
              <li v-for="(requisito, index) in censo.requisitos" :key="index">
                {{ requisito }}
              </li>
            </ul>

            <a
              :href="censo.enlace"
              target="_blank"
              rel="noopener noreferrer"
              class="boton-registro"
            >
              Ir al registro
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import constructoresImagen from '../assets/images/constructores-banner.jpeg'
import constructoresVideo from '../assets/videos/constructores-guia.mp4'

const censo = ref({
  titulo: 'Censo Nacional: Registro Constructores',
  enlace: 'https://monitoreociudadano.net',
  eslogan: 'Tu cara es tu llave: una persona. Una identidad.',
  descripcion: 'Regístrate en la plataforma independiente de constructores para organizarnos en futuros procesos electorales y sumar propuestas para la reconstrucción del país.',
  subtituloRequisitos: '📍 ¿Qué necesitas llevar?',
  requisitos: [
    'Documento de identidad venezolano (cédula o pasaporte, vigente o vencido).',
    'Toda tu disposición y ganas de aportar al futuro de nuestro país.'
  ],
  imagenUrl: constructoresImagen,
  videoUrl: constructoresVideo
})
const cargando = ref(true)
const error = ref(null)

async function cargarDatosDelBackend() {
  cargando.value = true
  error.value = null

  try {
    const respuesta = await fetch('https://plasist.org/obtener_datos.php')
    if (!respuesta.ok) {
      throw new Error(`El servidor respondió con el estado ${respuesta.status}.`)
    }

    const datos = await respuesta.json()
    if (datos.success === false) {
      throw new Error(datos.message || 'El backend no pudo cargar los datos.')
    }
    if (datos.censo && typeof datos.censo === 'object') {
      const requisitos = datos.censo.requisitos
      censo.value = {
        ...censo.value,
        ...datos.censo,
        subtituloRequisitos: censo.value.subtituloRequisitos,
        requisitos: Array.isArray(requisitos)
          ? requisitos
          : typeof requisitos === 'string' && requisitos.trim()
            ? requisitos.split(/\r?\n/).filter(Boolean)
            : censo.value.requisitos,
        imagenUrl: constructoresImagen,
        videoUrl: constructoresVideo
      }
    }

  } catch (causa) {
    error.value = causa instanceof Error
      ? `No se pudieron cargar los datos: ${causa.message}`
      : 'No se pudieron cargar los datos del servidor local.'
    console.error(error.value, causa)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarDatosDelBackend()
})

</script>

<style scoped>
.guia-home-contenedor {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}

.columna-inicio {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 24px;
}

.columna-inicio .tarjeta {
  margin-bottom: 0;
}

.texto-proposito {
  margin: 0;
  color: #334155;
  font-size: 14.5px;
  line-height: 1.65;
}

.censo-destacado {
  border-color: #bfdbfe;
  background: linear-gradient(135deg, #eff6ff, #fff);
}

.censo-contenido {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
}

.censo-visual,
.censo-texto {
  min-width: 0;
}

.censo-visual {
  display: grid;
  align-content: start;
  gap: 12px;
}

.censo-imagen,
.censo-video {
  display: block;
  width: 100%;
  border-radius: 12px;
}

.censo-imagen {
  height: auto;
  object-fit: cover;
}

.censo-video {
  max-height: 340px;
  background: #0f172a;
}

.censo-eslogan {
  margin: 0 0 10px;
  color: #1d4ed8;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.4;
}

.censo-descripcion {
  margin: 0 0 12px;
  color: #334155;
  line-height: 1.6;
}

.censo-texto h3 {
  margin: 14px 0 8px;
  color: #1e3a8a;
  font-size: 15px;
}

.censo-texto ul {
  display: grid;
  gap: 7px;
  margin: 0 0 18px;
  padding-left: 20px;
  color: #334155;
}

.boton-registro {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 10px 18px;
  border-radius: 8px;
  background: #1d4ed8;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}

.boton-registro:hover {
  background: #1e40af;
}

.etiqueta-censo {
  margin: 0 0 6px;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .08em;
}

.censo-destacado h2 {
  margin: 0 0 8px;
  color: #1e3a8a;
  font-size: 20px;
  line-height: 1.3;
}

.censo-destacado p:not(.etiqueta-censo) {
  margin-bottom: 8px;
  color: #334155;
}

.nota-censo {
  color: #64748b !important;
  font-size: 12px;
}

@media (min-width: 1024px) {
  .censo-contenido {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
