import { ref } from "vue"


/*
|--------------------------------------------------------------------------
| ESTADO GLOBAL
|--------------------------------------------------------------------------
*/

const sismos = ref([])
const ultimaActualizacion = ref("")
const fuenteActiva = ref("")
const errorSismos = ref("")


/*
|--------------------------------------------------------------------------
| ZONA GEOGRÁFICA APROXIMADA DE VENEZUELA
|--------------------------------------------------------------------------
*/

const LIMITES_VENEZUELA = {
  norte: 13.5,
  sur: 0.5,
  oeste: -73.6,
  este: -59.7
}


/*
|--------------------------------------------------------------------------
| CONFIGURACIÓN
|--------------------------------------------------------------------------
*/

// Buscar eventos de los últimos 30 días
const DIAS_BUSQUEDA = 30

// Magnitud mínima solicitada
const MAGNITUD_MINIMA = 0

// Máximo de eventos que guardamos
const MAX_EVENTOS = 100


/*
|--------------------------------------------------------------------------
| PRIORIDAD DE FUENTES
|--------------------------------------------------------------------------
*/

const PRIORIDAD_FUENTES = {
  EMSC: 2,
  USGS: 1
}


/*
|--------------------------------------------------------------------------
| CONVERTIR A NÚMERO
|--------------------------------------------------------------------------
*/

function convertirNumero(valor) {
  const numero = Number(valor)

  return Number.isFinite(numero)
    ? numero
    : null
}


/*
|--------------------------------------------------------------------------
| CONVERTIR FECHA A TIMESTAMP
|--------------------------------------------------------------------------
*/

function convertirTimestamp(valor) {
  if (
    valor === null ||
    valor === undefined
  ) {
    return null
  }

  if (typeof valor === "number") {

    /*
    Si viene en segundos,
    lo convertimos a milisegundos.
    */

    if (valor < 100000000000) {
      return valor * 1000
    }

    return valor
  }

  const timestamp = Date.parse(valor)

  return Number.isFinite(timestamp)
    ? timestamp
    : null
}


/*
|--------------------------------------------------------------------------
| TIEMPO RELATIVO
|--------------------------------------------------------------------------
*/

function tiempoRelativo(timestamp) {
  if (!timestamp) {
    return "Hora no disponible"
  }

  const ahora = Date.now()

  const diferencia = Math.max(
    0,
    ahora - timestamp
  )

  const minutos = Math.floor(
    diferencia / 60000
  )

  if (minutos < 1) {
    return "Ahora"
  }

  if (minutos < 60) {
    return `Hace ${minutos} min`
  }

  const horas = Math.floor(
    minutos / 60
  )

  if (horas < 24) {
    return `Hace ${horas} h`
  }

  const dias = Math.floor(
    horas / 24
  )

  return `Hace ${dias} días`
}


/*
|--------------------------------------------------------------------------
| COMPROBAR SI ESTÁ EN LA ZONA DE VENEZUELA
|--------------------------------------------------------------------------
*/

function estaEnZonaVenezuela(sismo) {
  return (
    sismo.lat >= LIMITES_VENEZUELA.sur &&
    sismo.lat <= LIMITES_VENEZUELA.norte &&
    sismo.lon >= LIMITES_VENEZUELA.oeste &&
    sismo.lon <= LIMITES_VENEZUELA.este
  )
}


/*
|--------------------------------------------------------------------------
| FECHA DE INICIO
|--------------------------------------------------------------------------
*/

function fechaHaceDias(dias) {
  const fecha = new Date()

  fecha.setUTCDate(
    fecha.getUTCDate() - dias
  )

  return fecha.toISOString()
}


/*
|--------------------------------------------------------------------------
| OBTENER JSON
|--------------------------------------------------------------------------
*/

async function obtenerJSON(
  url,
  tiempoMaximo = 12000
) {
  const controlador =
    new AbortController()

  const temporizador =
    setTimeout(() => {
      controlador.abort()
    }, tiempoMaximo)

  try {

    const respuesta = await fetch(
      url,
      {
        signal: controlador.signal,

        cache: "no-store",

        headers: {
          Accept: "application/json"
        }
      }
    )

    if (!respuesta.ok) {
      throw new Error(
        `HTTP ${respuesta.status}`
      )
    }

    return await respuesta.json()

  } finally {

    clearTimeout(
      temporizador
    )

  }
}


/*
|--------------------------------------------------------------------------
| NORMALIZAR EVENTO GEOJSON
|--------------------------------------------------------------------------
*/

