<template>
  <section class="admin-panel tarjeta">
    <h1 class="titulo-seccion borde-azul">Panel de administración</h1>
    <p class="aviso-demo">
      Acceso de demostración para David y el equipo. Este formulario todavía no autentica usuarios ni protege contenido.
    </p>

    <form class="formulario-admin" @submit.prevent="simularAcceso">
      <label for="admin-usuario">Nombre</label>
      <input id="admin-usuario" v-model.trim="usuario" autocomplete="username" required />

      <label for="admin-clave">Contraseña</label>
      <input id="admin-clave" v-model="clave" type="password" autocomplete="current-password" required />

      <button type="submit">Probar acceso</button>
    </form>

    <p v-if="mensaje" class="resultado-demo" role="status">{{ mensaje }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const usuario = ref('')
const clave = ref('')
const mensaje = ref('')

function simularAcceso() {
  mensaje.value = `Demostración iniciada para ${usuario.value}. La autenticación real debe validarse en el backend.`
}
</script>

<style scoped>
.admin-panel {
  max-width: 520px;
  margin: 0 auto;
}

.aviso-demo,
.resultado-demo {
  color: #475569;
  font-size: 14px;
}

.formulario-admin {
  display: grid;
  gap: 10px;
}

.formulario-admin label {
  color: #334155;
  font-weight: 700;
}

.formulario-admin input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

.formulario-admin input:focus {
  outline: 2px solid #93c5fd;
  outline-offset: 1px;
}

.formulario-admin button {
  margin-top: 8px;
  padding: 12px;
  border: 0;
  border-radius: 8px;
  background: #1d4ed8;
  color: white;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.resultado-demo {
  margin-bottom: 0;
  padding: 12px;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  background: #f0fdf4;
  color: #166534;
}
</style>
