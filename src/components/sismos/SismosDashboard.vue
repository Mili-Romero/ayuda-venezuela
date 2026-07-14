<template>
  <div class="sismos-dashboard">

    <!-- HEADER DEL SISTEMA -->
    <SismosHeader
      :ultimaActualizacion="ultimaActualizacion"
      :online="online"
    />

    <!-- ALERTA SÍSMICA -->
    <SismosAlerta
      v-if="alertaVisible && alertaActual"
      :key="alertaActual.id"
      :magnitud="alertaActual.mag"
      :lugar="alertaActual.lugar"
      @cerrar="cerrarAlerta"
    />

    <!-- ÚLTIMO SISMO DETECTADO -->
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

    <!-- LISTA DE ÚLTIMOS SISMOS -->
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
| ESTADO GENERAL
|--------------------------------------------------------------------------
*/

const loading = ref(true)

const online = ref(
  navigator.onLine
)


/*
|--------------------------------------------------------------------------
| TEMPORIZADOR DE ACTUALIZACIÓN
|--------------------------------------------------------------------------
*/

let intervaloActualizacion = null


/*
|--------------------------------------------------------------------------
| ACTUALIZAR LOS DATOS SÍSMICOS
|--------------------------------------------------------------------------
*/

async function actualizarSismos() {

  if (!navigator.onLine) {

    console.warn(
      "Sin conexión a internet"
    )

    return
  }


  try {

    console.log(
      "Actualizando actividad sísmica..."
    )

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
| CONEXIÓN A INTERNET
|--------------------------------------------------------------------------
*/

function conexionRestaurada() {

  online.value = true

  console.log(
    "Conexión restaurada"
  )

  actualizarSismos()

}


function conexionPerdida() {

  online.value = false

  console.warn(
    "Conexión perdida"
  )

}


/*
|--------------------------------------------------------------------------
| CUANDO SE ABRE EL COMPONENTE
|--------------------------------------------------------------------------
*/

onMounted(async () => {

  /*
  Primera actualización inmediata.
  */

  await actualizarSismos()


  /*
  Escuchar cambios de conexión.
  */

  window.addEventListener(
    "online",
    conexionRestaurada
  )

  window.addEventListener(
    "offline",
    conexionPerdida
  )


  /*
  Actualizar automáticamente
  cada 60 segundos.
  */

  intervaloActualizacion =
    setInterval(
      actualizarSismos,
      60000
    )

})


/*
|--------------------------------------------------------------------------
| CUANDO SE CIERRA EL COMPONENTE
|--------------------------------------------------------------------------
*/

onUnmounted(() => {

  if (intervaloActualizacion) {

    clearInterval(
      intervaloActualizacion
    )

  }


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

const ultimaActualizacion =
  ultimaConsulta


/*
|--------------------------------------------------------------------------
| ÚLTIMO SISMO DETECTADO
|--------------------------------------------------------------------------
|
| useSismos.js ya ordena los eventos
| desde el más reciente al más antiguo.
|
*/

const sismosDestacado =
  computed(() => {

    const data =
      sismos.value || []


    if (!data.length) {

      return {

        id: null,

        mag: 0,

        lugar:
          "No se registran eventos recientes",

        profundidad: 0,

        lat: 0,

        lon: 0,

        tiempo: "--",

        fuente: "--"

      }

    }


    /*
    El primer elemento
    es el evento más reciente.
    */

    return data[0]

  })


/*
|--------------------------------------------------------------------------
| CONFIGURACIÓN DE ALERTAS
|--------------------------------------------------------------------------
|
| Mostrar la MAYOR magnitud:
|
| - de los últimos 10 días
| - desde magnitud 2.0
|
*/

const MAGNITUD_ALERTA = 2.0

const DIAS_ALERTA = 10


const TIEMPO_VIGENCIA_ALERTA =

  DIAS_ALERTA *

  24 *

  60 *

  60 *

  1000


/*
|--------------------------------------------------------------------------
| ALERTA CERRADA POR EL USUARIO
|--------------------------------------------------------------------------
*/

const alertaCerradaId =
  ref(

    localStorage.getItem(
      "alertaSismoCerradaId"
    ) || ""

  )


/*
|--------------------------------------------------------------------------
| BUSCAR EL SISMO MÁS FUERTE
| DE LOS ÚLTIMOS 10 DÍAS
|--------------------------------------------------------------------------
*/

const alertaActual =
  computed(() => {

    const ahora =
      Date.now()


    /*
    Filtramos únicamente:
    
    - magnitud 2.0 o superior
    - últimos 10 días
    */

    const alertasRecientes =

      (sismos.value || [])
        .filter(
          sismo => {

            if (
              !sismo.timestamp
            ) {

              return false

            }


            const antiguedad =

              ahora -

              sismo.timestamp


            return (

              sismo.mag >=
                MAGNITUD_ALERTA

              &&

              antiguedad >= 0

              &&

              antiguedad <=
                TIEMPO_VIGENCIA_ALERTA

            )

          }
        )


    /*
    Si no existen eventos,
    no hay alerta.
    */

    if (
      !alertasRecientes.length
    ) {

      return null

    }


    /*
    Buscar el de mayor magnitud.
    
    Si dos tienen la misma magnitud,
    elegimos el más reciente.
    */

    return alertasRecientes.reduce(

      (
        masFuerte,
        sismo
      ) => {


        if (
          sismo.mag >
          masFuerte.mag
        ) {

          return sismo

        }


        if (

          sismo.mag ===
            masFuerte.mag

          &&

          sismo.timestamp >
            masFuerte.timestamp

        ) {

          return sismo

        }


        return masFuerte

      },

      alertasRecientes[0]

    )

  })


/*
|--------------------------------------------------------------------------
| DECIDIR SI MOSTRAR LA ALERTA
|--------------------------------------------------------------------------
*/

const alertaVisible =
  computed(() => {

    /*
    No existe ningún evento válido.
    */

    if (
      !alertaActual.value
    ) {

      return false

    }


    /*
    El usuario ya cerró
    exactamente esta alerta.
    */

    if (

      alertaActual.value.id ===

      alertaCerradaId.value

    ) {

      return false

    }


    return true

  })


/*
|--------------------------------------------------------------------------
| CERRAR ALERTA
|--------------------------------------------------------------------------
*/

function cerrarAlerta() {

  if (
    !alertaActual.value?.id
  ) {

    return

  }


  /*
  Guardamos el ID
  del evento cerrado.
  */

  alertaCerradaId.value =

    alertaActual.value.id


  /*
  Lo guardamos también
  en el navegador.
  */

  localStorage.setItem(

    "alertaSismoCerradaId",

    alertaActual.value.id

  )

}


/*
|--------------------------------------------------------------------------
| ESTADÍSTICAS
|--------------------------------------------------------------------------
*/

const estadisticas =
  computed(() => {

    const result = {

      fuertes: 0,

      moderados: 0,

      menores: 0

    }


    for (
      const sismo
      of sismos.value || []
    ) {

      if (
        sismo.mag >= 5.5
      ) {

        result.fuertes++

      } else if (
        sismo.mag >= 4
      ) {

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

const sparkline =
  computed(() => {

    return (
      sismos.value || []
    )
      .slice(
        0,
        20
      )
      .map(
        sismo =>
          sismo.mag
      )

  })


/*
|--------------------------------------------------------------------------
| ÚLTIMOS 4 SISMOS
|--------------------------------------------------------------------------
*/

const ultimosSismos =
  computed(() => {

    return (
      sismos.value
        ?.slice(
          0,
          4
        )
      || []
    )

  })

</script>