function normalizarGeoJSON(
  evento,
  fuente
) {
  const propiedades =
    evento.properties || {}

  const coordenadas =
    evento.geometry?.coordinates || []


  const lon =
    convertirNumero(
      coordenadas[0]
    )


  const lat =
    convertirNumero(
      coordenadas[1]
    )


  const profundidad =
    convertirNumero(
      coordenadas[2]
      ??
      propiedades.depth
      ??
      propiedades.profundidad
    )


  const mag =
    convertirNumero(
      propiedades.mag
      ??
      propiedades.magnitude
      ??
      propiedades.magnitud
    )


  const timestamp =
    convertirTimestamp(
      propiedades.time
      ??
      propiedades.timestamp
      ??
      propiedades.datetime
      ??
      propiedades.date
    )


  const lugar =
    propiedades.place
    ??
    propiedades.lugar
    ??
    propiedades.location
    ??
    propiedades.ubicacion
    ??
    propiedades.flynn_region
    ??
    propiedades.region
    ??
    "Ubicación no disponible"


  /*
  Si faltan datos importantes,
  descartamos el evento.
  */

  if (
    lat === null ||
    lon === null ||
    mag === null ||
    timestamp === null
  ) {
    return null
  }


  return {
    id:
      evento.id
      ??
      `${fuente}-${timestamp}-${lat}-${lon}`,

    mag,

    lugar,

    tiempo:
      tiempoRelativo(timestamp),

    timestamp,

    profundidad:
      profundidad !== null
        ? Number(
            profundidad.toFixed(1)
          )
        : 0,

    lat,

    lon,

    fuente,

    fuentes: [
      fuente
    ]
  }
}


/*
|--------------------------------------------------------------------------
| NORMALIZAR OBJETO NORMAL
|--------------------------------------------------------------------------
*/

function normalizarObjeto(
  evento,
  fuente
) {
  const lat =
    convertirNumero(
      evento.lat
      ??
      evento.latitude
      ??
      evento.latitud
    )


  const lon =
    convertirNumero(
      evento.lon
      ??
      evento.lng
      ??
      evento.longitude
      ??
      evento.longitud
    )


  const mag =
    convertirNumero(
      evento.mag
      ??
      evento.magnitude
      ??
      evento.magnitud
    )


  const profundidad =
    convertirNumero(
      evento.profundidad
      ??
      evento.depth
    )


  const timestamp =
    convertirTimestamp(
      evento.timestamp
      ??
      evento.time
      ??
      evento.datetime
      ??
      evento.fecha_hora
      ??
      evento.date
      ??
      evento.fecha
    )


  const lugar =
    evento.lugar
    ??
    evento.place
    ??
    evento.location
    ??
    evento.ubicacion
    ??
    evento.region
    ??
    evento.referencia
    ??
    "Ubicación no disponible"


  if (
    lat === null ||
    lon === null ||
    mag === null ||
    timestamp === null
  ) {
    return null
  }


  return {
    id:
      evento.id
      ??
      evento.event_id
      ??
      evento.eventid
      ??
      `${fuente}-${timestamp}-${lat}-${lon}`,

    mag,

    lugar,

    tiempo:
      tiempoRelativo(timestamp),

    timestamp,

    profundidad:
      profundidad !== null
        ? Number(
            profundidad.toFixed(1)
          )
        : 0,

    lat,

    lon,

    fuente,

    fuentes: [
      fuente
    ]
  }
}


/*
|--------------------------------------------------------------------------
| NORMALIZAR RESPUESTA COMPLETA
|--------------------------------------------------------------------------
*/

function normalizarRespuesta(
  data,
  fuente
) {
  let lista = []


  if (Array.isArray(data)) {
    lista = data

  } else if (
    Array.isArray(data?.features)
  ) {
    lista = data.features

  } else if (
    Array.isArray(data?.sismos)
  ) {
    lista = data.sismos

  } else if (
    Array.isArray(data?.data)
  ) {
    lista = data.data

  } else if (
    Array.isArray(data?.results)
  ) {
    lista = data.results
  }


  return lista
    .map(evento => {

      if (
        evento?.type === "Feature" ||
        evento?.geometry
      ) {
        return normalizarGeoJSON(
          evento,
          fuente
        )
      }


      return normalizarObjeto(
        evento,
        fuente
      )

    })
    .filter(Boolean)
}


/*
|--------------------------------------------------------------------------
| CALCULAR DISTANCIA ENTRE DOS EVENTOS
|--------------------------------------------------------------------------
*/

function calcularDistanciaKm(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const R = 6371


  const convertirRadianes =
    grados =>
      grados * Math.PI / 180


  const dLat =
    convertirRadianes(
      lat2 - lat1
    )


  const dLon =
    convertirRadianes(
      lon2 - lon1
    )


  const a =
    Math.sin(dLat / 2) ** 2
    +
    Math.cos(
      convertirRadianes(lat1)
    )
    *
    Math.cos(
      convertirRadianes(lat2)
    )
    *
    Math.sin(dLon / 2) ** 2


  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )


  return R * c
}


