<template>
  <section class="sparkline panel">

    <!-- ENCABEZADO -->
    <div class="spark-header">

      <div>
        <h3>
          Actividad sísmica en Venezuela
        </h3>

        <span>
          Actividad sísmica reciente
        </span>
      </div>

      <div class="contador">
        {{ totalEventos }} eventos
      </div>

    </div>


    <!-- SIN DATOS -->
    <div
      v-if="!hayDatos"
      class="sin-datos"
    >
      <span class="sin-datos-icono">📊</span>

      <strong>
        No hay suficientes datos para generar la gráfica
      </strong>

      <small>
        La gráfica aparecerá cuando se registren eventos sísmicos.
      </small>
    </div>


    <!-- GRÁFICA -->
    <template v-else>

      <div class="grafico">

        <svg
          viewBox="0 0 500 120"
          preserveAspectRatio="none"
        >

          <!-- DEGRADADO -->
          <defs>

            <linearGradient
              id="relleno"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >

              <stop
                offset="0%"
                stop-color="#2563eb"
                stop-opacity=".35"
              />

              <stop
                offset="100%"
                stop-color="#2563eb"
                stop-opacity="0"
              />

            </linearGradient>

          </defs>


          <!-- ÁREA INFERIOR -->
          <!-- Solo aparece cuando existen 2 o más puntos -->
          <polygon
            v-if="puntos.length >= 2"
            :points="area"
            fill="url(#relleno)"
          />


          <!-- LÍNEA -->
          <!-- Solo aparece cuando existen 2 o más puntos -->
          <polyline
            v-if="puntos.length >= 2"
            :points="linea"
            fill="none"
            stroke="#2563eb"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />


          <!-- PUNTOS -->
          <circle
            v-for="(punto, index) in puntos"
            :key="index"
            :cx="punto.x"
            :cy="punto.y"
            r="5"
            fill="#2563eb"
          />

        </svg>

      </div>


      <!-- REFERENCIAS INFERIORES -->
      <div class="horas">

        <span>
          Más antiguo
        </span>

        <span>
          Reciente
        </span>

      </div>

    </template>

  </section>
</template>


<script setup>

import { computed } from "vue"


/*
|--------------------------------------------------------------------------
| DATOS RECIBIDOS DESDE SISMOSDASHBOARD
|--------------------------------------------------------------------------
|
| Ejemplo:
|
| [2.1, 3.4, 1.8, 4.2]
|
| Cada número representa la magnitud de un sismo.
|
*/

const props = defineProps({

  datos: {

    type: Array,

    default: () => []

  }

})


/*
|--------------------------------------------------------------------------
| DATOS VÁLIDOS
|--------------------------------------------------------------------------
|
| Eliminamos cualquier dato que:
|
| - no sea un número
| - sea NaN
| - sea infinito
|
*/

const valoresValidos = computed(() => {

  return props.datos

    .map(valor => Number(valor))

    .filter(valor => Number.isFinite(valor))

})


/*
|--------------------------------------------------------------------------
| COMPROBAR SI EXISTEN DATOS
|--------------------------------------------------------------------------
*/

const hayDatos = computed(() => {

  return valoresValidos.value.length > 0

})


/*
|--------------------------------------------------------------------------
| CREAR LOS PUNTOS DE LA GRÁFICA
|--------------------------------------------------------------------------
*/

const puntos = computed(() => {

  const valores = valoresValidos.value


  /*
  Si no existen datos,
  devolvemos una lista vacía.
  */

  if (!valores.length) {

    return []

  }


  /*
  Buscamos la magnitud máxima.

  Math.max(...[2.1, 3.5, 1.8])

  devuelve:

  3.5
  */

  const maximoReal = Math.max(...valores)


  /*
  Si todas las magnitudes fueran 0,
  evitamos dividir entre cero.
  */

  const maximo = maximoReal > 0
    ? maximoReal
    : 1


  /*
  CASO ESPECIAL:

  Si solamente existe un sismo,
  lo colocamos exactamente
  en el centro de la gráfica.

  x = 250
  porque la gráfica mide 500.
  */

  if (valores.length === 1) {

    const valor = valores[0]

    const y =
      100 - ((valor / maximo) * 80)

    return [

      {

        x: 250,

        y

      }

    ]

  }


  /*
  Si existen 2 o más eventos,
  distribuimos los puntos
  desde la izquierda hasta la derecha.
  */

  return valores.map((valor, index) => {

    const x =
      (index / (valores.length - 1)) * 500


    const y =
      100 - ((valor / maximo) * 80)


    return {

      x,

      y

    }

  })

})


/*
|--------------------------------------------------------------------------
| CREAR LA LÍNEA
|--------------------------------------------------------------------------
*/

const linea = computed(() => {

  return puntos.value

    .map(punto =>
      `${punto.x},${punto.y}`
    )

    .join(" ")

})


/*
|--------------------------------------------------------------------------
| CREAR EL ÁREA DEBAJO DE LA LÍNEA
|--------------------------------------------------------------------------
*/

const area = computed(() => {

  if (puntos.value.length < 2) {

    return ""

  }

  return [

    "0,120",

    linea.value,

    "500,120"

  ].join(" ")

})


/*
|--------------------------------------------------------------------------
| CONTADOR DE EVENTOS
|--------------------------------------------------------------------------
|
| Antes estabas sumando las magnitudes.
|
| Ahora contamos cuántos elementos
| existen realmente en el array.
|
*/

const totalEventos = computed(() => {

  return valoresValidos.value.length

})

</script>


<style scoped>

.sparkline {

  padding: 24px;

}


.spark-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 20px;

  margin-bottom: 20px;

}


h3 {

  margin: 0;

  font-size: 18px;

  color: #0f172a;

}


.spark-header span {

  font-size: 13px;

  color: #64748b;

}


.contador {

  background: #eff6ff;

  color: #2563eb;

  padding: 8px 14px;

  border-radius: 20px;

  font-size: 13px;

  font-weight: 700;

  white-space: nowrap;

}


.grafico {

  height: 160px;

  background: #f8fafc;

  border-radius: 14px;

  padding: 15px;

  border: 1px solid #e5e7eb;

}


svg {

  width: 100%;

  height: 100%;

  overflow: visible;

}


.horas {

  display: flex;

  justify-content: space-between;

  margin-top: 12px;

  font-size: 12px;

  color: #94a3b8;

}


/*
|--------------------------------------------------------------------------
| ESTADO SIN DATOS
|--------------------------------------------------------------------------
*/

.sin-datos {

  min-height: 140px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 7px;

  text-align: center;

  background: #f8fafc;

  border: 1px dashed #cbd5e1;

  border-radius: 14px;

  padding: 20px;

}


.sin-datos-icono {

  font-size: 28px;

}


.sin-datos strong {

  color: #334155;

  font-size: 14px;

}


.sin-datos small {

  color: #94a3b8;

  font-size: 12px;

}


@media(max-width:600px) {

  .sparkline {

    padding: 18px;

  }


  .spark-header {

    align-items: flex-start;

  }


  .grafico {

    height: 120px;

  }


  .contador {

    font-size: 11px;

    padding: 6px 10px;

  }

}

</style>