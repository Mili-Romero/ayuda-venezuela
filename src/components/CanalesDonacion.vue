<template>
  <div class="panel-interactivo">
    <h2>🤝 Canales de Donación Seguros</h2>
    <p class="instrucciones">Enlaces oficiales para canalizar aportes económicos de forma transparente.</p>
    <div class="lista-medicos">
      <div v-for="funda in fundaciones" :key="funda.nombre" class="item-medico border-funda">
        <div class="medico-header">
          <strong>{{ funda.nombre }}</strong>
          <a :href="funda.enlace" target="_blank" class="link-externo">Visitar ➡️</a>
        </div>
        <p class="desc-funda">{{ funda.descripcion }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import datosRecursos from '../data/recursos.json'
const fundaciones = computed(() => datosRecursos.fundaciones || [])
</script>

<style scoped>
.panel-interactivo { padding: 8px 6px; }
</style>