/*
|--------------------------------------------------------------------------
| COMPROBAR SI DOS REGISTROS SON EL MISMO SISMO
|--------------------------------------------------------------------------
*/

function esMismoSismo(
  a,
  b
) {
  const diferenciaTiempo =
    Math.abs(
      a.timestamp - b.timestamp
    )


  /*
  Si hay más de 3 minutos
  de diferencia, no es el mismo.
  */

  if (
    diferenciaTiempo >
    3 * 60 * 1000
  ) {
    return false
  }


  const diferenciaMagnitud =
    Math.abs(
      a.mag - b.mag
    )


  /*
  Si la magnitud es demasiado diferente,
  probablemente no es el mismo evento.
  */

  if (
    diferenciaMagnitud > 0.7
  ) {
    return false
  }


  const distancia =
    calcularDistanciaKm(
      a.lat,
      a.lon,
      b.lat,
      b.lon
    )


  return distancia <= 80
}


/*
|--------------------------------------------------------------------------
| ELIMINAR DUPLICADOS
|--------------------------------------------------------------------------
*/

function eliminarDuplicados(eventos) {
  const ordenados =
    [...eventos]
      .sort((a, b) => {

        const prioridadA =
          PRIORIDAD_FUENTES[
            a.fuente
          ] || 0


        const prioridadB =
          PRIORIDAD_FUENTES[
            b.fuente
          ] || 0


        if (
          prioridadA !==
          prioridadB
        ) {
          return (
            prioridadB -
            prioridadA
          )
        }


        return (
          b.timestamp -
          a.timestamp
        )

      })


  const unicos = []


  for (
    const evento
    of ordenados
  ) {

    const existente =
      unicos.find(
        registrado =>
          esMismoSismo(
            registrado,
            evento
          )
      )


    if (!existente) {

      unicos.push(
        evento
      )

      continue
    }


    if (
      !existente.fuentes.includes(
        evento.fuente
      )
    ) {

      existente.fuentes.push(
        evento.fuente
      )

    }

  }


  return unicos.sort(
    (a, b) =>
      b.timestamp -
      a.timestamp
  )
}


/*
|--------------------------------------------------------------------------
| FUENTE 1 — EMSC
|--------------------------------------------------------------------------
*/

async function obtenerEMSC() {
  const parametros =
    new URLSearchParams({

      format: "json",

      starttime:
        fechaHaceDias(
          DIAS_BUSQUEDA
        ),

      minlatitude:
        String(
          LIMITES_VENEZUELA.sur
        ),

      maxlatitude:
        String(
          LIMITES_VENEZUELA.norte
        ),

      minlongitude:
        String(
          LIMITES_VENEZUELA.oeste
        ),

      maxlongitude:
        String(
          LIMITES_VENEZUELA.este
        ),

      minmagnitude:
        String(
          MAGNITUD_MINIMA
        ),

      orderby:
        "time",

      limit:
        "1000"

    })


  const url =
    `https://www.seismicportal.eu/fdsnws/event/1/query?${parametros.toString()}`


  const data =
    await obtenerJSON(url)


  return normalizarRespuesta(
    data,
    "EMSC"
  )
}


/*
|--------------------------------------------------------------------------
| FUENTE 2 — USGS
|--------------------------------------------------------------------------
*/

async function obtenerUSGS() {
  const parametros =
    new URLSearchParams({

      format: "geojson",

      starttime:
        fechaHaceDias(
          DIAS_BUSQUEDA
        ),

      minlatitude:
        String(
          LIMITES_VENEZUELA.sur
        ),

      maxlatitude:
        String(
          LIMITES_VENEZUELA.norte
        ),

      minlongitude:
        String(
          LIMITES_VENEZUELA.oeste
        ),

      maxlongitude:
        String(
          LIMITES_VENEZUELA.este
        ),

      minmagnitude:
        String(
          MAGNITUD_MINIMA
        ),

      eventtype:
        "earthquake",

      orderby:
        "time",

      limit:
        "1000"

    })


  const url =
    `https://earthquake.usgs.gov/fdsnws/event/1/query?${parametros.toString()}`


  const data =
    await obtenerJSON(url)


  return normalizarRespuesta(
    data,
    "USGS"
  )
}


/*
|--------------------------------------------------------------------------
| COMPOSABLE PRINCIPAL
|--------------------------------------------------------------------------
*/

