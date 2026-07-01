<template>
  <Bienvenida v-if="mostrarBienvenida" @entrar="accederAlPortal" />

  <div class="pagina">
    <!-- Encabezado Oficial PLAsist.org -->
    <header class="header-tricolor">
      <div class="franja franja-amarilla"></div>
      <div class="franja franja-azul"></div>
      <div class="franja franja-roja"></div>
      <div class="header-contenido">
        <h1>plasist.org</h1>
        <p>Plataforma de Asistencia Humanitaria Centralizada - Venezuela </p>
      </div>
    </header>

    <!-- Contenido en Rejilla Responsiva -->
    <div class="contenido">
      
      <!-- Columna Lateral Izquierda: Contactos Clave y Centros de Acopio -->
      <aside class="columna-lateral">
        <!-- ALERTA DE INTERNET MÓVIL STARLINK -->
          <div class="tarjeta alerta-starlink">
            <h2 class="titulo-seccion borde-amarillo">📡 Internet Satelital Disponible</h2>
            <p class="alerta-texto">Hay un punto <strong>Starlink</strong> activo moviéndose por la zona de desastre:</p>
            <div class="datos-conexion">
              <p><strong>Red/Usuario:</strong> <span class="codigo-red">Ja2402</span></p>
              <p><strong>Contraseña:</strong> <span class="codigo-red">12345678</span></p>
            </div>
            <p class="referencia-movil">🛻 <strong>Ubicación:</strong> Lo carga una camioneta negra. El equipo Starlink está montado sobre el capó.</p>
          </div>

        <!-- Contactos Directos -->
        <div class="tarjeta">
          <h2 class="titulo-seccion borde-azul">📞 Teléfonos de Emergencia</h2>
          <ul>
            <li><strong>Protección Civil:</strong> 0800-7248451</li>
            <li><strong>Bomberos:</strong> 0212-5417133 & 0212-577-9209911</li> <!-- Corregir esto -->
            <li><strong>Bomberos USB:</strong> 0412-4038790</li>
            <li><strong>Cruz Roja:</strong> 0212-5714522</li>
          </ul>
        </div>

<!-- NUEVA TARJETA CHATS DE WHATSAPP VECINDARIOS LA GUAIRA -->
<div class="tarjeta">
  <h2 class="titulo-seccion borde-azul">🏢 Chats de WhatsApp de Vecinos (La Guaira)</h2>
  <p class="instrucciones">Grupos directos por residencias para coordinación local y búsqueda de familiares:</p>
  <div class="lista-chats-whatsapp">
    <div v-for="grupo in recursos.gruposWhatsapp" :key="grupo.id" class="item-chat-vecinal">
      <a :href="grupo.url" target="_blank" class="chat-link">
        🟢 {{ grupo.nombre }}
      </a>
    </div>
  </div>
