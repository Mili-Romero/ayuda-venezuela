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
  <div class="ContactosDirectos">
    <h2 class="titulo-seccion borde-azul">📞 Teléfonos de Emergencia</h2>

    <ul>
      <li>
        <strong>Dir. Emergencias (Nacional):</strong>
        <a href="tel:911">VEN 911 📞</a>
      </li>

      <li>
        <strong>Protección Civil (Nacional):</strong>
        <a href="tel:166">166 📞</a>
      </li>

      <li>
        <strong>Bomberos (Nacional):</strong>
        <a href="tel:167">167 📞</a>
      </li>

      <li>
        <strong>Protección Civil (Capital):</strong>
        <a href="tel:+582125753332">0212-5753332 📞</a>
      </li>

      <li>
        <strong>Bomberos (Capital):</strong>
        <a href="tel:+582125454545">0212-5454545 📞</a>
      </li>

      <li>
        <strong>Bomberos (U.S.B.):</strong>
        <a href="tel:+584124038790">0412-4038790 📞</a>
      </li>

      <li>
        <strong>Protección Civil (Litoral):</strong>
        <a href="tel:+584242075335">0424-2075335 📞</a>
      </li>

      <li>
        <strong>Bomberos (Litoral):</strong>
        <a href="tel:+582123322165">0212-3322165 📞</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ContactosDirectos {
  max-width: 700px;
  margin: 40px auto;
  padding: 25px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.titulo-seccion {
  text-align: center;
  color: #c62828;
  font-size: 2rem;
  margin-bottom: 20px;
}

.borde-azul {
  border-bottom: 3px solid #1976d2;
  display: inline-block;
  padding-bottom: 8px;
}

.ContactosDirectos ul {
  list-style: none;
  padding: 0;
}

.ContactosDirectos li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
  padding: 15px;
  background: #f5f5f5;
  border-left: 6px solid #c62828;
  border-radius: 10px;
}

.ContactosDirectos li:hover {
  background: #ffeaea;
}

.ContactosDirectos strong {
  color: #c62828;
}

.ContactosDirectos a {
  color: #1976d2;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  transition: 0.3s;
}

.ContactosDirectos a:hover {
  color: #c62828;
  transform: scale(1.05);
}

@media (max-width: 600px) {
  .ContactosDirectos li {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .ContactosDirectos a {
    font-size: 1.1rem;
  }
}
</style>
<script setup>
// aquí no necesitas lógica todavía
</script>