export function useSismos() {

  async function obtenerSismos() {

    errorSismos.value = ""


    /*
    Consultamos ambas fuentes.
    */

    const resultados =
      await Promise.allSettled([
        obtenerEMSC(),
        obtenerUSGS()
      ])


    const nombresFuentes = [
      "EMSC",
      "USGS"
    ]


    const eventos = []

    const fuentesDisponibles = []


    /*
    Procesamos las respuestas.
    */

    resultados.forEach(
      (
        resultado,
        index
      ) => {

        const nombreFuente =
          nombresFuentes[index]


        if (
          resultado.status ===
          "fulfilled"
        ) {

          fuentesDisponibles.push(
            nombreFuente
          )


          eventos.push(
            ...resultado.value
          )


          if (
            import.meta.env.DEV
          ) {

            console.log(
              `${nombreFuente}:`,
              resultado.value.length,
              "eventos"
            )

          }

        } else {

          console.warn(
            `No se pudo consultar ${nombreFuente}:`,
            resultado.reason
          )

        }

      }
    )


    /*
    Si fallan ambas fuentes.
    */

    if (
      fuentesDisponibles.length === 0
    ) {

      errorSismos.value =
        "No fue posible consultar las fuentes sísmicas."


      throw new Error(
        errorSismos.value
      )

    }


    /*
    ================================================================
    PRUEBA 1:
    MOSTRAR TODO LO QUE RECIBIMOS
    ANTES DEL FILTRO DE VENEZUELA
    ================================================================
    */

    if (
      import.meta.env.DEV
    ) {

      console.log(
        "TODOS LOS EVENTOS RECIBIDOS ANTES DEL FILTRO:"
      )


      console.table(

        [...eventos]

          .sort(
            (a, b) =>
              b.timestamp -
              a.timestamp
          )

          .slice(
            0,
            30
          )

          .map(
            sismo => ({

              magnitud:
                sismo.mag,

              lugar:
                sismo.lugar,

              fecha:
                new Date(
                  sismo.timestamp
                )
                  .toLocaleString(
                    "es-VE"
                  ),

              latitud:
                sismo.lat,

              longitud:
                sismo.lon,

              profundidad:
                sismo.profundidad,

              fuente:
                sismo.fuente

            })
          )

      )

    }


    /*
    Filtramos la zona de Venezuela.
    */

    const eventosVenezuela =
      eventos.filter(
        estaEnZonaVenezuela
      )


    /*
    ================================================================
    PRUEBA 2:
    MOSTRAR SOLO LOS EVENTOS
    QUE PASARON EL FILTRO DE VENEZUELA
    ================================================================
    */

    if (
      import.meta.env.DEV
    ) {

      console.log(
        "EVENTOS DESPUÉS DEL FILTRO DE VENEZUELA:"
      )


      console.table(

        [...eventosVenezuela]

          .sort(
            (a, b) =>
              b.timestamp -
              a.timestamp
          )

          .slice(
            0,
            30
          )

          .map(
            sismo => ({

              magnitud:
                sismo.mag,

              lugar:
                sismo.lugar,

              fecha:
                new Date(
                  sismo.timestamp
                )
                  .toLocaleString(
                    "es-VE"
                  ),

              latitud:
                sismo.lat,

              longitud:
                sismo.lon,

              profundidad:
                sismo.profundidad,

              fuente:
                sismo.fuente

            })
          )

      )

    }


    /*
    Eliminamos duplicados.
    */

    const eventosUnicos =
      eliminarDuplicados(
        eventosVenezuela
      )


    /*
    Guardamos los eventos finales.
    */

    sismos.value =
      eventosUnicos.slice(
        0,
        MAX_EVENTOS
      )


    /*
    Guardamos las fuentes disponibles.
    */

    fuenteActiva.value =
      fuentesDisponibles.join(
        " + "
      )


    /*
    Guardamos la hora
    de la última consulta.
    */

    ultimaActualizacion.value =
      new Date()
        .toLocaleString(
          "es-VE",
          {
            dateStyle:
              "short",

            timeStyle:
              "short"
          }
        )


    /*
    ================================================================
    RESULTADO FINAL
    ================================================================
    */

    if (
      import.meta.env.DEV
    ) {

      console.log(
        "Fuentes disponibles:",
        fuenteActiva.value
      )


      console.log(
        "EVENTOS FINALES DESPUÉS DE ELIMINAR DUPLICADOS:"
      )


      console.table(

        sismos.value.map(
          sismo => ({

            magnitud:
              sismo.mag,

            lugar:
              sismo.lugar,

            fecha:
              new Date(
                sismo.timestamp
              )
                .toLocaleString(
                  "es-VE"
                ),

            tiempo:
              sismo.tiempo,

            latitud:
              sismo.lat,

            longitud:
              sismo.lon,

            profundidad:
              sismo.profundidad,

            fuente_principal:
              sismo.fuente,

            fuentes:
              sismo.fuentes
                ?.join(
                  " + "
                )

          })
        )

      )

    }

  }


  return {

    sismos,

    obtenerSismos,

    ultimaActualizacion,

    fuenteActiva,

    errorSismos

  }

}