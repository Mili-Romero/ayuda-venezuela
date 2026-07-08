import { ref } from "vue"

const sismos = ref([])
const ultimaActualizacion = ref("")

const LIMITES_VENEZUELA = {
  norte: 13.5,
  sur: 0.5,
  oeste: -73.6,
  este: -59.7
}

function estaEnVenezuela(sismo) {
  return (
    sismo.lat >= LIMITES_VENEZUELA.sur &&
    sismo.lat <= LIMITES_VENEZUELA.norte &&
    sismo.lon >= LIMITES_VENEZUELA.oeste &&
    sismo.lon <= LIMITES_VENEZUELA.este
  )
}

function tiempoRelativo(timestamp) {
  const ahora = Date.now()
  const diferencia = ahora - timestamp
  const minutos = Math.floor(diferencia / 60000)

  if (minutos < 1) return "Ahora"
  if (minutos < 60) return `Hace ${minutos} min`

  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `Hace ${horas} h`

  const dias = Math.floor(horas / 24)
  return `Hace ${dias} días`
}

export function useSismos() {
  async function obtenerSismos() {
    const url =
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

    const respuesta = await fetch(url)
    const data = await respuesta.json()

    const eventos = data.features.map(evento => {
      const [lon, lat, profundidad] = evento.geometry.coordinates

      return {
        id: evento.id,
        mag: evento.properties.mag ?? 0,
        lugar: evento.properties.place || "Ubicación no disponible",
        tiempo: tiempoRelativo(evento.properties.time),
        profundidad: Number(profundidad.toFixed(1)),
        lat,
        lon
      }
    })

    sismos.value = eventos
      .filter(estaEnVenezuela)
      .sort((a, b) => b.mag - a.mag)

    ultimaActualizacion.value = new Date().toLocaleString("es-VE", {
      dateStyle: "short",
      timeStyle: "short"
    })
  }

  return {
    sismos,
    obtenerSismos,
    ultimaActualizacion
  }
}