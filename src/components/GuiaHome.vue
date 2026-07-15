<template>
  <div class="guia-home-contenedor">
    <!-- Tarjeta de Propósito -->
    <div class="tarjeta">
      <h2 class="titulo-seccion borde-azul">📌 Propósito de la Plataforma</h2>
      <p class="texto-proposito">
        <strong>plasist.org</strong> es una central de asistencia humanitaria digital e independiente. 
        Nuestro objetivo es mitigar la fragmentación de la información durante situaciones de contingencia en Venezuela, 
        reuniendo en un solo espacio seguro los canales de comunicación verificados, herramientas de monitoreo y redes de apoyo civil.
      </p>
    </div>

    <!-- Tarjeta de Guía de Navegación -->
    <div class="tarjeta">
      <h2 class="titulo-seccion borde-amarillo">🗺️ ¿Qué vas a conseguir en este portal?</h2>
      <p class="instrucciones" style="margin-bottom: 20px;">Explora las opciones del menú superior para acceder a las herramientas centralizadas:</p>
      
      <div class="grid-guias">
        <div class="item-guia">
          <span class="icono-guia">📡</span>
          <div class="info-guia">
            <h3>Comunicación</h3>
            <p>Puntos de conexión satelital gratuita (Starlink) y acceso a chats vecinales de WhatsApp.</p>
          </div>
        </div>

        <div class="item-guia">
          <span class="icono-guia">📊</span>
          <div class="info-guia">
            <h3>Sismos Venezuela</h3>
            <p>Monitoreo sísmico en tiempo real conectado directamente con los sensores de la USGS.</p>
          </div>
        </div>

        <div class="item-guia">
          <span class="icono-guia">❤️</span>
          <div class="info-guia">
            <h3>Donaciones</h3>
            <p>Canales oficiales y cuentas verificadas de fundaciones de soporte humanitario.</p>
          </div>
        </div>

        <div class="item-guia">
          <span class="icono-guia">🩺</span>
          <div class="info-guia">
            <h3>Red Médica</h3>
            <p>Directorio verificado de profesionales de la salud dispuestos a ofrecer asistencia voluntaria.</p>
          </div>
        </div>

        <div class="item-guia">
          <span class="icono-guia">🧸</span>
          <div class="info-guia">
            <h3>Apoyo Infantil</h3>
            <p>Recursos informativos y guías psicológicas enfocadas en el cuidado de niños.</p>
          </div>
        </div>

        <div class="item-guia">
          <span class="icono-guia">🤝</span>
          <div class="info-guia">
            <h3>Plataformas Aliadas</h3>
            <p>Enlaces directos a iniciativas digitales voluntarias que complementan el soporte civil.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guia-home-contenedor { display: flex; flex-direction: column; gap: 4px; }
.texto-proposito { font-size: 14.5px; line-height: 1.6; color: #334155; margin: 0; }
.grid-guias { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media (min-width: 600px) { .grid-guias { grid-template-columns: 1fr 1fr; } }
.item-guia { display: flex; gap: 12px; padding: 12px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; align-items: start; }
.icono-guia { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
.info-guia h3 { margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #0f1724; }
.info-guia p { margin: 0; font-size: 12.5px; color: #475569; line-height: 1.4; }
</style>
