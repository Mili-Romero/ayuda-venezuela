import { ref } from "vue"


/*
|--------------------------------------------------------------------------
| ESTADO GLOBAL DEL COMPOSABLE
|--------------------------------------------------------------------------
*/

const sismos = ref([])

const ultimaActualizacion = ref("")

const fuenteActiva = ref("")

const errorSismos = ref("")


/*
|--------------------------------------------------------------------------
| ZONA GEOGRÁFICA DE VENEZUELA
|--------------------------------------------------------------------------
|
| Estos límites se usan principalmente para EMSC y USGS.
|
| La fuente basada en FUNVISIS ya debería devolver actividad
| sísmica correspondiente a Venezuela.
|
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

// Buscamos hasta 30 días de actividad
const DIAS_BUSQUEDA = 30

// Máximo de eventos que conservamos
const MAX_EVENTOS = 100


/*
|--------------------------------------------------------------------------
| PRIORIDAD DE LAS FUENTES
|--------------------------------------------------------------------------
|
| Cuando dos fuentes informan sobre el mismo sismo:
|
| 1. FUNVISIS vía SismosVE
| 2. EMSC
| 3. USGS
|
*/

const PRIORIDAD_FUENTES = {
  "EMSC": 2,
  "USGS": 1
}


/*
|--------------------------------------------------------------------------
| CONVERTIR VALORES A NÚMEROS
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
|
| Un timestamp es una fecha convertida a milisegundos.
|
*/

function convertirTimestamp(valor) {

  if (valor === null || valor === undefined) {

    return null

  }


  /*
  Si ya recibimos un número.
  */

  if (typeof valor === "number") {

    /*
    Algunos servicios usan segundos.

    Ejemplo:
    1780000000

    JavaScript usa milisegundos:

    1780000000000
    */

    if (valor < 100000000000) {

      return valor * 1000

    }

    return valor

  }


  /*
  Intentamos convertir una fecha en texto.
  */

  const timestamp = Date.parse(valor)

  return Number.isFinite(timestamp)
    ? timestamp
    : null

}


/*
|--------------------------------------------------------------------------
| FECHA Y HORA DE FUNVISIS
|--------------------------------------------------------------------------
|
| FUNVISIS puede entregar fecha y hora por separado.
|
| Venezuela utiliza UTC-4.
|
*/

function convertirFechaFunvisis(fecha, hora = "00:00:00") {

  if (!fecha) {

    return null

  }


  /*
  Detectamos fechas como:

  11/07/2026
  */

  const partes = String(fecha)
    .trim()
    .match(
      /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
    )


  if (!partes) {

    return convertirTimestamp(
      `${fecha} ${hora}`
    )

  }


  const dia = partes[1]
    .padStart(2, "0")

  const mes = partes[2]
    .padStart(2, "0")

  const año = partes[3]


  const horaLimpia =
    String(hora || "00:00:00").trim()


  return Date.parse(

    `${año}-${mes}-${dia}T${horaLimpia}-04:00`

  )

}


/*
|--------------------------------------------------------------------------
| TIEMPO RELATIVO
|--------------------------------------------------------------------------
|
| Ejemplos:
|
| Hace 3 min
| Hace 2 h
| Hace 4 días
|
*/

