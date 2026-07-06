<template>
  <div class="tarjeta alerta-starlink">
    <h2 class="titulo-seccion borde-amarillo">📡 Puntos de internet gratuito</h2>
    <p class="alerta-texto">Conéctate a la red WiFi llamada <strong>STARLINK.</strong> Es el mismo nombre en todos los puntos.</p>
    <div class="datos-conexion">
      <p><strong>Red Abierta:</strong> <span class="codigo-red">Sin Contraseñas</span></p>
    </div>
    <p class="descripcion">🛻 <strong>📍 Estadio Garcia Carneiro</strong><a href="https://www.google.com/maps?q=10.602906,-66.905842" target="_blank" rel="noopener noreferrer">  10.602906, -66.905842</a> — Macuto, Estado Vargas.</p>
    <p class="descripcion">🛻 <strong>📍 Urb. Caribe</strong><a href="https://www.google.com/maps?q=10.618664,-66.846288" target="_blank" rel="noopener noreferrer"> 10.6187, -66.8463</a> — Caraballeda, Estado Vargas.</p>
    <p class="descripcion">🛻 <strong>📍 Tanaguarena</strong><a href="https://www.google.com/maps?q=10.611498,-66.820835" target="_blank" rel="noopener noreferrer"> 10.6115, -66.8208</a> - Caraballeda, Estado Vargas.</p>
    <p class="alerta-texto"> 📍 Para ver la ubicación de otros puntos de internet satelital gratuito <a href="https://www.reconectavenezuela.com/" target="_blank" rel="noopener noreferrer"><strong> 'Presiona Aqui'.</strong></a></p>
  </div>
</template>

<style scoped>
.alerta-starlink {
  background-color: #fffbeb;
  border: 2px solid #f59e0b;
  box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 14px;
  width: 100%;
  box-sizing: border-box;
}

.alerta-texto {
  font-size: clamp(12px, 2.2vw, 14px);
  line-height: 1.5;
  margin: 6px 0 10px 0;
  color: #78350f;
}

.datos-conexion {
  background-color: white;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #fef3c7;
  width: 100%;
  max-width: 360px;
  box-sizing: border-box;
}

.datos-conexion p {
  margin: 4px 0;
  font-size: clamp(11px, 2vw, 13px);
  color: #1e293b;
}

.codigo-red {
  font-family: monospace;
  background-color: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  color: #b45309;
  font-size: clamp(12px, 2.2vw, 14px);
}

.descripcion {
  font-size: 0.95rem;
  color: #334155;
  margin: 6px 0;
}

.descripcion a {
  color: #2563eb;
  text-decoration: none;
}

.descripcion a:hover {
  text-decoration: underline;
}
</style>
