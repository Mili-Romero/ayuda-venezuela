<template>
  <header class="site-header" :class="{ open: menuOpen }">
    <div class="header-inner">
      <!-- Busca esto en tu código y reemplázalo -->
        <div class="logo-wrap">
            <a class="logo" href="/">
                <div class="logo-contenedor-flexible" v-if="logoSrc">
                <!-- El CSS se encargará de recortar y posicionar todo -->
                <div class="logo-circulo-recorte">
                    <img :src="logoSrc" alt="Logo Círculo" />
                </div>
                <div class="logo-texto-lateral">
                    <span class="marca">Plasist<span class="rojo">.org</span></span>
                    <div class="estrellas">★ ★ ★ ★ ★ ★ ★</div>
                    <span class="eslogan">Plataforma de Asistencia Centralizada</span>
                </div>
                </div>
                <span v-else class="logo-text">plasist.org</span>
            </a>
        </div>



      

      <nav class="nav-desktop" aria-label="Main navigation">
        <ul>
          <li><a href="#" @click.prevent.stop="selectInfo('')">Home</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li class="has-dropdown">
            <a href="#informacion">Información ▾</a>
            <ul class="dropdown">
              <li><a href="#" @click.prevent.stop="selectInfo('comunicacion')">Comunicación</a></li>
              <li><a href="#" @click.prevent.stop="selectInfo('sismos')">Sismos Venezuela</a></li>
              <li><a href="#" @click.prevent.stop="selectInfo('donacion')">Donaciones</a></li>
              <li><a href="#" @click.prevent.stop="selectInfo('medica')">Red médica</a></li>
              <li><a href="#" @click.prevent.stop="selectInfo('infantil')">Apoyo Infantil</a></li>
              <li><a href="#" @click.prevent.stop="selectInfo('plataformas')">Plataformas Aliadas</a></li>
            </ul>
          </li>
          <!-- For Desktop Navigation (Around line 24) -->
          <li><a href="#" @click.prevent.stop="selectInfo('contacto')">Contacto</a></li>
        </ul>
      </nav>

      <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Abrir menú">
        <span class="bar" />
        <span class="bar" />
        <span class="bar" />
      </button>
    </div>

    <div class="mobile-menu" v-show="menuOpen">
      <ul>
        <li><a href="#" @click.prevent.stop="selectInfo('')">Home</a></li>
        <li><a href="#gallery" @click.prevent.stop="menuOpen = false">Gallery</a></li>
        <li><a href="#" @click.prevent.stop="selectInfo('comunicacion')">Comunicación</a></li>
        <li><a href="#" @click.prevent.stop="selectInfo('sismos')">Sismos Venezuela</a></li>
        <li><a href="#" @click.prevent.stop="selectInfo('donacion')">Donaciones</a></li>
        <li><a href="#" @click.prevent.stop="selectInfo('medica')">Red médica</a></li>
        <li><a href="#" @click.prevent.stop="selectInfo('infantil')">Apoyo Infantil</a></li>
        <li><a href="#" @click.prevent.stop="selectInfo('plataformas')">Plataformas Aliadas</a></li>
        <li><a href="#" @click.prevent.stop="selectInfo('contacto')">Contacto</a></li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['select-info'])
const menuOpen = ref(false)
// si existe una imagen de logo en public/images/logo.png se usará
const logoSrc = '/logo.png'

function selectInfo(section) {
  // cerrar menú móvil y emitir al padre
  menuOpen.value = false
  emit('select-info', section)
}
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 60;
  backdrop-filter: blur(6px);
  background: var(--header-bg, rgba(29,78,216,0.86));
  color: white;
  box-shadow: 0 2px 12px rgba(2,6,23,0.12);
}
.site-header::after {
  content: '';
  display: block;
  height: 6px;
  background: linear-gradient(90deg, #ffd100 0 33%, #0033a0 33% 66%, #d52b1e 66% 100%);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  text-decoration: none;
}

/* SISTEMA DE ACOMODO FLUIDO DEL LOGO INTERNO */
.logo-contenedor-flexible {
  display: flex;
  align-items: center;
  gap: 12px;
}


/* Limpiamos el contenedor para que solo actúe como un marco normal */
.logo-circulo-recorte {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* La imagen se adaptará de forma natural a los 50px de alto con su transparencia real */
.logo-circulo-recorte img {
  width: auto;
  height: 100%; /* Ocupa el alto completo de forma limpia */
  object-fit: contain; /* Evita cualquier estiramiento o deformación */
  display: block;
}


/* Alineación de textos a la derecha */
.logo-texto-lateral {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.1;
  text-align: left;
}

.logo-texto-lateral .marca {
  font-size: 20px;
  font-weight: 800;
  color: white;
  letter-spacing: 0.5px;
}

.logo-texto-lateral .marca .rojo {
  color: #dc2626 !important; /* Aplica color rojo ESTRICTAMENTE al texto .org */
  background: transparent !important; /* Elimina cualquier fondo accidental */
  display: inline !important; /* Fuerza a que no se comporte como un bloque/cuadro */
}

.logo-texto-lateral .estrellas {
  font-size: 8px;
  color: #ffffff;
  margin: 2px 0;
  letter-spacing: 2px;
}

.logo-texto-lateral .eslogan {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  max-width: 180px;
}

.logo-text { font-weight: 800; letter-spacing: 0.6px; font-size: 18px; }
.nav-desktop ul { list-style: none; margin: 0; padding: 0; display: flex; gap: 14px; }
.nav-desktop a { color: white; text-decoration: none; font-weight: 700; padding: 8px 10px; border-radius: 8px; }
.nav-desktop a:hover { background: rgba(255,255,255,0.08); }
.nav-desktop .has-dropdown { position: relative; }
.nav-desktop .dropdown {
  position: absolute;
  left: 0;
  top: 100%;
  background: rgba(255,255,255,0.94);
  color: var(--text);
  border-radius: 10px;
  padding: 8px 8px;
  list-style: none;
  display: none;
  min-width: 210px;
  box-shadow: 0 10px 30px rgba(2,6,23,0.18);
  z-index: 80;
  backdrop-filter: blur(6px);
}
.nav-desktop .dropdown li { margin: 0; }
.nav-desktop .dropdown a,
.nav-desktop .dropdown .nav-button {
  color: var(--text);
  display: block;
  padding: 8px 10px;
  font-weight: 700;
  text-align: left;
  width: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
}
.nav-desktop .has-dropdown:hover > .dropdown { display: block; }
.hamburger { display: none; background: transparent; border: 0; padding: 8px; cursor: pointer; }
.hamburger .bar { display: block; width: 22px; height: 2px; background: white; margin: 4px 0; border-radius: 2px; }
.mobile-menu { display: none; background: rgba(29,78,216,0.98); padding: 12px; }
.mobile-menu ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.mobile-menu a { color: white; text-decoration: none; font-weight: 700; padding: 8px 10px; border-radius: 8px; display: block; }

/* OPTIMIZACIONES RESPONSIVAS */
@media (max-width: 900px) {
  .nav-desktop { display: none; }
  .hamburger { display: block; }
  .mobile-menu { display: block; }
}

@media (max-width: 480px) {
  /* En teléfonos muy pequeños, ocultamos el eslogan para evitar romper la distribución lateral */
  .logo-texto-lateral .eslogan { display: none; }
  .logo-texto-lateral .estrellas { margin-bottom: 0; }
}
</style>