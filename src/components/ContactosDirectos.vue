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
          Más números de emergencia en el 
          <a href="#" @click.prevent.stop="selectInfo('comunicacion')">aqui</a>
        </p>

    </div>
  </section>
</template>

<script setup>
import { ssrLooseEqual } from 'vue/server-renderer';

const emit = defineEmits(['select-info'])

function selectInfo(section) {
  emit('select-info', section)
}


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

/* ESTILO PARA EL PÁRRAFO DE LA NOTA */
.nota {
  font-size: 13px;
  color: #64748b; /* Gris muted para que no compita visualmente con el contenido de arriba */
  margin-top: 14px;
  line-height: 1.4;
  text-align: left;
}

/* ESTILO EXACTO PARA EL ENLACE INTERACTIVE DE VUE */
.nota a {
  color: #1d4ed8; /* Azul marino institucional coincidente con tu --accent-blue */
  text-decoration: none; /* Subrayado clásico de navegación */
  font-weight: 750; /* Resalta el grosor para dar constancia de que es clickeable */
  transition: color 0.15s ease;
  display: inline-block;
}

/* Efecto al pasar el cursor por encima */
.nota a:hover {
  color: #1e3a8a; /* Se oscurece a un azul más profundo para dar feedback visual */
  text-decoration: underline;
}

</style>
