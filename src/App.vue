<template>
  <Bienvenida v-if="mostrarBienvenida" @entrar="accederAlPortal" />

  <div class="pagina">
    <!-- Encabezado: componente reutilizable -->
    <HeaderNav @select-info="handleSelectInfo" />

    <!-- Contenido en Rejilla Responsiva -->
    <div class="contenido">
      
      <!-- Columna Lateral Izquierda: Contactos Clave, Centros de Acopio e informacion importante -->
      <aside class="columna-lateral">

         <!-- Boton Ayuda -->
          <div class="tarjeta">
            <BotonAyuda />
          </div>

        <!-- Contactos Directos (teléfonos de emergencia) -->
        <div class="tarjetas">
          <ContactosDirectos /> 
        </div>

        <!-- Botón de ayuda ya está arriba, dejamos solo lo esencial en la columna lateral -->
      </aside>

      <!-- Columna Principal Derecha: panel interactivo que cambia según selección -->
      <main class="columna-principal">
        <div class="panel-dinamico">
          <div v-if="!activeInfoSection">
            <div class="tarjeta">
              <h2 class="titulo-seccion">Información</h2>
              <p class="instrucciones">Selecciona una opción en el menú "Información" para ver contenido interactivo aquí (Comunicación, Sismos, Donaciones, Plataformas, etc.).</p>
            </div>
          </div>
          <div v-else>
            <Comunicacion
              v-if="activeInfoSection === 'comunicacion'"
              :gruposWhatsapp="recursos.gruposWhatsapp"
            />
            <SismosDashboard v-else-if="activeInfoSection === 'sismos'" />
            <CanalesDonacion v-else-if="activeInfoSection === 'donacion'" />
            <RedMedica v-else-if="activeInfoSection === 'medica'" />
            <PlataformasAliadas v-else-if="activeInfoSection === 'plataformas'" />
            

          </div>
        </div>

        <template v-if="!activeInfoSection">
          <!-- Bloque 1: Carpetas oficiales de Google Drive -->
          <div class="tarjeta">
            <h2 class="titulo-seccion borde-amarillo">📂 Carpetas Oficiales de Ingresos Hospitalarios</h2>
            <p class="instrucciones">
              Accede de forma directa a las bases de datos originales compartidas por los centros médicos. 
              Revisa los listados organizados en la nube en tiempo real.
            </p>
            <div class="zona-enlaces">
              <a v-for="link in recursos.enlacesDrive" :key="link.id" :href="link.url" target="_blank" class="btn-drive-oficial">
                {{ link.titulo }}
              </a>
            </div> <!-- AQUÍ TERMINA ZONA-ENLACES -->

            <!-- Descargar archivo: -->
            <div class="zona-descargas-locales" style="margin-top: 15px; border-top: 1px dashed #e2e8f0; padding-top: 15px;">
              <p class="instrucciones" style="margin-bottom: 8px;">📋 Informes consolidados recibidos por canales comunitarios:</p>
              <a v-for="descarga in recursos.descargasLocales" :key="descarga.id" :href="descarga.url" target="_blank" class="btn-descarga-local">
                {{ descarga.titulo }}
              </a>
            </div>
          </div> <!-- AQUÍ CIERRA LA TARJETA PRINCIPAL -->
   
          <!-- Bloque 2: Galería de Fotos de Sobrevivientes (Componente Modular Separado) -->
          <section id="gallery">
            <gallery :lista-fotos="recursos.fotosSobrevivientes" />
          </section>
        </template>

      </main>
    </div> <!--Cerrar div contenido-->

    <!-- Pie de Página Centralizado -->
    <footer class="footer-sitio">
      <p>📬 <strong>¿Quieres postular a tu fundación, red médica o plataforma voluntaria en esta central?</strong></p>
      <p>Envíanos la información oficial y los canales verificados de soporte a nuestro correo institucional:</p>
      <a href="mailto:Info@plasist.org" class="boton-email">Info@plasist.org</a>
      <div class="footer-nota">
        <p>©️ 2026 plasist.org - Plataforma de Asistencia Humanitaria Centralizada - Venezuela</p>
      </div>
    </footer>
  </div> <!--Div cerrar pagina -->
</template>

<script setup>
import { ref } from 'vue'
// Cargamos las dos bases de datos locales externas de tu proyecto
import centrosAcopio from './data/acopio.json'
import datosRecursos from './data/recursos.json' // Cargamos la base de datos de recursos y enlaces verificados
import gallery from './components/gallery.vue'
import BotonAyuda from './components/BotonAyuda.vue'
import Bienvenida from './components/Bienvenida.vue' // Importamos el componente de bienvenida para mostrar la pantalla inicial
import StarlinkCard from './components/StarlinkCard.vue'  // Importamos el componente de alerta de Starlink para mostrar la información de internet satelital gratuito
import HeaderNav from './components/HeaderNav.vue'

import SismosVenezuela from './components/SismosVenezuela.vue'
import ContactosDirectos from './components/ContactosDirectos.vue'
import ApoyoInfantil from './components/ApoyoInfantil.vue'
import PlataformasAliadas from './components/PlataformasAliadas.vue'
import CanalesDonacion from './components/CanalesDonacion.vue'
import RedMedica from './components/RedMedica.vue'
import Comunicacion from './components/Comunicacion.vue'
import SismosDashboard from "./components/sismos/SismosDashboard.vue"
import SismosSparkline from "./components/sismos/SismosSparkline.vue"
import SismosFooter from "./components/sismos/SismosFooter.vue"
// Esta variable inicia en true (verdadero) para obligar a que la pantalla de bienvenida salga primero
const mostrarBienvenida = ref(true)

// Función que apaga la bienvenida cuando el usuario presiona "Entrar al Portal Informativo"
const accederAlPortal = () => {
  mostrarBienvenida.value = false
}


const recursos = ref(datosRecursos)

// estado para controlar qué panel interactivo se muestra en la columna principal
const activeInfoSection = ref('')

function handleSelectInfo(section) {
  activeInfoSection.value = section
}

// Función inteligente: si una foto falla por la extensión (.jpg), 
// el sistema intenta cargarla de forma transparente como .jpeg, .JPEG o .png
const corregirExtensionWhatsApp = (evento, foto) => {
  const imagenHtml = evento.target
  if (imagenHtml.src.endsWith('.jpg')) {
    imagenHtml.src = foto.url.replace('.jpg', '.jpeg')
  } else if (imagenHtml.src.endsWith('.jpeg')) {
    imagenHtml.src = foto.url.replace('.jpg', '.JPEG')
  } else if (imagenHtml.src.endsWith('.JPEG')) {
    imagenHtml.src = foto.url.replace('.jpg', '.png')
  }
}
</script>
