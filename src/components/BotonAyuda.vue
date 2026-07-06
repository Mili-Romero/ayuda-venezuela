<template>
  <div class="tarjeta boton-ayuda">
    <h2>¿Necesitas ayuda?</h2>

    <p class="texto">
      Presiona el botón para enviar una solicitud de alimentos, comidas preparadas o insumos esenciales al equipo de <strong>Cocinando por Venezuela.</strong> Las solicitudes son atendidas por voluntarios comprometidos que trabajan para brindar apoyo a las familias afectadas, de acuerdo con la disponibilidad de recursos.
    </p>

    <a href="https://cocinandoporvenezuela.org/solicitar-ayuda" target="_blank" class="btn-ayuda">
      Solicitar
    </a>
  </div>
</template>

<script setup>
// aquí no necesitas lógica todavía
</script>

<style scoped>
.boton-ayuda {
  background: #ffffff;
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.texto {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 12px;
}

.btn-ayuda {
  display: block;
  text-align: center;
  background: #dc2626;
  color: white;
  padding: 12px;
  border-radius: 6px;
  font-weight: 700;
  text-decoration: none;
}

.btn-ayuda:hover {
  background: #f90303;
}
</style>