</div>


        <!-- Centros de Acopio Unificados -->
        <div class="tarjeta">
          <h2 class="titulo-seccion borde-azul">📦 Centros de Acopio Oficiales</h2>
          <p class="instrucciones">Toca el nombre del lugar para abrir el flyer oficial en otra pestaña:</p>
          <div class="lista-centros">
            <div v-for="centro in centrosAcopio" :key="centro.id" class="item-centro">
              <div class="centro-info">
                <span class="centro-pais">{{ centro.pais }} - {{ centro.ciudad }}</span>
                <a :href="centro.flyer" target="_blank" class="centro-link">
                  🏢 <strong>{{ centro.nombreLugar }}</strong>
                </a>
                <span class="centro-direccion">{{ centro.direccion }}</span>
                <small class="centro-detalles">🕒 Horario: {{ centro.horario }}</small>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Columna Principal Derecha: Enlaces Rápidos y Galerías de Fotos -->
      <main class="columna-principal">
        
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






        <!-- Bloque 2: Galería de Fotos de Sobrevivientes (Campo de Golf / Caribe) -->
                <!-- Bloque 2: Galería de Fotos de Sobrevivientes (Componente Modular Separado) -->
        <gallery :lista-fotos="recursos.fotosSobrevivientes" />

        

        <!-- Bloque 3: Red de Apoyo de Médicos Remotos -->
        <div class="tarjeta">
          <h2 class="titulo-seccion borde-amarillo">🩺 Red de Apoyo Médico Remoto</h2>
          <p class="instrucciones">Profesionales de la salud ofreciendo telemedicina y contención psicológica gratuita a distancia:</p>
          <div class="lista-medicos">
            <div v-for="medico in recursos.medicos" :key="medico.id" class="item-medico">
              <div class="medico-header">
                <strong>👤 {{ medico.nombre }}</strong>
              </div>
              <div class="medico-especialidad">{{ medico.especialidad }}</div>
              <span class="medico-contacto">💬 Contacto: {{ medico.contacto }}</span>
            </div>
          </div>
        </div>

        <!-- Bloque 4: Canales de Donación Seguros -->
        <div class="tarjeta">
          <h2 class="titulo-seccion borde-amarillo">🤝 Donaciones y Fundaciones Verificadas</h2>
          <p class="instrucciones">Enlaces directos a portales institucionales serios para canalizar aportes económicos de forma transparente [12:49]:</p>
          <div class="lista-medicos">
            <div v-for="funda in recursos.fundaciones" :key="funda.id" class="item-medico border-funda">
              <div class="medico-header">
                <strong>🏛️ {{ funda.nombre }}</strong>
                <a :target="_blank" :href="funda.enlace" class="link-externo">Donar ➡️</a>
              </div>
              <p class="desc-funda">{{ funda.descripcion }}</p>
            </div>
          </div>
        </div>

        <!-- Bloque 5: Plataformas Aliadas y Otras Herramientas Voluntarias -->
        <div class="tarjeta">
          <h2 class="titulo-seccion borde-amarillo">🌐 Plataformas Aliadas y Voluntariado</h2>
          <p class="instrucciones">Herramientas creadas por otros equipos ciudadanos que complementan la ayuda humanitaria:</p>
          <div class="lista-medicos">
            <div v-for="plat in recursos.plataformas" :key="plat.id" class="item-medico border-plat">
              <div class="medico-header">
                <strong>💻 {{ plat.titulo }}</strong>
                <a :target="_blank" :href="plat.enlace" class="link-externo">Ir al Portal ➡️</a>
              </div>
              <div class="autor-plat">Desarrollado por: {{ plat.autor }}</div>
              <p class="desc-funda">{{ plat.descripcion }}</p>
            </div>
          </div>
        </div>

      </main>
    </div> <!--Cerrar div contenido-->

    <!-- Pie de Página Centralizado -->
    <footer class="footer-sitio">
      <p>📬 <strong>¿Quieres postular a tu fundación, red médica o plataforma voluntaria en esta central?</strong></p>
      <p>Envíanos la información oficial y los canales verificados de soporte a nuestro correo institucional:</p>
      <a href="mailto:Info@plasist.org" class="boton-email">Info@plasist.org</a>
      <p>Plasist.org es una plataforma humanitaria creada de manera voluntaria por venezolanos dentro y fuera del país para centralizar información que facilite la coordinación de la ayuda durante situaciones de emergencia. Nuestro objetivo es reunir en un solo lugar recursos oficiales, centros de asistencia, redes de apoyo, información para la búsqueda de personas y herramientas desarrolladas por organizaciones y voluntarios. PLAsist.org no recibe ni administra dinero, no solicita donaciones económicas y no gestiona ayudas en nombre de terceros. Nuestra labor consiste exclusivamente en organizar y difundir información pública y verificada para ponerla al servicio de quienes la necesiten.</p>
      <div class="footer-nota">
        <p>©️ 2026 plasist.org - Plataforma de Asistencia Humanitaria Centralizada - Venezuela</p>
      </div>
    </footer>
  </div> <!--Div cerrar pagina -->
</template>

<script setup>
import { ref } from 'vue'
// Cargamos las dos bases de datos locales externas de tu proyecto
import centrosAcopio from './acopio.json'
import datosRecursos from './recursos.json'
import gallery from './gallery.vue'
// INSERCIÓN QUIRÚRGICA: IMPORTAR COMPONENTE DE BIENVENIDA y VARIABLE DE CONTROL
import Bienvenida from './Bienvenida.vue'

// Esta variable inicia en true (verdadero) para obligar a que la pantalla de bienvenida salga primero
const mostrarBienvenida = ref(true)

