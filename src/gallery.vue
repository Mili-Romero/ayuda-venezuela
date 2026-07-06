<template>
  <!-- Bloque 2: Galería de Fotos de Sobrevivientes (Diseño Carrusel y Visor Integrado) -->
  <div class="tarjeta">
    <h2 class="titulo-seccion borde-amarillo">📸 Listas Manuscritas de Sobrevivientes (Zonas de Refugio)</h2>
    <p class="instrucciones">
      Fotos de los listados tomados a mano en los camppos de golf de Caraballeda. 
      Usa las flechas para deslizarte y toca cualquier imagen para ampliarla y hacerle zoom con tus dedos [13:02].
    </p>
    
    <!-- Contenedor del Carrusel Desplazable -->
    <div class="carrusel-contenedor">
      <button class="btn-carrusel prev" @click="scrollCarrusel(-1)">❮</button>
      
      <div class="galeria-listas-carrusel" ref="carruselRef">
        <div v-for="foto in listaFotos" :key="foto.id" class="tarjeta-foto" @click="abrirVisor(foto)">
          <div class="wrapper-imagen">
            <img 
              :src="foto.url" 
              @error="corregirExtensionWhatsApp($event, foto)" 
              class="img-lista" 
              alt="Lista de sobrevivientes"
            />
          </div>
          <div class="foto-titulo">{{ foto.titulo }}</div>
        </div>
      </div>
      
      <button class="btn-carrusel next" @click="scrollCarrusel(1)">❯</button>
    </div>
  </div>

  <!-- VENTANA EMERGENTE (MODAL) PARA AMPLIAR LA FOTO SELECCIONADA -->
  <div v-if="fotoSeleccionada" class="visor-modal-overlay" @click="cerrarVisor">
    <div class="visor-modal-contenido" @click.stop>
      <button class="btn-cerrar-modal" @click="cerrarVisor">✕</button>
      <img :src="fotoSeleccionada.url" class="img-modal-ampliada" alt="Lista ampliada" />
      <div class="modal-titulo-pie">{{ fotoSeleccionada.titulo }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

// Recibimos los datos de las fotos directamente desde el archivo central de recursos de App.vue
defineProps({
  listaFotos: {
    type: Array,
    required: true
  }
})

const fotoSeleccionada = ref(null)
const carruselRef = useTemplateRef('carruselRef')

const abrirVisor = (foto) => {
  fotoSeleccionada.value = foto
  document.body.style.overflow = 'hidden'
}

const cerrarVisor = () => {
  fotoSeleccionada.value = null
  document.body.style.overflow = ''
}

const scrollCarrusel = (direccion) => {
  if (carruselRef.value) {
    const distancia = 320 * direccion
    carruselRef.value.scrollBy({ left: distancia, behavior: 'smooth' })
  }
}

// Función inteligente tolerante a formatos de WhatsApp (.jpg, .jpeg, .JPEG, .png)
const corregirExtensionWhatsApp = (evento, foto) => {
  const imagenHtml = evento.target
  if (imagenHtml.src.endsWith('.jpg')) {
    imagenHtml.src = foto.url.replace('.jpg', '.jpeg')
  } else if (imagenHtml.src.endsWith('.jpeg')) {
    imagenHtml.src = foto.url.replace('.jpg', '.JPEG')
  } else if (imagenHtml.src.endsWith('.JPEG')) {
    imagenHtml.src = foto.url.replace('.jpg', '.png')
  }
}
</script>

<style scoped>
/* DISEÑO EXCLUSIVO DEL CARRUSEL HORIZONTAL */
.carrusel-contenedor {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.galeria-listas-carrusel {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  scroll-behavior: smooth;
  width: 100%;
  padding: 10px 0;
  /* Oculta la barra de scroll fea en navegadores */
  scrollbar-width: none; 
}

.galeria-listas-carrusel::-webkit-scrollbar {
  display: none;
}

.tarjeta-foto {
  flex: 0 0 140px; /* Tamaño ideal y fijo para miniaturas en móviles */
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
}

/* 📱 CORRECCIÓN QUIRÚRGICA PARA CELULARES (PANTALLAS CHICAS) */
@media (max-width: 768px) {
  .tarjeta-foto {
    flex: 0 0 120px; /* Se hace un pelo más pequeña en teléfonos para que quepan más en pantalla */
  }
  
  .btn-carrusel {
    display: none !important; /* Escondemos las flechas en celulares; la gente desliza con el dedo de forma nativa */
  }
  
  .galeria-listas-carrusel {
    padding-left: 5px;
    padding-right: 5px;
  }

  .visor-modal-contenido {
    max-width: 95%; /* Aprovecha casi todo el ancho del teléfono */
    max-height: 90vh;
  }

  .img-modal-ampliada {
    max-height: 75vh; /* Evita que el título del pie se corte en pantallas alargadas */
  }
}


.tarjeta-foto:hover {
  transform: translateY(-4px);
  border-color: #94a3b8;
}

.wrapper-imagen {
  width: 100%;
  height: 180px;
  background-color: #cbd5e1;
}

.img-lista {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.foto-titulo {
  font-size: 11px;
  font-weight: 700;
  color: #334155;
  padding: 8px;
  text-align: center;
  background: white;
  border-top: 1px solid #e2e8f0;
}

/* BOTONES FLOTANTES DEL CARRUSEL */
.btn-carrusel {
  position: absolute;
  background: rgba(30, 41, 59, 0.8);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-carrusel:hover { background: #1e293b; }
.prev { left: -10px; }
.next { right: -10px; }

/* DISEÑO DE LA VENTANA MODAL (VISOR AMPLIADO) */
.visor-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.9); /* Fondo oscuro profundo */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 10px;
}

.visor-modal-contenido {
  position: relative;
  max-width: 90%;
  max-height: 85vh;
  background: white;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.img-modal-ampliada {
  width: 100%;          /* Fuerza a la foto a ocupar el ancho del contenedor */
  max-width: 600px;     /* Evita que se pixele en pantallas gigantes de computadora */
  height: auto;         /* Mantiene la proporción original de la lista sin deformarla */
  max-height: 70vh;     /* Congela la altura para que no se salga de la pantalla del celular */
  object-fit: contain;  /* Centra la lista de forma impecable */
  border-radius: 4px;
}


.modal-titulo-pie {
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 5px 4px 5px;
  color: #1e293b;
}

.btn-cerrar-modal {
  position: absolute;
  top: -15px;
  right: -15px;
  background: #dc2626;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>
