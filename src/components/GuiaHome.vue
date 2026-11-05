<template>
  <div class="guia-home-contenedor">
    <div class="columna-izquierda lg:col-span-2">
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

      <section class="tarjeta publicaciones">
        <h2 class="titulo-seccion borde-amarillo">Últimas Publicaciones</h2>
        <p v-if="cargando" class="nota-publicaciones" aria-live="polite">
          Cargando publicaciones...
        </p>
        <p v-else-if="error" class="nota-publicaciones" role="alert">{{ error }}</p>
        <p v-else-if="publicaciones.length === 0" class="nota-publicaciones">
          No hay publicaciones disponibles.
        </p>
        <div class="grid-publicaciones">
          <article v-for="publicacion in publicaciones" :key="publicacion.id" class="publicacion">
            <header class="publicacion-header">
              <span class="avatar-publicacion" aria-hidden="true">P</span>
              <div class="cuenta-publicacion">
                <h3>plasist.org</h3>
                <time :datetime="publicacion.fecha">{{ publicacion.fecha }}</time>
              </div>
              <span class="red-publicacion">{{ publicacion.red_social }}</span>
            </header>
            <p class="texto-publicacion">{{ publicacion.texto }}</p>
            <footer v-if="publicacion.enlace_original" class="publicacion-footer">
              <a :href="publicacion.enlace_original" target="_blank" rel="noopener noreferrer">
                Ver publicación original
              </a>
            </footer>
          </article>
        </div>
      </section>
    </div>

    <section class="columna-derecha" aria-labelledby="titulo-prevencion">
      <div class="tarjeta panel-prevencion">
        <h2 id="titulo-prevencion" class="titulo-seccion borde-azul">
          Antes, durante y después
        </h2>
        <p class="introduccion-prevencion">
          Consejos esenciales organizados por tipo de desastre.
        </p>

        <div class="lista-acordeon">
          <article v-for="guia in guiasPrevencion" :key="guia.id" class="item-acordeon">
            <h3>
              <button
                type="button"
                class="boton-acordeon"
                :aria-expanded="guiaActiva === guia.id"
                :aria-controls="`guia-${guia.id}`"
                @click="alternarGuia(guia.id)"
              >
                <span>{{ guia.icono }} {{ guia.titulo }}</span>
                <span class="indicador-acordeon" aria-hidden="true">
                  {{ guiaActiva === guia.id ? '−' : '+' }}
                </span>
              </button>
            </h3>
            <div
              v-if="guiaActiva === guia.id"
              :id="`guia-${guia.id}`"
              class="detalle-acordeon"
            >
              <section
                v-for="fase in guia.fases"
                :key="fase.nombre"
                :class="['fase', fase.clase]"
              >
                <h4>{{ fase.nombre }}</h4>
                <p>{{ fase.consejo }}</p>
              </section>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import constructoresImagen from '../assets/images/constructores-banner.jpeg'
import constructoresVideo from '../assets/videos/constructores-guia.mp4'

const guiaActiva = ref('sismos')
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
const publicaciones = ref([])
const cargando = ref(true)
const error = ref(null)

const guiasPrevencion = [
  {
    id: 'sismos',
    icono: '🌋',
    titulo: 'Sismos y terremotos',
    fases: [
      { nombre: 'Antes', clase: 'fase-antes', consejo: 'Prepara una mochila de emergencia y asegura estantes y objetos pesados.' },
      { nombre: 'Durante', clase: 'fase-durante', consejo: 'Agáchate, cúbrete y sujétate; aléjate de ventanas y objetos que puedan caer.' },
      { nombre: 'Después', clase: 'fase-despues', consejo: 'Aléjate de estructuras dañadas, verifica servicios y prepárate para réplicas.' }
    ]
  },
  {
    id: 'inundaciones',
    icono: '🌊',
    titulo: 'Inundaciones y deslaves',
    fases: [
      { nombre: 'Antes', clase: 'fase-antes', consejo: 'Identifica rutas de evacuación y puntos seguros en zonas elevadas.' },
      { nombre: 'Durante', clase: 'fase-durante', consejo: 'Evacúa si hay riesgo; no camines ni conduzcas por corrientes o calles inundadas.' },
      { nombre: 'Después', clase: 'fase-despues', consejo: 'Evita el agua contaminada y no vuelvas a estructuras inestables.' }
    ]
  },
  {
    id: 'incendios',
    icono: '🔥',
    titulo: 'Incendios',
    fases: [
      { nombre: 'Antes', clase: 'fase-antes', consejo: 'Mantén despejadas las salidas y acuerda un punto de encuentro familiar.' },
      { nombre: 'Durante', clase: 'fase-durante', consejo: 'Sal por una ruta segura, mantente cerca del suelo si hay humo y no regreses.' },
      { nombre: 'Después', clase: 'fase-despues', consejo: 'No reingreses hasta que las autoridades indiquen que es seguro.' }
    ]
  }
]