// Función que apaga la bienvenida cuando el usuario presiona "Entrar al Portal Informativo"
const accederAlPortal = () => {
  mostrarBienvenida.value = false
}


const recursos = ref(datosRecursos)

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
<style>
/* CONFIGURACIÓN GENERAL INTERFAZ INFORMATIVA */
body { 
  margin: 0; 
  font-family: system-ui, -apple-system, sans-serif; 
  background-color: #f1f5f9; 
  color: #1e293b; 
}

.pagina { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 15px; 
}

/* ENCABEZADO TRICOLOR */
.header-tricolor { 
  background-color: #1e3a8a; 
  border-radius: 8px; 
  overflow: hidden; 
  margin-bottom: 20px; 
  color: white; 
}

.franja { 
  height: 6px; 
  width: 100%; 
}

.franja-amarilla { background-color: #facc15; }
.franja-azul { background-color: #1d4ed8; }
.franja-roja { background-color: #dc2626; }

.header-contenido { 
  text-align: center; 
  padding: 25px 15px; 
}

.header-contenido h1 { 
  margin: 0; 
  font-size: 28px; 
  font-weight: 800; 
}

.header-contenido p { 
  margin: 5px 0 0 0; 
  opacity: 0.9; 
  font-size: 14.5px; 
}

/* REJILLA RESPONSIVA */
.contenido { 
  display: grid; 
  grid-template-columns: 1fr; 
  gap: 20px; 
}

.columna-principal {
  min-width: 0; /* TRUCO TÉCNICO: Fuerza a la columna a respetar el ancho del celular y activa el scroll interno */
  width: 100%;
}

@media (min-width: 768px) { 
  .contenido { grid-template-columns: 340px 1fr; } 
}

.tarjeta { 
  background: white; 
  padding: 20px; 
  border-radius: 8px; 
  border: 1px solid #e2e8f0; 
  margin-bottom: 20px; 
}

.titulo-seccion { 
  margin-top: 0; 
  font-size: 16px; 
  font-weight: 750; 
  padding-bottom: 8px; 
  border-bottom: 3px solid #cbd5e1; 
}

.borde-azul { border-bottom-color: #1d4ed8; color: #1e3a8a; }
.borde-amarillo { border-bottom-color: #facc15; color: #1e293b; }

ul { 
  padding-left: 16px; 
  margin: 0; 
}

li { 
  margin-bottom: 8px; 
  font-size: 13.5px; 
}

.instrucciones { 
  color: #64748b; 
  font-size: 13px; 
  margin-bottom: 15px; 
  line-height: 1.4; 
}

/* SECCIÓN BLOQUE DRIVE */
.zona-enlaces { 
  display: flex; 
  flex-direction: column; 
  gap: 10px; 
}

.btn-drive-oficial { 
  display: block; 
  text-align: center; 
  background-color: #16a34a; 
  color: white; 
  padding: 14px; 
  border-radius: 6px; 
  font-weight: 700; 
  font-size: 14px; 
  text-decoration: none; 
  transition: background-color 0.2s; 
}

.btn-drive-oficial:hover { 
  background-color: #15803d; 
}


/* RECURSOS EXTRAS */
.lista-medicos { 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
}

.item-medico { 
  padding: 12px; 
  background-color: #f8fafc; 
  border-radius: 6px; 
  border-left: 4px solid #16a34a; 
}

.border-funda { border-left-color: #ea580c !important; }
.border-plat { border-left-color: #0d9488 !important; }

.medico-header { 
  display: flex; 
  justify-content: space-between; 
  font-weight: 700; 
  font-size: 13.5px; 
}

.link-externo { 
  color: #2563eb; 
  text-decoration: none; 
  font-weight: 700; 
}

.link-externo:hover { 
  text-decoration: underline; 
}

.medico-especialidad { 
  font-size: 12px; 
  color: #16a34a; 
  font-weight: 600; 
  margin: 2px 0; 
}

.medico-contacto { 
  font-size: 13px; 
  color: #2563eb; 
  font-weight: 600; 
}

.desc-funda { 
  font-size: 13px; 
  color: #475569; 
  margin: 4px 0 0 0; 
  line-height: 1.4; 
}

.autor-plat { 
  font-size: 11.5px; 
  color: #64748b; 
  font-style: italic; 
}

/* BARRA DE SCROLL DE LOS CENTROS */
.lista-centros { 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
  max-height: 350px; 
  overflow-y: auto; 
  padding-right: 4px; 
}

.lista-centros::-webkit-scrollbar { 
  width: 5px; 
}

.lista-centros::-webkit-scrollbar-track { 
  background: #f1f5f9; 
}

.lista-centros::-webkit-scrollbar-thumb { 
  background: #cbd5e1; 
  border-radius: 3px; 
}

.item-centro { 
  padding: 12px; 
  background-color: #f8fafc; 
  border-radius: 6px; 
  border-left: 4px solid #1d4ed8; 
  text-align: left; 
}

.centro-pais { 
  font-size: 13px; 
  font-weight: 700; 
  color: #64748b; 
}

.centro-link { 
  font-size: 14.5px; 
  color: #2563eb; 
  text-decoration: underline; 
  font-weight: 700; 
  display: inline-block; 
  padding: 2px 0; 
}

.centro-link:hover { 
  color: #1d4ed8; 
}

.centro-direccion { 
  font-size: 13px; 
  color: #334155; 
  margin-top: 1px; 
}

/* PIE DE PÁGINA */
.footer-sitio { 
  text-align: center; 
  background-color: #1e293b; 
  color: #f1f5f9; 
  padding: 25px 15px; 
  border-radius: 8px; 
  margin-top: 25px; 
  border-top: 4px solid #dc2626; 
}

.footer-sitio p { 
  margin: 4px 0; 
  font-size: 13.5px; 
}

.boton-email { 
  display: inline-block; 
  background-color: #dc2626; 
  color: white; 
  padding: 10px 20px; 
  border-radius: 6px; 
  font-weight: bold; 
  text-decoration: none; 
  margin-top: 10px; 
  font-size: 14px; 
}

.footer-nota { 
  margin-top: 15px; 
  padding-top: 12px; 
  border-top: 1px solid #334155; 
  font-size: 11px; 
  color: #94a3b8; 
}

/* starlink*/
/* ALERTA EN VIVO STARLINK */
.alerta-starlink {
  background-color: #fffbeb !important; /* Fondo amarillo/crema suave de advertencia */
  border: 2px solid #f59e0b !important; /* Borde naranja llamativo */
  box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.15);
}

.alerta-texto {
  font-size: 13.5px;
  line-height: 1.4;
  margin: 5px 0 10px 0;
  color: #78350f;
}

.datos-conexion {
  background-color: white;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #fef3c7;
  margin-bottom: 10px;
}

.datos-conexion p {
  margin: 4px 0;
  font-size: 13.5px;
  color: #1e293b;
}

.codigo-red {
  font-family: monospace;
  background-color: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  color: #b45309;
  font-size: 14px;
}

.referencia-movil {
  font-size: 12.5px;
  color: #92400e;
  margin: 0;
  line-height: 1.4;
}

/* ESTILOS DE CHATS VECINALES WHATSAPP */
.lista-chats-whatsapp {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 250px; /* Altura ideal compacta para no saturar la pantalla */
  overflow-y: auto;
  padding-right: 4px;
}

.lista-chats-whatsapp::-webkit-scrollbar { width: 5px; }
.lista-chats-whatsapp::-webkit-scrollbar-track { background: #f1f5f9; }
.lista-chats-whatsapp::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

.item-chat-vecinal {
  padding: 8px 10px;
  background-color: #f0fdf4; /* Fondo verde muy claro simulando WhatsApp */
  border-radius: 6px;
  border-left: 4px solid #16a34a;
  text-align: left;
}

.chat-link {
  font-size: 12.5px;
  color: #15803d;
  text-decoration: none;
  font-weight: 700;
  display: block;
  word-break: break-word;
}

.chat-link:hover {
  text-decoration: underline;
  color: #166534;
}

/* ESTILOS PRECISOS PARA DESCARGAS LOCALES */
.zona-descargas-locales {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-descarga-local {
  display: block;
  text-align: center;
  background-color: #1e3a8a; /* Azul Marino Institucional */
  color: white;
  padding: 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 13.5px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.btn-descarga-local:hover {
  background-color: #1d4ed8; /* Azul más brillante al pasar el ratón */
}


</style>