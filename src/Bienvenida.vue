<template>
  <div class="pantalla-inicial">
    <!-- CAPA DE FONDO CON BLUR Y OPACIDAD -->
    <div class="fondo-difuminado"></div>
    
    <!-- CONTENEDOR CENTRAL DE ALERTA -->
    <div class="bloque-bienvenida">
      <!-- Detalle Tricolor Institucional -->
      <div class="barra-tricolor">
        <div class="barra-amarilla"></div>
        <div class="barra-azul"></div>
        <div class="barra-roja"></div>
      </div>

      <div class="contenido-bienvenida">
        <span class="emblema-alerta">🚨 CRISIS HUMANITARIA</span>
        <h1 class="titulo-bienvenida">PLAsist.org</h1>
        <p class="subtitulo-bienvenida">
          Plataforma de Asistencia Centralizada para la Coordinación de Auxilio y Localización de Personas tras el Sismo en Venezuela.
        </p>

        <!-- ZONA DE ACCIÓN: LOS DOS BOTONES -->
        <div class="botones-bienvenida">
          <!-- Botón de Donación Directa -->
          <a href="https://venteconmigo.org/donar/" target="_blank" class="btn-inicial btn-donar-urgente">
            ❤️ Donar a la Causa
          </a>
          
          <!-- Botón para Entrar al Portal Informativo -->
          <button @click="emitirEntrada" class="btn-inicial btn-entrar-portal">
            🔍 Entrar al Portal Informativo
          </button>
        </div>
        
        <p class="nota-bienvenida">Toda la información contenida en esta central es de carácter público y voluntario.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Definimos el evento para avisarle a App.vue que el usuario presionó entrar
const emit = defineEmits(['entrar'])

const emitirEntrada = () => {
  emit('entrar')
}
</script>

<style scoped>
/* CONTENEDOR PRINCIPAL FLOTANTE DE PANTALLA COMPLETA */
.pantalla-inicial {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Se superpone a absolutamente todo en el portal */
  padding: 15px;
  box-sizing: border-box;
}

/* EFECTO DE FONDO CON FOTO, BLUR Y OPACIDAD */
.fondo-difuminado {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/fondo.PNG'); /* Apunta directo a tu carpeta public/images/ */
  background-size: cover;
  background-position: center;
  filter: blur(8px) brightness(0.4);
  z-index: -1;
}

/* CAJA DE DIÁLOGO CENTRAL */
.bloque-bienvenida {
  background: rgba(255, 255, 255, 0.98); /* Fondo casi blanco semi-transparente elegante */
  max-width: 500px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  animation: entradaSuave 0.4s ease-out;
}

@keyframes entradaSuave {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* TRICOLOR DE CABECERA */
.barra-tricolor { display: flex; height: 6px; width: 100%; }
.barra-amarilla { background-color: #facc15; flex: 1; }
.barra-azul { background-color: #1d4ed8; flex: 1; }
.barra-roja { background-color: #dc2626; flex: 1; }

.contenido-bienvenida {
  padding: 30px 25px;
  text-align: center;
}

.emblema-alerta {
  display: inline-block;
  background: #fef2f2;
  color: #dc2626;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #fee2e2;
  letter-spacing: 0.5px;
}

.titulo-bienvenida {
  margin: 15px 0 5px 0;
  font-size: 36px;
  font-weight: 800;
  color: #1e3a8a;
}

.subtitulo-bienvenida {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  margin: 0 0 25px 0;
}

/* BOTONES RESPONSIVOS */
.botones-bienvenida {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-inicial {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border-radius: 8px;
  font-size: 14.5px;
  font-weight: 750;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s, transform 0.1s;
  width: 100%;
  box-sizing: border-box;
}

.btn-inicial:active { transform: scale(0.98); }

.btn-donar-urgente {
  background-color: #dc2626; /* Rojo de urgencia */
  color: white;
  box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2);
}
.btn-donar-urgente:hover { background-color: #b91c1c; }

.btn-entrar-portal {
  background-color: #1e3a8a; /* Azul institucional */
  color: white;
}
.btn-entrar-portal:hover { background-color: #1d4ed8; }

.nota-bienvenida {
  font-size: 11px;
  color: #94a3b8;
  margin: 0;
}

/* AJUSTE MÓVIL CRÍTICO */
@media (max-width: 480px) {
  .contenido-bienvenida { padding: 25px 15px; }
  .titulo-bienvenida { font-size: 30px; }
  .btn-inicial { padding: 12px; font-size: 13.5px; }
}
</style>
