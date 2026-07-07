    <!---- Contactos Directos 
<template>
        <div class="ContactosDirectos">
          <h2 class="titulo-seccion borde-azul">📞 Teléfonos de Emergencia</h2>
          <ul>
            <li><strong>Dir. Emergencias(Nacional):</strong>VEN 911</li>
            <li><strong>Protección Civil(Nacional):</strong>166</li>
            <li><strong>Bomberos(Nacional):</strong>167</li>
            <li><strong>Protección Civil(Capital):</strong> 0212-575332</li>
            <li><strong>Bomberos(Capital):</strong>0212-5454545</li>
            <li><strong>Bomberos(U.S.B.):</strong>0412-4038790</li>
            <li><strong>Protección Civil(Litoral):</strong> 0424-2075335</li>
            <li><strong>Bomberos(Litoral):</strong>0212-3322165</li>
          </ul>
        </div>
        </template>
        -->
<template>
  <section class="contactos-directos">
    <h2 class="titulo-seccion">📞 Teléfonos de emergencia</h2>

    <div class="contactos-grid">
      <a v-for="contacto in contactos"
        :key="contacto.numero"
        class="contacto-card"
        :href="`tel:${contacto.telefono}`">

        <span class="numero">{{ contacto.numero }}</span>
        <span class="nombre">{{ contacto.nombre }}</span>
      </a>

       <p class="nota">
      Más numeros de emergencia en el<strong>enlace.</strong>
    </p>
    </div>
  </section>
</template>

<script setup>
const contactos = [
  {
    numero: "911",
    nombre: "VEN 911",
    telefono: "911"
  },
  {
    numero: "166",
    nombre: "Protección Civil",
    telefono: "166"
  },
  {
    numero: "167",
    nombre: "Bomberos",
    telefono: "167"
  },
  {
    numero: "911",
    nombre: "Movilnet",
    telefono: "911"
  },
  {
    numero: "112",
    nombre: "Digitel",
    telefono: "112"
  },
  {
    numero: "171",
    nombre: "Fijo CANTV",
    telefono: "171"
  }
]
</script>

<style scoped>

.contactos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.contacto-card {
  min-height: 70px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #dbe4ef;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: all .2s ease;
}

.contacto-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(15, 23, 42, .12);
}

.numero {
  color: #2563eb;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1;
}

.nombre {
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.15;
  font-weight: 500;
}

.nota {
  grid-column: 1 / -1;
  text-align: center;
  margin-top: 16px;
  color: #64748b;
  font-size: 0.9rem;
}

.nota strong {
  display: block;
  margin-top: 4px;
  color: #2563eb;
}
</style>
