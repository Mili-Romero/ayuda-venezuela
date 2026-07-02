<template>
  <div class="panel-sismos">
    <span class="fuente-superior">EL SISMO · DATOS DEL USGS, EN VIVO</span>
    
    <div v-if="cargando" class="estado-sismos">
      Cargando monitoreo y estadísticas en tiempo real...
    </div>
    
    <div v-else-if="sismos.length === 0" class="estado-sismos">
      No se registran sismos recientes en la zona.
    </div>
    
    <div v-else>
      <!-- BLOQUE DESTACADO -->
      <div class="sismo-principal">
        <h1 class="magnitud-principal">M {{ sismoDestacado.mag.toFixed(1) }}</h1>
        <p class="detalle-principal">
          <strong>{{ sismoDestacado.lugar }}</strong> · 
          profundidad {{ sismoDestacado.profundidad }} km · 
          magnitud preliminar
        </p>
        <p class="contador-zona">
          <strong>{{ sismos.length }} sismos</strong> (M&ge;2,5) detectados en la zona de control.
        </p>
      </div>

      <!-- MÓDULO DE GRÁFICO ESTADÍSTICO (CSS PURO) -->
      <div class="seccion-grafico">
        <span class="titulo-grafico">Distribución por Intensidad:</span>
        
        <div class="fila-grafico">
          <span class="etiqueta-grafico">Fuerte (>5.0):</span>
          <div class="barra-contenedor">
            <div class="barra-progreso bg-rojo" :style="{ width: infoGrafico.porcentajeFuerte + '%' }"></div>
          </div>
          <span class="conteo-grafico">{{ infoGrafico.cantFuerte }}</span>
        </div>

        <div class="fila-grafico">
          <span class="etiqueta-grafico">Moderado (4-5):</span>
          <div class="barra-contenedor">
            <div class="barra-progreso bg-naranja" :style="{ width: infoGrafico.porcentajeModerado + '%' }"></div>
          </div>
          <span class="conteo-grafico">{{ infoGrafico.cantModerado }}</span>
        </div>

        <div class="fila-grafico">
          <span class="etiqueta-grafico">Menor (<4.0):</span>
          <div class="barra-contenedor">
            <div class="barra-progreso bg-amarillo" :style="{ width: infoGrafico.porcentajeMenor + '%' }"></div>
          </div>
          <span class="conteo-grafico">{{ infoGrafico.cantMenor }}</span>
        </div>
      </div>

      <!-- LISTA CRONOLÓGICA (ESTILO CAPTURA) -->
      <div class="lista-sismos">
        <div v-for="sismo in sismos.slice(0, 5)" :key="sismo.id" class="fila-sismo">
          <div class="col-info">
            <span class="mini-magnitud" :class="claseColor(sismo.mag)">M {{ sismo.mag.toFixed(1) }}</span>
            <span class="mini-lugar">{{ sismo.lugar }}</span>
          </div>
          <span class="mini-tiempo">{{ calcularTiempoHace(sismo.tiempo) }}</span>
        </div>
      </div>
    </div>
    
    <div class="footer-datos">
      <a href="https://usgs.gov" target="_blank" rel="noopener noreferrer">Datos en vivo · USGS</a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const sismos = ref([]);
const cargando = ref(true);

const sismoDestacado = computed(() => {
  if (sismos.value.length === 0) return null;
  return [...sismos.value].sort((a, b) => b.mag - a.mag)[0];
});

// LÓGICA COMPUTADA PARA EL GRÁFICO EN VIVO
const infoGrafico = computed(() => {
  const total = sismos.value.length || 1;
  const fuerte = sismos.value.filter(s => s.mag >= 5.0).length;
  const moderado = sismos.value.filter(s => s.mag >= 4.0 && s.mag < 5.0).length;
  const menor = sismos.value.filter(s => s.mag < 4.0).length;

  return {
    cantFuerte: fuerte,
    cantModerado: moderado,
    cantMenor: menor,
    porcentajeFuerte: (fuerte / total) * 100,
    porcentajeModerado: (moderado / total) * 100,
    porcentajeMenor: (menor / total) * 100
  };
});

/** CONFIGURACIÓN DE PRUEBA: Coordenadas de República Dominicana
const LIMITES_VENEZUELA = {
  latMin: 17.0,
  latMax: 20.5,
  lonMin: -72.5,
  lonMax: -68.0
};*/
//  Coordenadas Oficiales de Venezuela
const LIMITES_VENEZUELA = {
  latMin: 0.5,
  latMax: 15.0,
  lonMin: -74.0,
  lonMax: -58.0
};

