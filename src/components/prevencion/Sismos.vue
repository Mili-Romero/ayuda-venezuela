<template>
  <div class="contenido-sismos">
    <h3 class="titulo-desastre">🌋 Sismos y Terremotos</h3>
    <p class="descripcion-desastre">Protocolos oficiales de seguridad ante movimientos telúricos.</p>

    <!-- Sección 1: Evidencia Científica -->
    <div class="caja-ciencia">
      <h4>💡 Evidencia Científica contra Mitos</h4>
      <p>Los sismos ocurren por la liberación de energía acumulada en las fallas geológicas. <strong>No se pueden predecir</strong> bajo ningún método. Ignora teorías conspirativas sobre antenas o alineaciones planetarias.</p>
    </div>

    <!-- Sección 2: El Semáforo de Acción -->
    <div class="protocolos-grid">
      <div class="bloque antes">
        <h5>🟢 ANTES</h5>
        <p>Prepara tu mochila de emergencia de 72 horas y fija los estantes altos a las paredes.</p>
      </div>
      <div class="bloque durante">
        <h5>🟡 DURANTE</h5>
        <p>Agáchate, cúbrete y proteje tu cabeza debajo de un mueble pesado. Aléjate de ventanas.</p>
      </div>
      <div class="bloque despues">
        <h5>🔴 DESPUÉS</h5>
        <p>Cierra el gas y la electricidad. Usa solo SMS para comunicarte y prepárate para réplicas.</p>
      </div>
    </div>

    <!-- Sección 3: Infografías de Prevención -->
    <div class="caja-infografias">
      <h4>📊 Material Visual e Infografías</h4>
        <div class="grid-imagenes">
            <a href="@/assets/images/prevencion/infografia_sismos.png" target="_blank" class="enlace-visual">
            <img src="@/assets/images/prevencion/infografia_sismos.png" alt="Infografía Oficial de Sismos" class="img-guia" />
            <span>🔍 Ver Infografía en Tamaño Completo</span>
            </a>
        </div>

    </div>

    <!-- Sección 4: Fuentes y Estudios Científicos -->
    <div class="caja-estudios">
      <h4>🔬 Estudios Científicos y Fuentes Oficiales</h4>
      <ul class="lista-enlaces">
        <li>
          <a href="http://funvisis.gob.ve" target="_blank" class="link-estudio">
            🔗 Fundación Venezolana de Investigaciones Sismológicas (FUNVISIS)
          </a>
        </li>
        <li>
          <a href="https://usgs.gov" target="_blank" class="link-estudio">
            🔗 Programa de Riesgos de Terremotos del Servicio Geológico de EE. UU. (USGS)
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.titulo-desastre { font-size: 22px; font-weight: 800; color: #1e293b; margin: 0; }
.descripcion-desastre { font-size: 14px; color: #64748b; margin: 4px 0 20px 0; }

.caja-ciencia, .caja-infografias, .caja-estudios {
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

/* IMÁGENES RESPONSIVAS */
.grid-imagenes { margin-top: 10px; text-align: center; }
.enlace-visual { text-decoration: none; display: inline-block; width: 100%; max-width: 320px; }
.img-guia { width: 100%; height: auto; border-radius: 6px; border: 1px solid #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.enlace-visual span { display: block; font-size: 11.5px; color: #0284c7; font-weight: 700; margin-top: 6px; }

/* ENLACES CIENTÍFICOS */
.lista-enlaces { list-style: none; padding: 0; margin: 0; }
.lista-enlaces li { margin-bottom: 10px; }
.lista-enlaces li:last-child { margin-bottom: 0; }
.link-estudio { font-size: 13px; color: #1e3a8a; text-decoration: none; font-weight: 600; }
.link-estudio:hover { text-decoration: underline; color: #1d4ed8; }

@media (min-width: 768px) {
  .protocolos-grid { flex-direction: row; }
  .bloque { flex: 1; }
}
</style>