function tiempoRelativo(timestamp) {

  if (!timestamp) {

    return "Hora no disponible"

  }


  const ahora = Date.now()

  const diferencia =
    Math.max(0, ahora - timestamp)


  const minutos =
    Math.floor(
      diferencia / 60000
    )


  if (minutos < 1) {

    return "Ahora"

  }


  if (minutos < 60) {

    return `Hace ${minutos} min`

  }


  const horas =
    Math.floor(
      minutos / 60
    )


  if (horas < 24) {

    return `Hace ${horas} h`

  }


  const dias =
    Math.floor(
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
| FECHA DE INICIO DE LA CONSULTA
|--------------------------------------------------------------------------
|
| Genera una fecha de hace 30 días.
|
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
| FETCH CON TIEMPO MÁXIMO
|--------------------------------------------------------------------------
|
| Si una fuente tarda demasiado,
| no dejamos que bloquee toda la aplicación.
|
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

        signal:
          controlador.signal,

        cache:
          "no-store",

        headers: {

          Accept:
            "application/json"

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
| NORMALIZAR GEOJSON
|--------------------------------------------------------------------------
|
| USGS y otros servicios pueden devolver:
|
| {
|   type: "Feature",
|   properties: {...},
|   geometry: {
|     coordinates: [lon, lat, profundidad]
|   }
| }
|
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
  Si falta información fundamental,
  descartamos el evento.
  */

  if (

    lat === null

    ||

    lon === null

    ||

    mag === null

    ||

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

      tiempoRelativo(
        timestamp
      ),


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
| NORMALIZAR OBJETOS NORMALES
|--------------------------------------------------------------------------
|
| Esta función intenta entender distintos nombres.
|
| Por ejemplo:
|
| magnitud
| magnitude
| mag
|
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


  /*
  Intentamos obtener la fecha.
  */

  let timestamp =
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

    )


  /*
  Si la fuente tiene:

  fecha: 11/07/2026
  hora: 15:30:22
  */

  if (

    !timestamp

    &&

    evento.fecha

  ) {

    timestamp =
      convertirFechaFunvisis(

        evento.fecha,

        evento.hora

      )

  }


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

    lat === null

    ||

    lon === null

    ||

    mag === null

    ||

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

      tiempoRelativo(
        timestamp
      ),


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
|
| La API puede devolver:
|
| [...]
|
| o:
|
| { features: [...] }
|
| o:
|
| { sismos: [...] }
|
| o:
|
| { data: [...] }
|
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

        evento?.type === "Feature"

        ||

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
| DISTANCIA ENTRE DOS SISMOS
|--------------------------------------------------------------------------
|
| Se utiliza para detectar duplicados.
|
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
| DETECTAR EL MISMO SISMO
|--------------------------------------------------------------------------
|
| Consideramos que dos registros pueden ser
| el mismo evento si:
|
| - ocurrieron con menos de 3 minutos de diferencia
| - están a menos de 80 km
| - la magnitud difiere menos de 0.7
|
*/

function esMismoSismo(
  a,
  b
) {

  const diferenciaTiempo =

    Math.abs(
      a.timestamp - b.timestamp
    )


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

function eliminarDuplicados(
  eventos
) {

  /*
  Primero damos prioridad
  a la fuente más importante.
  */

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


    /*
    Si no existe,
    lo agregamos.
    */

    if (!existente) {

      unicos.push(
        evento
      )

      continue

    }


    /*
    Si ya existe,
    guardamos también el nombre
    de la otra fuente.
    */

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


  /*
  Finalmente ordenamos
  por el sismo más reciente.
  */

  return unicos.sort(

    (a, b) =>

      b.timestamp -
      a.timestamp

  )

}


/*
|--------------------------------------------------------------------------
| FUENTE 1
|--------------------------------------------------------------------------
|
| Datos FUNVISIS
| a través del proyecto SismosVE.
|
| IMPORTANTE:
|
| SismosVE es un proyecto independiente.
| No es una API oficial de FUNVISIS.
|
*/

async function obtenerFunvisis() {

  const url =

    "https://sismosve.rafnixg.dev/api/sismos/recent?limit=100"


  const data =
    await obtenerJSON(url)


  return normalizarRespuesta(

    data,

    "FUNVISIS (vía SismosVE)"

  )

}


/*
|--------------------------------------------------------------------------
| FUENTE 2 - EMSC
|--------------------------------------------------------------------------
*/

async function obtenerEMSC() {

  const parametros =

    new URLSearchParams({

      format:
        "json",

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
| FUENTE 3 - USGS
|--------------------------------------------------------------------------
*/

async function obtenerUSGS() {

  const parametros =

    new URLSearchParams({

      format:
        "geojson",

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
| FUNCIÓN PRINCIPAL
|--------------------------------------------------------------------------
|
| Esta es la función que llama:
|
| SismosDashboard.vue
|
*/

export function useSismos() {


  async function obtenerSismos() {


    errorSismos.value = ""


    /*
    Consultamos las tres fuentes.

    Promise.allSettled significa:

    Si una falla,
    las demás continúan funcionando.
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


    resultados.forEach(

      (
        resultado,
        index
      ) => {


        const nombreFuente =

          nombresFuentes[index]


        /*
        La fuente funcionó.
        */

        if (

          resultado.status
          ===
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

        }


        /*
        La fuente falló.
        */

        else {

          console.warn(

            `No se pudo consultar ${nombreFuente}:`,

            resultado.reason

          )

        }

      }

    )


    /*
    Si fallaron las tres fuentes.
    */

    if (
      fuentesDisponibles.length === 0
    ) {

      errorSismos.value =

        "No fue posible consultar las fuentes sísmicas."


      /*
      No borramos los datos anteriores.
      */

      throw new Error(

        errorSismos.value

      )

    }


    /*
    Filtrar la zona de Venezuela.
    */

    const eventosVenezuela =

      eventos.filter(

        estaEnZonaVenezuela

      )


    /*
    Eliminar duplicados.
    */

    const eventosUnicos =

      eliminarDuplicados(

        eventosVenezuela

      )


    /*
    Guardamos los resultados.
    */

    sismos.value =

      eventosUnicos.slice(

        0,

        MAX_EVENTOS

      )


    /*
    Guardamos qué fuentes funcionaron.
    */

    fuenteActiva.value =

      fuentesDisponibles.join(
        " + "
      )


    /*
    Hora de la consulta.
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
    Información útil en consola.
    */

    if (import.meta.env.DEV) {
  console.log(
    "Fuentes disponibles:",
    fuenteActiva.value
  )

  console.table(
  sismos.value.map(sismo => ({
    magnitud: sismo.mag,
    lugar: sismo.lugar,
    profundidad_km: sismo.profundidad,
    latitud: sismo.lat,
    longitud: sismo.lon,
    tiempo: sismo.tiempo,
    fuente_principal: sismo.fuente,
    fuentes: sismo.fuentes?.join(" + ")
  }))
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