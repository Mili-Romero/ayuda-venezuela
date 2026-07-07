<template>
  <div class="panel-interactivo">
    <h2>🩺 Red de Apoyo Médico</h2>
    <p class="instrucciones">Profesionales ofreciendo telemedicina y contención psicológica gratuita.</p>
    <div class="lista-medicos">
      <div v-for="medico in medicos" :key="medico.nombre" class="item-medico">
        <div class="medico-header">
          <strong>👤 {{ medico.nombre }}</strong>
        </div>
        <div class="medico-especialidad">{{ medico.especialidad }}</div>
        <span class="medico-contacto">💬 {{ medico.contacto }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import datosRecursos from '../data/recursos.json'
const medicos = computed(() => datosRecursos.medicos || [])
</script>

<style scoped>
.panel-interactivo { padding: 8px 6px; }
</style>
