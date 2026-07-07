<template>
  <div class="panel-interactivo">
    <h2>🌐 Plataformas Aliadas</h2>
    <p class="instrucciones">Herramientas y proyectos de apoyo que complementan la ayuda humanitaria.</p>
    <div class="lista-medicos">
      <div v-for="plat in plataformas" :key="plat.titulo" class="item-medico border-plat">
        <div class="medico-header">
          <strong>{{ plat.titulo }}</strong>
          <a :href="plat.enlace" target="_blank" class="link-externo">Visitar ➡️</a>
        </div>
        <div class="autor-plat">{{ plat.autor }}</div>
        <p class="desc-funda">{{ plat.descripcion }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import datosRecursos from '../data/recursos.json'
const plataformas = computed(() => datosRecursos.plataformas || [])
</script>

<style scoped>
.panel-interactivo { padding: 8px 6px; }
</style>