const obtenerSismos = async () => {
  try {
    cargando.value = true;
    
    // URL de Prueba: Consulta directa al catálogo API de la USGS
    const urlApi = 'https://earthquake.usgs.gov/fdsnws/event/1/query' +
                   '?format=geojson' +
                   '&starttime=2026-06-01' + // Evaluamos desde inicios de mes
                   '&minmagnitude=2.0' +     // Bajamos el filtro a 2.0 para atrapar todo
                   `&minlatitude=${LIMITES_VENEZUELA.latMin}` +
                   `&maxlatitude=${LIMITES_VENEZUELA.latMax}` +
                   `&minlongitude=${LIMITES_VENEZUELA.lonMin}` +
                   `&maxlongitude=${LIMITES_VENEZUELA.lonMax}`;

    const respuesta = await fetch(urlApi);
    const datos = await respuesta.json();
    
    sismos.value = datos.features.map(evento => ({
      id: evento.id,
      mag: evento.properties.mag,
      // Mapeo simple de texto para la prueba
      lugar: evento.properties.place,
      tiempo: evento.properties.time,
      profundidad: evento.geometry.coordinates ? evento.geometry.coordinates[2].toFixed(0) : '10'
    }));

  } catch (error) {
    console.error('Error en la prueba de conexión con USGS:', error);
  } finally {
    cargando.value = false;
  }
};



const calcularTiempoHace = (timestamp) => {
  const difMili = Date.now() - timestamp;
  const difHoras = Math.floor(difMili / (1000 * 60 * 60));
  const difDias = Math.floor(difHoras / 24);

  if (difDias > 0) return `hace ${difDias} d`;
  if (difHoras > 0) return `hace ${difHoras} h`;
  return 'hace momentos';
};

const claseColor = (mag) => {
  if (mag >= 5.0) return 'txt-rojo';
  if (mag >= 4.0) return 'txt-naranja';
  return 'txt-amarillo';
};

onMounted(() => {
  obtenerSismos();
  setInterval(obtenerSismos, 300000);
});
</script>

<style scoped>
.panel-sismos {
  padding: 24px;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  color: #000000;
}
.fuente-superior {
  font-size: 0.65rem;
  letter-spacing: 1px;
  color: #666666;
  font-weight: 700;
}
.sismo-principal {
  margin-top: 10px;
  margin-bottom: 20px;
}
.magnitud-principal {
  font-size: 2.8rem;
  font-weight: 800;
  margin: 0;
}
.detalle-principal {
  font-size: 0.85rem;
  color: #333333;
  margin: 6px 0;
}
.contador-zona {
  font-size: 0.8rem;
  color: #555555;
}

/* ESTILOS DEL GRÁFICO DE BARRAS */
.seccion-grafico {
  background: #fdfdfd;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 25px;
}
.titulo-grafico {
  font-size: 0.75rem;
  font-weight: 700;
  color: #444444;
  display: block;
  margin-bottom: 8px;
}
.fila-grafico {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 0.75rem;
}
.etiqueta-grafico {
  width: 85px;
  color: #555555;
}
.barra-contenedor {
  flex: 1;
  background: #f0f0f0;
  height: 8px;
  border-radius: 4px;
  margin: 0 10px;
  overflow: hidden;
}
.barra-progreso {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease-out;
}
.bg-rojo { background-color: #ef4444; }
.bg-naranja { background-color: #f97316; }
.bg-amarillo { background-color: #eab308; }
.conteo-grafico {
  width: 15px;
  text-align: right;
  font-weight: 700;
}

/* LISTA CRONOLÓGICA */
.lista-sismos {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid #eaeaea;
  padding-top: 15px;
}
.fila-sismo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}
.col-info {
  display: flex;
  gap: 15px;
}
.mini-magnitud { font-weight: 700; }
.txt-rojo { color: #ef4444; }
.txt-naranja { color: #f97316; }
.txt-amarillo { color: #ca8a04; }
.mini-lugar { color: #666666; }
.mini-tiempo { color: #999999; font-size: 0.8rem; }
.footer-datos { margin-top: 25px; font-size: 0.7rem; }
.footer-datos a { color: #0066cc; text-decoration: none; }
</style>
