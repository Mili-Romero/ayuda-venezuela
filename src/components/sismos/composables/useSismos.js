import { ref } from "vue"

const sismos = ref([])
const ultimaActualizacion = ref("")

const CARACAS = {
  lat: 10.4806,
  lon: -66.9036
}

// Distancia máxima alrededor de Venezuela
const RADIO_KM = 1200

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371

  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
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
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

    const respuesta = await fetch(url)
    const data = await respuesta.json()

    const eventos = data.features.map(evento => {
      const [lon, lat, profundidad] = evento.geometry.coordinates

      const distanciaVenezuela = calcularDistanciaKm(
        CARACAS.lat,
        CARACAS.lon,
        lat,
        lon
      )

      return {
        id: evento.id,
        mag: evento.properties.mag ?? 0,
        lugar: evento.properties.place || "Ubicación no disponible",
        tiempo: tiempoRelativo(evento.properties.time),
        profundidad: Number(profundidad.toFixed(1)),
        lat,
        lon,
        distanciaVenezuela: Number(distanciaVenezuela.toFixed(0))
      }
    })

    sismos.value = eventos
      .filter(sismo => sismo.distanciaVenezuela <= RADIO_KM)
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