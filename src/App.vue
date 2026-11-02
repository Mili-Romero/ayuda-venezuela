<template>
  <HeaderNav @select-info="handleSelectInfo" />
  <div class="header-spacer"></div>

  <div class="pagina">
    <main class="columna-principal">
        <div v-if="activeInfoSection === ''" class="panel-seccion">
          <GuiaHome />
        </div>
        <div v-else-if="activeInfoSection === 'contacto'" class="panel-seccion">
          <Contact />
        </div>
        <div v-else-if="activeInfoSection === 'admin'" class="panel-seccion">
          <AdminPanel />
        </div>
        <div v-else class="panel-dinamico">
          <div v-if="activeInfoSection === 'comunicacion'" class="panel-seccion">
            <Comunicacion :gruposWhatsapp="recursos.gruposWhatsapp" />
          </div>
          <div v-else-if="activeInfoSection === 'sismos'" class="panel-seccion">
            <SismosDashboard />
          </div>
          <div v-else-if="activeInfoSection === 'donacion'" class="panel-seccion">
            <CanalesDonacion />
          </div>
          <div v-else-if="activeInfoSection === 'medica'" class="panel-seccion">
            <RedMedica />
          </div>
          <div v-else-if="activeInfoSection === 'infantil'" class="panel-seccion">
            <ApoyoInfantil />
          </div>
          <div v-else-if="activeInfoSection === 'plataformas'" class="panel-seccion">
            <PlataformasAliadas />
          </div>
          <div v-else-if="activeInfoSection === 'prevencion-sismos'" class="panel-seccion">
            <Sismos />
          </div>
          <div v-else-if="activeInfoSection === 'prevencion-inundaciones'" class="panel-seccion">
            <Inundaciones />
          </div>
        </div>
    </main>
  </div>

  <!-- Pie de Página Centralizado -->
  <footer class="footer-sitio">
          <p>📬 <strong>¿Quieres postular a tu fundación, red médica o plataforma voluntaria en esta central?</strong></p>
          <p>Envíanos la información oficial y los canales verificados de soporte a nuestro correo institucional:</p>
          <a href="mailto:Info@plasist.org" class="boton-email">Info@plasist.org</a>
          <div class="footer-redes" aria-label="Redes sociales">
            <a href="https://www.facebook.com/ResistenciaVenezuela.suecia" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" /></svg>
              Facebook
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle class="icono-punto" cx="17.5" cy="6.5" r="1" /></svg>
              Instagram
            </a>
          </div>
          <div class="footer-nota">
            <p>©️ 2026 plasist.org - Plataforma de Asistencia Humanitaria Centralizada - Venezuela</p>
          </div>
  </footer>

</template>

<script setup>
import { ref } from 'vue'
// Cargamos las dos bases de datos locales externas de tu proyecto
import datosRecursos from './data/recursos.json' // Cargamos la base de datos de recursos y enlaces verificados

import HeaderNav from './components/HeaderNav.vue'

import ApoyoInfantil from './components/ApoyoInfantil.vue'
import PlataformasAliadas from './components/PlataformasAliadas.vue'
import CanalesDonacion from './components/CanalesDonacion.vue'
import RedMedica from './components/RedMedica.vue'
import Comunicacion from './components/Comunicacion.vue'
import SismosDashboard from "./components/sismos/SismosDashboard.vue"
// IMPORTACIÓN DIRECTA DE LAS GUÍAS INDEPENDIENTES DE DESASTRES
import Sismos from './components/prevencion/Sismos.vue' 
import Inundaciones from './components/prevencion/Inundaciones.vue'

import Contact from '@/views/Contact.vue'
import AdminPanel from '@/views/AdminPanel.vue'
import GuiaHome from './components/GuiaHome.vue'


const recursos = ref(datosRecursos)

// estado para controlar qué panel interactivo se muestra en la columna principal
const activeInfoSection = ref('')

function handleSelectInfo(section) {
  activeInfoSection.value = section
}
</script>

<style scoped>
.footer-redes {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0;
}

.footer-redes a,
.footer-redes svg {
  display: inline-flex;
  align-items: center;
}

.footer-redes a {
  gap: 7px;
  color: #1d4ed8;
  font-weight: 700;
  text-decoration: none;
}

.footer-redes svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 1.8;
}

.footer-redes svg rect,
.footer-redes svg circle {
  fill: none;
}

.footer-redes svg .icono-punto {
  fill: currentColor;
}
</style>
