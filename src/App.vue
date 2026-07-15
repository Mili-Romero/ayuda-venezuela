<template>
  <Bienvenida v-if="mostrarBienvenida" @entrar="accederAlPortal" />

  <HeaderNav @select-info="handleSelectInfo" />
  <div class="header-spacer"></div>

  <div class="pagina">

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
          <ContactosDirectos @select-info="handleSelectInfo" /> 
        </div>

        <!-- Botón de ayuda ya está arriba, dejamos solo lo esencial en la columna lateral -->
      </aside>

      <!-- Columna Principal Derecha: panel interactivo que cambia según selección -->
      <main class="columna-principal">


 <div v-if="activeInfoSection === ''">
    <GuiaHome />
  </div>

  <!-- 3. SECCIÓN CONTACTO (Si activeInfoSection es 'contacto') -->
  <div v-else-if="activeInfoSection === 'contacto'">
    <Contact />
  </div>

  <!-- 4. SECCIONES DEL SUB-MENÚ INFORMACIÓN (Para cualquier otra opción seleccionada) -->
  <div v-else class="panel-dinamico">
    <Comunicacion v-if="activeInfoSection === 'comunicacion'" :gruposWhatsapp="recursos.gruposWhatsapp" />
    <SismosDashboard v-else-if="activeInfoSection === 'sismos'" />
    <CanalesDonacion v-else-if="activeInfoSection === 'donacion'" />
    <RedMedica v-else-if="activeInfoSection === 'medica'" />
    <ApoyoInfantil v-else-if="activeInfoSection === 'infantil'" />
    <PlataformasAliadas v-else-if="activeInfoSection === 'plataformas'" />
  </div>

</main>


    </div> <!--Cerrar div contenido-->

    
  </div> <!--Div cerrar pagina -->


    <!-- Pie de Página Centralizado -->
        <footer class="footer-sitio">
          <p>📬 <strong>¿Quieres postular a tu fundación, red médica o plataforma voluntaria en esta central?</strong></p>
          <p>Envíanos la información oficial y los canales verificados de soporte a nuestro correo institucional:</p>
          <a href="mailto:Info@plasist.org" class="boton-email">Info@plasist.org</a>
          <div class="footer-nota">
            <p>©️ 2026 plasist.org - Plataforma de Asistencia Humanitaria Centralizada - Venezuela</p>
          </div>
        </footer>

</template>

<script setup>
import { ref } from 'vue'
// Cargamos las dos bases de datos locales externas de tu proyecto
import centrosAcopio from './data/acopio.json'
import datosRecursos from './data/recursos.json' // Cargamos la base de datos de recursos y enlaces verificados
import gallery from './components/gallery.vue'
import BotonAyuda from './components/BotonAyuda.vue'
import Bienvenida from './components/Bienvenida.vue' // Importamos el componente de bienvenida para mostrar la pantalla inicial
//import StarlinkCard from './components/StarlinkCard.vue'  // Importamos el componente de alerta de Starlink para mostrar la información de internet satelital gratuito
import HeaderNav from './components/HeaderNav.vue'

import SismosVenezuela from './components/SismosVenezuela.vue' // Seccion  simple
import ContactosDirectos from './components/ContactosDirectos.vue'
import ApoyoInfantil from './components/ApoyoInfantil.vue'
import PlataformasAliadas from './components/PlataformasAliadas.vue'
import CanalesDonacion from './components/CanalesDonacion.vue'
import RedMedica from './components/RedMedica.vue'
import Comunicacion from './components/Comunicacion.vue'
import SismosDashboard from "./components/sismos/SismosDashboard.vue"
//import SismosSparkline from "./components/sismos/SismosSparkline.vue"
import SismosFooter from "./components/sismos/SismosFooter.vue"
import Contact from '@/views/Contact.vue'
import GuiaHome from './components/GuiaHome.vue'



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
