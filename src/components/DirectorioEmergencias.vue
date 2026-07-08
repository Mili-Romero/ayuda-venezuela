<template>
  <section class="contactos-directos">
    <h2 class="titulo-seccion">📞 Teléfonos de Emergencia</h2>

    <!-- Números principales -->
    <div class="contactos-grid">
      <a
        v-for="contacto in contactos"
        :key="contacto.telefono"
        class="contacto-card"
        :href="`tel:${contacto.telefono}`"
      >
        <span class="numero">{{ contacto.numero }}</span>
        <span class="nombre">{{ contacto.nombre }}</span>
      </a>
    </div>

    <!-- Acordeón -->
    <div class="acordeon">
      <details
        v-for="categoria in categorias"
        :key="categoria.titulo"
        class="acordeon-item"
      >
        <summary>
          <span class="categoria-titulo">
            <span>{{ categoria.icono }}</span>
            {{ categoria.titulo }}
          </span>

          <span class="contador">{{ categoria.items.length }}</span>
        </summary>

        <div class="lista-contactos">
          <div
            v-for="item in categoria.items"
            :key="item.nombre"
            class="fila-contacto"
          >
            <strong>{{ item.nombre }}</strong>

            <div class="telefonos">
              <a
                v-for="telefono in item.telefonos"
                :key="telefono"
                :href="`tel:${limpiarTelefono(telefono)}`"
              >
                {{ telefono }}
              </a>
            </div>
          </div>
        </div>
      </details>
    </div>
  </section>
</template>

<script setup>
const contactos = [
  { numero: "911", nombre: "VEN 911", telefono: "911" },
  { numero: "166", nombre: "Protección Civil", telefono: "166" },
  { numero: "167", nombre: "Bomberos", telefono: "167" },
  { numero: "171", nombre: "Cantv", telefono: "171" }
]

const categorias = [
  {
    titulo: "Hospitales y clínicas",
    icono: "🏥",
    items: [
      {
        nombre: "Hospital Dr. José María Vargas",
        telefonos: ["0212-862-74-22"]
      },
      {
        nombre: "Hospital Universitario de Caracas",
        telefonos: ["0212-605-32-22"]
      },
      {
        nombre: "Hospital Pérez Carreño",
        telefonos: ["0212-472-83-11"]
      }
    ]
  },
  {
    titulo: "Ambulancias",
    icono: "🚑",
    items: [
      {
        nombre: "Ambulancias Distrito Capital",
        telefonos: ["911", "171"]
      },
      {
        nombre: "Cruz Roja Venezolana",
        telefonos: ["0212-571-47-13"]
      }
    ]
  },
  {
    titulo: "Bomberos",
    icono: "🚒",
    items: [
      {
        nombre: "Bomberos Nacional",
        telefonos: ["167"]
      },
      {
        nombre: "Bomberos Vargas",
        telefonos: ["0212-332-21-65"]
      },
      {
        nombre: "Bomberos U.S.B.",
        telefonos: ["0412-403-87-90"]
      }
    ]
  },
  {
    titulo: "Policía",
    icono: "🚓",
    items: [
      {
        nombre: "Emergencias VEN 911",
        telefonos: ["911"]
      },
      {
        nombre: "Policía Nacional Bolivariana",
        telefonos: ["911"]
      }
    ]
  },
  {
    titulo: "Protección civil",
    icono: "🛡️",
    items: [
      {
        nombre: "Protección Civil Nacional",
        telefonos: ["166"]
      },
      {
        nombre: "Protección Civil Capital",
        telefonos: ["0212-575-33-32"]
      },
      {
        nombre: "Protección Civil Vargas",
        telefonos: ["0424-207-53-35"]
      }
    ]
  },
  {
    titulo: "Rescate y tránsito",
    icono: "🆘",
    items: [
      {
        nombre: "Grupo de Rescate Caracas",
        telefonos: ["0212-615-63-86", "0415-46-61"]
      },
      {
        nombre: "Grupo de Rescate Venezuela",
        telefonos: ["0212-977-47-10"]
      },
      {
        nombre: "Socorristas Cruz Roja",
        telefonos: ["0212-571-47-13"]
      },
      {
        nombre: "Inspectoría Nacional de Tránsito",
        telefonos: ["167"]
      }
    ]
  }
]