async function cargarDatosDelBackend() {
  cargando.value = true
  error.value = null

  try {
    const respuesta = await fetch('http://localhost/plasist-backend/obtener_datos.php')
    if (!respuesta.ok) {
      throw new Error(`El servidor respondió con el estado ${respuesta.status}.`)
    }

    const datos = await respuesta.json()
    if (datos.success === false) {
      throw new Error(datos.message || 'El backend no pudo cargar los datos.')
    }
    if (!Array.isArray(datos.publicaciones)) {
      throw new Error('El formato de publicaciones recibido no es válido.')
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

    publicaciones.value = datos.publicaciones
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

function alternarGuia(id) {
  guiaActiva.value = guiaActiva.value === id ? '' : id
}
</script>

<style scoped>
.guia-home-contenedor {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.columna-izquierda,
.columna-derecha {
  min-width: 0;
}

.columna-izquierda {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.columna-izquierda .tarjeta,
.columna-derecha .tarjeta {
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

.nota-censo,
.nota-publicaciones {
  color: #64748b !important;
  font-size: 12px;
}

.publicaciones .titulo-seccion {
  margin-bottom: 12px;
}

.nota-publicaciones {
  margin: 0 0 14px;
}

.grid-publicaciones {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
}

.publicacion {
  min-width: 0;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
}

.publicacion-header {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 9px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.avatar-publicacion {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  border-radius: 50%;
  background: #1d4ed8;
  color: #fff;
  font-weight: 800;
}

.cuenta-publicacion {
  min-width: 0;
}

.cuenta-publicacion h3 {
  overflow: hidden;
  margin: 0;
  color: #1e293b;
  font-size: 13px;
  text-overflow: ellipsis;
}

.cuenta-publicacion time,
.red-publicacion {
  color: #64748b;
  font-size: 10px;
}

.red-publicacion {
  margin-left: auto;
  white-space: nowrap;
}

.texto-publicacion {
  margin: 12px 0;
  color: #334155;
  font-size: 12.5px;
  line-height: 1.5;
}

.publicacion-footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding-top: 9px;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 10px;
}

.introduccion-prevencion {
  margin: -4px 0 14px;
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.45;
}

.lista-acordeon {
  display: grid;
  gap: 8px;
}

.item-acordeon {
  overflow: hidden;
  margin: 0;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  background: #f8fafc;
}

.item-acordeon h3 {
  margin: 0;
}

.boton-acordeon {
  display: flex;
  width: 100%;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border: 0;
  background: transparent;
  color: #1e293b;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  text-align: left;
}

.boton-acordeon:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: -2px;
}

.indicador-acordeon {
  color: #1d4ed8;
  font-size: 20px;
  line-height: 1;
}

.detalle-acordeon {
  display: grid;
  gap: 7px;
  padding: 0 9px 9px;
}

.fase {
  padding: 8px 9px;
  border-left: 3px solid;
  border-radius: 5px;
  background: #fff;
}

.fase h4 {
  margin: 0 0 2px;
  font-size: 11px;
  text-transform: uppercase;
}

.fase p {
  margin: 0;
  color: #475569;
  font-size: 11.5px;
  line-height: 1.4;
}

.fase-antes { border-color: #16a34a; }
.fase-durante { border-color: #d97706; }
.fase-despues { border-color: #dc2626; }

@media (min-width: 640px) {
  .grid-publicaciones {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .guia-home-contenedor {
    grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
    align-items: start;
  }

  .censo-contenido {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .grid-publicaciones {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
