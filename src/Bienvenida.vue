<template>
  <div class="pantalla-inicial">
    <!-- CAPA DE FONDO CON BLUR Y OPACIDAD (RESPETA TU RUTA ACTUAL) -->
    <div class="fondo-difuminado"></div>
    
    <!-- CONTENEDOR CENTRAL TRANSPARENTE / MINIMALISTA -->
    <div class="bloque-bienvenida">
      <div class="contenido-bienvenida">
       <!-- <span class="emblema-alerta">🚨 CRISIS HUMANITARIA</span>-->
        <h1 class="titulo-bienvenida">plasist.org</h1>
        <p class="subtitulo-bienvenida">
          Plataforma de Asistencia Centralizada
        </p>

        <!-- ZONA DE ACCIÓN: BOTONES MÁS CORTOS, MINIMALISTAS Y JUNTOS -->
        <div class="zona-botones-contenedor">
          <div class="botones-bienvenida">
            <!-- Botón de Donación Directa -->
            <a href="https://venteconmigo.org/donar/" target="_blank" class="btn-inicial btn-donar-urgente">
              ❤️ Donar
            </a>
            
            <!-- Botón para Entrar al Portal Informativo -->
            <button @click="emitirEntrada" class="btn-inicial btn-entrar-portal">
              🔍 Entrar
            </button>
          </div>
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
  padding: 20px;
  box-sizing: border-box;
}

/* EFECTO DE FONDO CON TU RUTA FÍSICA Y EXTENSIÓN EXACTA EN MAYÚSCULAS */
.fondo-difuminado {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/fondo.PNG'); /* Mantiene intacto tu archivo local */
  background-size: cover;
  background-position: center;
  filter: blur(1px) brightness(0.35); /* Bajamos el blur para que se aprecie más tu foto de fondo */
  z-index: -1;
}

/* CAJA CENTRAL SIN FONDO BLANCO SÓLIDO (DISEÑO TIPO CRISTAL TRASLÚCIDO) 
.bloque-bienvenida {
  max-width: 550px;
  width: 100%;
  border-radius: 16px;
  background: rgba(15, 23, 42, .19);  Fondo oscuro traslúcido elegante 
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: entradaSuave 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}*/

@keyframes entradaSuave {
  from { transform: translateY(15px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.contenido-bienvenida {
  padding: 40px 30px;
  text-align: center;
}
/*
.emblema-alerta {
  display: inline-block;
  background: rgba(220, 38, 38, 0.2);
  color: #fca5a5;
  font-size: 10.5px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(220, 38, 38, 0.3);
  letter-spacing: 0.75px;
}*/

/* TEXTOS ADAPTADOS PARA MÁXIMA LEGIBILIDAD SOBRE EL NUEVO FONDO */
.titulo-bienvenida {
  margin: 20px 0 8px 0;
  font-size: 42px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.subtitulo-bienvenida {
  font-size: 14.5px;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0 0 30px 0;
}

/* CONTENEDOR PARA HACER LOS BOTONES MÁS CORTOS Y COMPACTOS */
.zona-botones-contenedor {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 25px;
}

.botones-bienvenida {
  display: flex;
  flex-direction: row; /* Los posiciona uno al lado del otro */
  gap: 15px;
  width: 100%;
  max-width: 360px; /* Acorta el ancho del bloque de botones para que no abarquen todo */
}

.btn-inicial {
  flex: 1; /* Hace que ambos botones tengan exactamente el mismo ancho */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.btn-inicial:active { transform: scale(0.97); }

/* DISEÑO MINIMALISTA DE LOS BOTONES */
.btn-donar-urgente {
  background-color: #112233; /* El azul marino profundo exacto del fondo de la página */
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 12px rgba(17, 34, 51, 0.3);
}

.btn-donar-urgente:hover {
  background-color: #1a334d; /* Un tono un poco más claro al pasar el ratón */
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 6px 16px rgba(17, 34, 51, 0.4);
}

.btn-entrar-portal {
  background-color: rgba(255, 255, 255, 0.12); /* Cristal translúcido sutil */
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
}

.btn-entrar-portal:hover {
  background-color: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.35);
}


.nota-bienvenida {
  font-size: 13px;
  color: #cee881;
  margin: 0;
}

/* DISPOSITIVOS MÓVILES (RESPONSIVO) */
@media (max-width: 480px) {
  .contenido-bienvenida { padding: 30px 20px; }
  .titulo-bienvenida { font-size: 32px; }
  .subtitulo-bienvenida { font-size: 13.5px; }
  .botones-bienvenida { 
    flex-direction: column; /* En teléfonos muy angostos se vuelven a apilar para que no se machaquen */
    gap: 10px;
  }
  .btn-inicial { padding: 11px; }
}
</style>
