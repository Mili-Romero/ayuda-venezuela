<template>
  <header class="header panel">

    <div class="header-left">

      <div class="icono">
        🌎
      </div>

      <div>

        <h1 class="titulo">
          ACTIVIDAD SÍSMICA EN TIEMPO REAL
        </h1>

        <div class="estado">

          <span
            class="estado-api"
            :class="online ? 'online' : 'offline'"
          >
            <span class="punto"></span>

            {{ online ? 'USGS Sincronizado' : 'Reconectando...' }}

          </span>

          <span class="actualizado">

            Actualizado {{ ultimaActualizacion }}

          </span>

        </div>

      </div>

    </div>

    <div class="header-right">

      <div class="live">

        EN VIVO

      </div>

    </div>

  </header>
</template>

<script setup>

defineProps({

  online: Boolean,

  ultimaActualizacion: String

})

</script>

<style scoped>

.header{

display:flex;

justify-content:space-between;

align-items:center;

background:linear-gradient(135deg,#0f172a,#1e3a8a);

color:white;

padding:28px;

}

.header-left{

display:flex;

align-items:center;

gap:18px;

}

.icono{

width:64px;

height:64px;

display:flex;

align-items:center;

justify-content:center;

font-size:34px;

border-radius:18px;

background:rgba(255,255,255,.08);

backdrop-filter:blur(10px);

}

.titulo{

font-size:26px;

font-weight:800;

letter-spacing:.5px;

margin:0;

}

.estado{

margin-top:10px;

display:flex;

gap:18px;

align-items:center;

flex-wrap:wrap;

}

.estado-api{

display:flex;

align-items:center;

gap:8px;

font-size:14px;

font-weight:600;

}

.punto{

width:10px;

height:10px;

border-radius:50%;

display:block;

}

.online .punto{

background:#22c55e;

box-shadow:0 0 12px #22c55e;

animation:latido 1.4s infinite;

}

.offline .punto{

background:#ef4444;

}

.actualizado{

font-size:13px;

opacity:.85;

}

.header-right{

display:flex;

align-items:center;

}

.live{

padding:10px 18px;

border-radius:50px;

background:#dc2626;

font-weight:700;

font-size:13px;

letter-spacing:1px;

animation:pulse 1.5s infinite;

}

@keyframes pulse{

0%{

transform:scale(1);

}

50%{

transform:scale(1.05);

}

100%{

transform:scale(1);

}

}

@keyframes latido{

0%{

transform:scale(.9);

opacity:1;

}

50%{

transform:scale(1.4);

opacity:.5;

}

100%{

transform:scale(.9);

opacity:1;

}

}

@media(max-width:900px){

.header{

flex-direction:column;

align-items:flex-start;

gap:20px;

}

.titulo{

font-size:20px;

}

.icono{

width:54px;

height:54px;

font-size:28px;

}

}

</style>