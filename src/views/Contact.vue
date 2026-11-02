<template>
  <section class="contacto-contenedor">
    <div class="tarjeta">
      <h2 class="titulo-seccion">✉️ Enviar un Mensaje de Apoyo</h2>
      <p class="subtitulo">Si tienes dudas, reportes o quieres colaborar, escríbenos directamente.</p>

      <!-- Pantalla de Éxito -->
      <div v-if="enviadoExitosamente" class="alerta alerta-exito">
        <h3>¡Mensaje Recibido! ✨</h3>
        <p>Gracias por comunicarte. Revisaremos tu mensaje lo antes posible.</p>
        <button @click="restablecerFormulario" class="btn-secundario">Enviar otro mensaje</button>
      </div>

      <!-- Formulario -->
      <form v-else @submit.prevent="manejarEnvio" class="formulario-contacto">
        <div class="grupo-campo">
          <label for="nombre">Nombre Completo</label>
          <input type="text" id="nombre" v-model="datosFormulario.name" placeholder="Ej. Juan Pérez" required :disabled="estaCargando" />
        </div>

        <div class="grupo-campo">
          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="datosFormulario.email" placeholder="ejemplo@correo.com" required :disabled="estaCargando" />
        </div>

        <div class="grupo-campo">
          <label for="mensaje">Tu Mensaje</label>
          <textarea id="mensaje" v-model="datosFormulario.message" rows="5" placeholder="Escribe tu mensaje aquí..." required :disabled="estaCargando"></textarea>
        </div>

        <div v-if="mensajeError" class="alerta alerta-error">
          <p>⚠️ {{ mensajeError }}</p>
        </div>

        <button type="submit" class="btn-enviar" :disabled="estaCargando">
          <span>{{ estaCargando ? 'Enviando...' : 'Enviar Mensaje' }}</span>
        </button>
      </form>

      <nav class="redes-contacto" aria-label="Redes sociales">
        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" /></svg>
          Facebook
        </a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle class="icono-punto" cx="17.5" cy="6.5" r="1" /></svg>
          Instagram
        </a>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

const datosFormulario = reactive({ name: '', email: '', message: '' })
const estaCargando = ref(false)
const enviadoExitosamente = ref(false)
const mensajeError = ref('')

async function manejarEnvio() {
  estaCargando.value = true
  mensajeError.value = ''
  
  try {
    // Apunta de forma relativa a la raíz pública del hosting
    const respuesta = await fetch("/enviar-correo.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosFormulario)
    })

    const resultado = await respuesta.json()

    if (respuesta.ok && resultado.success) {
      enviadoExitosamente.value = true
    } else {
      throw new Error(resultado.message || "Error al procesar el envío.")
    }
  } catch (error) {
    mensajeError.value = error.message || "Error de conexión con el servidor.";
  } finally {
    estaCargando.value = false
  }
}

function restablecerFormulario() {
  datosFormulario.name = ''
  datosFormulario.email = ''
  datosFormulario.message = ''
  enviadoExitosamente.value = false
  mensajeError.value = ''
}
</script>

<style scoped>


.contacto-contenedor {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  
}

.contacto-contenedor > .tarjeta {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.subtitulo { font-size: 14.5px; color: #64748b; margin-top: -10px; margin-bottom: 24px; }
.formulario-contacto { display: flex; flex-direction: column; gap: 18px; width: 100%; }
.grupo-campo { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.grupo-campo label { font-size: 14.5px; font-weight: 700; color: #334155; }
.grupo-campo input, .grupo-campo textarea { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; }
.grupo-campo input:focus, .grupo-campo textarea:focus { outline: none; border-color: #1d4ed8; }
.btn-enviar { width: 100%; background-color: #1d4ed8; color: white; padding: 14px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
.btn-enviar:disabled { background-color: #94a3b8; cursor: not-allowed; }
.btn-secundario { background-color: transparent; border: 1px solid #cbd5e1; padding: 10px 16px; border-radius: 6px; cursor: pointer; }
.alerta { width: 100%; box-sizing: border-box; padding: 16px; border-radius: 8px; font-size: 14px; text-align: center; margin-top: 10px; }
.alerta-exito { background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
.alerta-error { background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }
.redes-contacto { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 20px; }
.redes-contacto a { display: inline-flex; align-items: center; gap: 7px; color: #1d4ed8; font-weight: 700; text-decoration: none; }
.redes-contacto svg { width: 20px; height: 20px; fill: currentColor; stroke: currentColor; stroke-width: 1.8; }
.redes-contacto svg rect, .redes-contacto svg circle { fill: none; }
.redes-contacto svg .icono-punto { fill: currentColor; }
</style>
