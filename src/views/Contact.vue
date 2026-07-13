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
.subtitulo { font-size: 13.5px; color: #64748b; margin-top: -10px; margin-bottom: 24px; }
.formulario-contacto { display: flex; flex-direction: column; gap: 16px; }
.grupo-campo { display: flex; flex-direction: column; gap: 6px; }
.grupo-campo label { font-size: 13.5px; font-weight: 700; color: #334155; }
.grupo-campo input, .grupo-campo textarea { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; }
.grupo-campo input:focus, .grupo-campo textarea:focus { outline: none; border-color: #1d4ed8; }
.btn-enviar { background-color: #1d4ed8; color: white; padding: 14px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
.btn-enviar:disabled { background-color: #94a3b8; cursor: not-allowed; }
.btn-secundario { background-color: transparent; border: 1px solid #cbd5e1; padding: 10px 16px; border-radius: 6px; cursor: pointer; }
.alerta { padding: 16px; border-radius: 8px; font-size: 14px; text-align: center; margin-top: 10px; }
.alerta-exito { background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
.alerta-error { background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }
</style>