function limpiarTelefono(telefono) {
  return telefono.replaceAll("-", "").replaceAll(" ", "")
}
</script>

<style scoped>
/* CONTENEDOR GENERAL */
.contactos-directos {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e6eef7;
  box-shadow: 0 6px 18px rgba(16,24,40,0.04);
}

.titulo-seccion {
  margin-top: 0;
  font-size: 16px;
  font-weight: 750;
  padding-bottom: 10px;
  border-bottom: 3px solid #1d4ed8; /* Línea azul característica de tu diseño */
  color: #1e3a8a;
  margin-bottom: 20px;
}

/* 1. DISEÑO DE LAS TARJETAS SUPERIORES (Números principales 911, 166, etc.) */
.contactos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  margin-bottom: 24px;
}

.contacto-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  text-decoration: none;
  text-align: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.contacto-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  background-color: #f1f5f9;
}

.contacto-card .numero {
  font-size: 20px;
  font-weight: 800;
  color: #dc2626; /* Números principales en rojo de emergencia */
}

.contacto-card .nombre {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  margin-top: 4px;
}

/* 2. DISEÑO DEL ACORDEÓN (ESTILO EXACTO A LA FOTO) */
.acordeon {
  display: flex;
  flex-direction: column;
  gap: 12px; /* Espacio entre cada barra gris */
}

.acordeon-item {
  background: #ffffff;
  border: 1px solid #e6eef7;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(16,24,40,0.03);
  transition: box-shadow 0.2s ease;
}

/* Barra del encabezado que se puede clickear */
summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background-color: #f8fafc; /* Fondo gris sutil de la foto */
  cursor: pointer;
  user-select: none;
  list-style: none; /* Quita la flecha por defecto en navegadores modernos */
}

/* Ocultar flecha nativa en Safari */
summary::-webkit-details-marker {
  display: none;
}

/* Alineación del icono y el texto del título */
.categoria-titulo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 14px;
  color: #0f1724;
}

/* Estilo exacto del contador gris de la derecha */
.contador {
  background-color: #e2e8f0;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 20px; /* Óvalo gris */
  margin-right: 28px; /* Espacio para que no choque con la flecha custom */
  margin-left: auto;
}

/* CREACIÓN DE LA FLECHA LATERAL (Estilo nativo de la imagen) */
summary::after {
  content: '➔';
  transform: rotate(90deg); /* Apunta hacia abajo por defecto */
  font-size: 11px;
  color: #64748b;
  transition: transform 0.2s ease;
  position: absolute;
  right: 36px; /* Posicionamiento exacto */
}

/* Cuando el acordeón se abre, la flecha gira hacia arriba */
.acordeon-item[open] summary::after {
  transform: rotate(-90deg);
}

/* Contenedor interno de los contactos desplegados */
.lista-contactos {
  background-color: #ffffff;
  border-top: 1px solid #f1f5f9;
  padding: 4px 0;
}

/* Filas de contactos internas (Estilo de la sección abierta de tu foto) */
.fila-contacto {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f8fafc;
  font-size: 13.5px;
}

.fila-contacto:last-child {
  border-bottom: none;
}

.fila-contacto strong {
  font-weight: 600;
  color: #334155;
  max-width: 60%; /* Evita que nombres largos pisen los números */
}

/* Bloque contenedor de enlaces telefónicos a la derecha */
.telefonos {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

/* Estilo exacto de los números de teléfono azules */
.telefonos a {
  color: #2563eb; /* Azul telefónico de tu imagen */
  text-decoration: none;
  font-weight: 700;
  font-size: 13.5px;
  letter-spacing: 0.3px;
  transition: color 0.15s ease;
}

.telefonos a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* RESPONSIVO AJUSTADO */
@media (max-width: 480px) {
  .fila-contacto {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .telefonos {
    align-items: flex-start;
    width: 100%;
  }
  .contador {
    margin-right: 16px;
  }
  summary::after {
    right: 24px;
  }
}
</style>
