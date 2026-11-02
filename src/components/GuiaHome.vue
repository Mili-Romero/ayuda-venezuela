<template>
  <div class="guia-home-contenedor grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="columna-izquierda lg:col-span-2">
      <section class="tarjeta">
        <h1 class="titulo-seccion borde-azul">📌 Propósito de la Plataforma</h1>
        <p class="texto-proposito">
          <strong>plasist.org</strong> es una central de asistencia humanitaria digital e independiente.
          Nuestro objetivo es mitigar la fragmentación de la información durante situaciones de contingencia en Venezuela,
          reuniendo en un solo espacio seguro los canales de comunicación verificados, herramientas de monitoreo y redes de apoyo civil.
        </p>
      </section>

      <section class="tarjeta censo-destacado">
  <p class="etiqueta-censo">INFORMACIÓN CÍVICA · OCTUBRE DE 2026</p>
  <h2>{{ censo.titulo }}</h2>
  <p>{{ censo.descripcion }}</p>

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
</section>

      <section class="tarjeta publicaciones">
        <h2 class="titulo-seccion borde-amarillo">Últimas Publicaciones</h2>
        <p class="nota-publicaciones">Publicaciones de ejemplo; listas para conectarse a una API.</p>
        <div class="grid-publicaciones">
          <article v-for="publicacion in publicaciones" :key="publicacion.id" class="publicacion">
            <header class="publicacion-header">
              <span class="avatar-publicacion" aria-hidden="true">{{ publicacion.avatar }}</span>
              <div class="cuenta-publicacion">
                <h3>{{ publicacion.cuenta }}</h3>
                <time :datetime="publicacion.fechaIso">{{ publicacion.fecha }}</time>
              </div>
              <span class="red-publicacion">{{ publicacion.red }}</span>
            </header>
            <p class="texto-publicacion">{{ publicacion.texto }}</p>
            <footer class="publicacion-footer">
              <span aria-label="Me gusta">♥ {{ publicacion.meGusta }}</span>
              <span>{{ publicacion.comentarios }} comentarios</span>
            </footer>
          </article>
        </div>
      </section>
    </div>

    <aside class="columna-derecha lg:col-span-1">
      <section class="tarjeta panel-prevencion">
        <h2 class="titulo-seccion borde-azul">Antes, durante y después</h2>
        <p class="introduccion-prevencion">Consejos esenciales organizados por tipo de desastre.</p>

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
            <div v-if="guiaActiva === guia.id" :id="`guia-${guia.id}`" class="detalle-acordeon">
              <section v-for="fase in guia.fases" :key="fase.nombre" :class="['fase', fase.clase]">
                <h4>{{ fase.nombre }}</h4>
                <p>{{ fase.consejo }}</p>
              </section>
            </div>
          </article>
        </div>
      </section>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const guiaActiva = ref('sismos')

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

const censo = ref({
  titulo: 'Censo Nacional: Registro Constructores',
  enlace: 'https://monitoreociudadano.net',
  descripcion: 'Este espacio está diseñado para registrarnos en nuestra plataforma de constructores, donde no solo nos organizaremos para futuros procesos electorales, sino que también podremos sumar nuestras propuestas e ideas para la reconstrucción de la Venezuela libre y democrática que todos anhelamos.',
  subtituloRequisitos: '📍 ¿Qué necesitas llevar?',
  requisitos: [
    'Documento de identidad venezolano (cédula o pasaporte, vigente o vencido).',
    'Toda tu disposición y ganas de aportar al futuro de nuestro país.'
  ]
})

const publicaciones = ref([
  {
    id: 1,
    avatar: 'P',
    cuenta: 'plasist.org',
    red: 'Facebook',
    fecha: 'Publicación de ejemplo',
    fechaIso: '2026-10-01',
    texto: 'Revisa tu plan familiar: acuerda un punto de encuentro y mantén los contactos importantes accesibles sin conexión.',
    meGusta: 24,
    comentarios: 3
  },
  {
    id: 2,
    avatar: 'P',
    cuenta: 'plasist.org',
    red: 'Instagram',
    fecha: 'Publicación de ejemplo',
    fechaIso: '2026-10-02',
    texto: 'Una mochila de emergencia puede incluir agua, alimentos no perecederos, linterna, radio y un botiquín básico.',
    meGusta: 38,
    comentarios: 5
  },
  {
    id: 3,
    avatar: 'P',
    cuenta: 'plasist.org',
    red: 'Facebook',
    fecha: 'Publicación de ejemplo',
    fechaIso: '2026-10-03',
    texto: 'Durante una inundación, evita cruzar calles anegadas: la corriente puede ser peligrosa aunque parezca poco profunda.',
    meGusta: 17,
    comentarios: 2
  }
])

function alternarGuia(id) {
  guiaActiva.value = guiaActiva.value === id ? '' : id
}
</script>

<style scoped>
.guia-home-contenedor {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: start;
  }

  .columna-izquierda {
    grid-column: span 2 / span 2;
  }

  .columna-derecha {
    grid-column: span 1 / span 1;
  }

  .grid-publicaciones {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
