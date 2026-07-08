<template>
  <div class="comunicacion-panel">
    <StarlinkCard />

<!--  El nuevo directorio masivo en acordeón arriba -->
    <section class="panel-directorio">
      <DirectorioEmergencias />
    </section>


    <div class="tarjeta lista-whatsapp">
      <h2 class="titulo-seccion borde-amarillo">💬 Grupos de WhatsApp</h2>
      <p class="instrucciones">Únete a los grupos vecinales para coordinar ayuda, reportar necesidades y compartir rutas seguras.</p>
      <ul>
        <li v-for="grupo in gruposWhatsapp" :key="grupo.id" class="item-grupo">
          <a :href="grupo.url" target="_blank" rel="noopener noreferrer" class="grupo-link">
            {{ grupo.nombre }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import StarlinkCard from './StarlinkCard.vue'
import DirectorioEmergencias from './DirectorioEmergencias.vue'

const props = defineProps({
  gruposWhatsapp: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.comunicacion-panel {
  display: grid;
  gap: 18px;
}

.lista-whatsapp {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
}

.item-grupo {
  padding: 10px 0;
  border-bottom: 1px solid #e2e8f0;
}

.item-grupo:last-child {
  border-bottom: none;
}

.grupo-link {
  display: block;
  color: #1d4ed8;
  font-weight: 700;
  text-decoration: none;
}

.grupo-link:hover {
  text-decoration: underline;
}

.instrucciones {
  color: #475569;
  margin-bottom: 12px;
}
</style>
