<template>
  <footer class="sismos-footer">
    <div class="footer-brand">
      <!--<strong>Plasist.org</strong>
      <span>Plataforma de Asistencia Centralizada</span> -->
    </div>

    <div class="footer-status">
      <span :class="online ? 'status-online' : 'status-offline'">
        {{ online ? "Sistema en línea" : "Sin conexión" }}
      </span>

      <small>
        Última actualización:
        {{ ultimaActualizacion || "Sin datos" }}
      </small>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  ultimaActualizacion: {
    type: String,
    default: "Sin datos"
  },
  online: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.sismos-footer {
  margin-top: 24px;
  padding: 18px;
  border-radius: 16px;
  background: #0f172a;
  color: white;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-brand span {
  font-size: 0.85rem;
  opacity: 0.75;
}

.footer-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.status-online {
  color: #22c55e;
  font-weight: 600;
}

.status-offline {
  color: #ef4444;
  font-weight: 600;
}

.footer-status small {
  opacity: 0.75;
}

@media (max-width: 640px) {
  .sismos-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-status {
    align-items: flex-start;
  }
}
</style>