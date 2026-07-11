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

    <!-- ESTADÍSTICAS -->
    <SismosStats
      :fuertes="estadisticas.fuertes"
      :moderados="estadisticas.moderados"
      :menores="estadisticas.menores"
    />

    <!-- GRÁFICA -->
    <SismosSparkline
      :datos="sparkline"
    />

    <!-- LISTA -->
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

import {
  ref,
  onMounted,
  onUnmounted,
  computed
} from "vue"

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
|--------------------------------------------------------------------------
| DATOS DE LOS SISMOS
|--------------------------------------------------------------------------
*/

const {
  sismos,
  obtenerSismos,
  ultimaActualizacion: ultimaConsulta
} = useSismos()


/*
|--------------------------------------------------------------------------
| ESTADO DEL SISTEMA
|--------------------------------------------------------------------------
*/

const loading = ref(true)

const online = ref(navigator.onLine)


/*
|--------------------------------------------------------------------------
| TEMPORIZADOR DE ACTUALIZACIÓN
|--------------------------------------------------------------------------
|
| Aquí guardaremos el intervalo para poder detenerlo después.
|
*/

let intervaloActualizacion = null


/*
|--------------------------------------------------------------------------
| FUNCIÓN PARA ACTUALIZAR LOS SISMOS
|--------------------------------------------------------------------------
*/

async function actualizarSismos() {

  // Si no hay internet, no intentamos consultar USGS
  if (!navigator.onLine) {
    console.warn("Sin conexión a internet")
    return
  }

  try {

    console.log("Actualizando actividad sísmica...")

    await obtenerSismos()

  } catch (error) {

    console.error(
      "Error obteniendo información sísmica:",
      error
    )

  } finally {

    loading.value = false

  }
}


/*
|--------------------------------------------------------------------------
| FUNCIONES DE CONEXIÓN
|--------------------------------------------------------------------------
*/

function conexionRestaurada() {

  online.value = true

  console.log("Conexión restaurada")

  // Actualizamos inmediatamente cuando vuelve internet
  actualizarSismos()

}


function conexionPerdida() {

  online.value = false

  console.warn("Conexión perdida")

}


/*
|--------------------------------------------------------------------------
| CUANDO EL COMPONENTE SE ABRE
|--------------------------------------------------------------------------
*/

onMounted(async () => {

  // 1. Descargar los datos inmediatamente
  await actualizarSismos()


  // 2. Escuchar cambios de conexión
  window.addEventListener(
    "online",
    conexionRestaurada
  )

  window.addEventListener(
    "offline",
    conexionPerdida
  )


  // 3. Actualizar automáticamente cada 60 segundos
  intervaloActualizacion = setInterval(() => {

    actualizarSismos()

  }, 60000)

})


/*
|--------------------------------------------------------------------------
| CUANDO EL USUARIO SALE DEL PANEL
|--------------------------------------------------------------------------
*/

onUnmounted(() => {

  // Detener el temporizador
  if (intervaloActualizacion) {

    clearInterval(intervaloActualizacion)

  }


  // Eliminar los listeners
  window.removeEventListener(
    "online",
    conexionRestaurada
  )

  window.removeEventListener(
    "offline",
    conexionPerdida
  )

})


/*
|--------------------------------------------------------------------------
| ÚLTIMA ACTUALIZACIÓN
|--------------------------------------------------------------------------
*/

const ultimaActualizacion = ultimaConsulta


/*
|--------------------------------------------------------------------------
| SISMO DESTACADO
|--------------------------------------------------------------------------
|
| Busca el sismo con mayor magnitud.
|
*/

const sismosDestacado = computed(() => {

  const data = sismos.value || []

  if (!data.length) {

    return {

      mag: 0,

      lugar: "No se registran eventos recientes",

      profundidad: 0,

      lat: 0,

      lon: 0,

      hora: "--"

    }

  }

  return data.reduce(

    (max, sismo) =>
      sismo.mag > max.mag
        ? sismo
        : max,

    data[0]

  )

})


/*
|--------------------------------------------------------------------------
| ALERTA
|--------------------------------------------------------------------------
|
| Solo aparece si hay un evento de magnitud 5.5 o superior.
|
*/

const alertaVisible = computed(() => {

  return sismosDestacado.value.mag >= 5.5

})


/*
|--------------------------------------------------------------------------
| ESTADÍSTICAS
|--------------------------------------------------------------------------
*/

const estadisticas = computed(() => {

  const result = {

    fuertes: 0,

    moderados: 0,

    menores: 0

  }


  for (const sismo of sismos.value || []) {

    if (sismo.mag >= 5.5) {

      result.fuertes++

    } else if (sismo.mag >= 4) {

      result.moderados++

    } else {

      result.menores++

    }

  }


  return result

})


/*
|--------------------------------------------------------------------------
| GRÁFICA
|--------------------------------------------------------------------------
*/

const sparkline = computed(() => {

  return (sismos.value || [])
    .slice(0, 20)
    .map(sismo => sismo.mag)

})


/*
|--------------------------------------------------------------------------
| ÚLTIMOS SISMOS
|--------------------------------------------------------------------------
*/

const ultimosSismos = computed(() => {

  return sismos.value?.slice(0, 4) || []

})

</script>