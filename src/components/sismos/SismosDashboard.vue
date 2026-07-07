<template>
  <div class="sismos-dashboard">

 <!-- HEADER DEL SISTEMA -->
    <SismosHeader
      :ultimaActualizacion="ultimaActualizacion"
      :online="online"
    />

    <!-- ALERTA -->
    <SismosAlerta
      v-if="alertaVisible"
      :magnitud="sismosDestacado.mag"
      :lugar="sismosDestacado.lugar"
    />

    <!-- SISMO DESTACADO -->
    <SismosDestacado
      :sismos="sismosDestacado"
    />
    
    <!-- SISMO ESTADÍSTICAS -->
    <SismosStats
    :fuertes="estadisticas.fuertes"
    :moderados="estadisticas.moderados"
    :menores="estadisticas.menores"
    />
    
    <!-- SISMO Sparkline -->
    <SismosSparkline
    :datos="sparkline"
    />

    <!-- SISMO Lista -->
    <SismosLista
    :sismos="ultimosSismos"
    />

    <!-- FOOTER -->
    <SismosFooter
      :ultimaActualizacion="ultimaActualizacion"
      :online="online"
    />

  </div>
</template>

<script setup>

import { ref, onMounted, computed } from "vue"

import { useSismos } from "./composables/useSismos"

import SismosHeader from "./SismosHeader.vue"
import SismosDestacado from "./SismosDestacado.vue"
import SismosStats from "./SismosStats.vue"
import SismosSparkline from "./SismosSparkline.vue"
import SismosLista from "./SismosLista.vue"
import SismosFooter from "./SismosFooter.vue"
import SismosAlerta from "./SismosAlerta.vue"

import "./sismos.css"

/*
Estos datos son temporales.
Después los sustituiremos por los datos de tu API.
*/
const {
    sismos,
    obtenerSismos,
    ultimaActualizacion: ultimaUSGS
} = useSismos()

const loading = ref(true)

onMounted(async () => {
  try {
    await obtenerSismos()

    if (import.meta.env.DEV) {
      console.log("Sismos USGS:", sismos.value)
    }

  } catch (error) {
    console.error("Error obteniendo sismos:", error)
  } finally {
    loading.value = false
  }
})

const online = ref(navigator.onLine)

onMounted(() => {
  window.addEventListener("online", () => online.value = true)
  window.addEventListener("offline", () => online.value = false)
})

const ultimaActualizacion = ultimaUSGS

const sismosDestacado = computed(() => {
  const data = sismos.value || []

  if (!data.length) {
    return {
      mag: 0,
      lugar: "Sin datos",
      profundidad: 0,
      lat: 0,
      lon: 0,
      hora: "--"
    }
  }

  return data.reduce((max, s) => s.mag > max.mag ? s : max, data[0])
})



const alertaVisible = computed(()=>{


    return sismosDestacado.value.mag >= 5.5


})

const estadisticas = computed(() => {
  const result = {
    fuertes: 0,
    moderados: 0,
    menores: 0,
    hoy: 0
  }

  for (const s of sismos.value || []) {
    result.hoy++

    if (s.mag >= 5.5) result.fuertes++
    else if (s.mag >= 4) result.moderados++
    else result.menores++
  }

  return result
})

const sparkline = computed(() => {
  return (sismos.value || []).slice(0, 20).map(s => s.mag)
})

const ultimosSismos = computed(() => {
  return sismos.value?.slice(0, 4) || []
})

</script>