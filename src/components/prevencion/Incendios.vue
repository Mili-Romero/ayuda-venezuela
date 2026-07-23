<template>
  <div class="contenido-inundaciones">
    <h3 class="titulo-desastre">🌊 Inundaciones y Deslaves</h3>
    <p class="descripcion-desastre">Protocolos de seguridad y evacuación ante crecidas de ríos o deslaves en zonas costeras y montañosas.</p>

    <!-- Sección 1: Evidencia Científica contra Mitos -->
    <div class="caja-ciencia">
      <h4>💡 Evidencia Científica: Desmentir Mitos</h4>
      <p>
        Las inundaciones y deslaves son fenómenos climáticos intensificados por la saturación de los suelos y fallas en el drenaje. 
        <strong>Mito falso:</strong> "Si el agua no llega a las rodillas, no hay peligro". 
        <strong>Realidad:</strong> Solo 15 centímetros de agua en movimiento pueden derribar a un adulto, y 30 centímetros pueden arrastrar un vehículo pequeño. Nunca intentes cruzar corrientes.
      </p>
    </div>

    <!-- Sección 2: El Semáforo de Acción -->
    <div class="protocolos-grid">
      <div class="bloque antes">
        <h5>🟢 ANTES</h5>
        <p>Identifica las zonas más altas de tu comunidad y limpia las alcantarillas de tu calle para evitar obstrucciones masivas.</p>
      </div>
      <div class="bloque durante">
        <h5>🟡 DURANTE</h5>
        <p>Evacúa de inmediato si estás en una zona de riesgo. Aléjate de postes de luz, cables sueltos y no camines por calles inundadas.</p>
      </div>
      <div class="bloque despues">
        <h5>🔴 DESPUÉS</h5>
        <p>No consumas agua del grifo hasta que se confirme su potabilidad. Revisa paredes y terrenos antes de volver a ingresar a tu hogar.</p>
      </div>
    </div>

    <!-- Sección 3: Fuentes y Alertas Oficiales -->
    <div class="caja-estudios">
      <h4>🔬 Monitoreo y Fuentes de Información</h4>
      <ul class="lista-enlaces">
        <li>
          <a href="http://inameh.gob.ve" target="_blank" class="link-estudio">
            🔗 Instituto Nacional de Meteorología e Hidrología (INAMEH) - Alertas Hidrológicas en Vivo
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.titulo-desastre { font-size: 22px; font-weight: 800; color: #1e293b; margin: 0; }
.descripcion-desastre { font-size: 14px; color: #64748b; margin: 4px 0 20px 0; }

.caja-ciencia, .caja-estudios {
  background: #f8fafc;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

h4 { color: #1e3a8a; margin: 0 0 10px 0; font-size: 15px; font-weight: 800; }
h5 { margin: 0 0 8px 0; font-size: 13.5px; color: white; padding: 6px 12px; font-weight: 750; }

.protocolos-grid { display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px; }
.bloque { border-radius: 6px; border: 1px solid #e2e8f0; overflow: hidden; background: white; }
.bloque p { padding: 12px 15px; margin: 0; font-size: 13px; color: #334155; line-height: 1.5; }

.antes h5 { background: #16a34a; }
.durante h5 { background: #d97706; }
.despues h5 { background: #dc2626; }

.lista-enlaces { list-style: none; padding: 0; margin: 0; }
.link-estudio { font-size: 13px; color: #1e3a8a; text-decoration: none; font-weight: 600; }
.link-estudio:hover { text-decoration: underline; color: #1d4ed8; }

@media (min-width: 768px) {
  .protocolos-grid { flex-direction: row; }
  .bloque { flex: 1; }
}
</style>
