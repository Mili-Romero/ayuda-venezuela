<template>

<section class="destacado panel">


    <!-- CABECERA DEL EVENTO -->

    <div class="evento-header">

        <div>

            <span class="label">
                ÚLTIMO EVENTO DETECTADO
            </span>

            <h2>
                {{ sismos.lugar }}
            </h2>

        </div>


        <div
            class="badge-magnitud"
            :class="nivelClase"
        >

            M {{ sismos.mag.toFixed(1) }}

        </div>


    </div>



    <!-- NIVEL -->

    <div class="nivel">

        <div class="nivel-texto">

            <span>
                Nivel de intensidad
            </span>

            <strong>
                {{ nivelTexto }}
            </strong>

        </div>


        <div class="barra">

            <div
                class="progreso"
                :class="nivelClase"
                :style="{width: porcentaje + '%'}"
            >

            </div>

        </div>


    </div>




    <!-- INFORMACION TECNICA -->

    <div class="datos">


        <div class="dato">

            <span>
                🌊 Profundidad
            </span>

            <strong>
                {{ sismos.profundidad }} km
            </strong>

        </div>



        <div class="dato">

            <span>
                🌎 Coordenadas
            </span>

            <strong>

                {{ sismos.lat.toFixed(2) }}°,
                {{ sismos.lon.toFixed(2) }}°

            </strong>

        </div>



        <div class="dato">

            <span>
                🕒 Hora
            </span>

            <strong>
                {{ sismos.hora }}
            </strong>

        </div>



        <div class="dato">

            <span>
                📡 Fuente
            </span>

            <strong>
                USGS
            </strong>

        </div>



    </div>



</section>

</template>


<script setup>

import { computed } from "vue"



const props = defineProps({

    sismos:{
        type:Object,
        required:true
    }

})



/*
 Clasificación del terremoto
*/

const nivelTexto = computed(()=>{


    const mag = props.sismos.mag


    if(mag >= 6)
        return "Fuerte"


    if(mag >= 4)
        return "Moderado"


    return "Menor"


})



const nivelClase = computed(()=>{


    const mag = props.sismos.mag


    if(mag >= 6)
        return "rojo"


    if(mag >= 4)
        return "naranja"


    return "verde"


})



/*
 Barra visual 0-100
*/

const porcentaje = computed(()=>{


    let valor =
    (props.sismos.mag / 8) * 100


    return Math.min(valor,100)


})



</script>



<style scoped>


.destacado{

padding:28px;

}



.evento-header{

display:flex;

justify-content:space-between;

align-items:center;

gap:20px;

}



.label{

font-size:12px;

letter-spacing:1px;

color:#64748b;

font-weight:700;

}



h2{

margin:8px 0 0;

font-size:22px;

color:#0f172a;

}



.badge-magnitud{

font-size:38px;

font-weight:900;

padding:15px 22px;

border-radius:16px;

color:white;

}



.naranja{

background:#f59e0b;

}


.rojo{

background:#dc2626;

}


.verde{

background:#16a34a;

}




.nivel{

margin-top:30px;

}



.nivel-texto{

display:flex;

justify-content:space-between;

margin-bottom:10px;

font-size:14px;

}



.nivel-texto span{

color:#64748b;

}


.nivel-texto strong{

color:#0f172a;

}




.barra{

height:12px;

background:#e5e7eb;

border-radius:20px;

overflow:hidden;

}



.progreso{

height:100%;

transition:.5s;

}




.datos{

display:grid;

grid-template-columns:repeat(4,1fr);

gap:15px;

margin-top:30px;

}



.dato{

background:#f8fafc;

padding:15px;

border-radius:12px;

border:1px solid #e5e7eb;

}



.dato span{

display:block;

font-size:12px;

color:#64748b;

margin-bottom:8px;

}



.dato strong{

font-size:15px;

color:#0f172a;

}




@media(max-width:900px){


.evento-header{

flex-direction:column;

align-items:flex-start;

}


.datos{

grid-template-columns:repeat(2,1fr);

}


}



@media(max-width:500px){


.datos{

grid-template-columns:1fr;

}


.badge-magnitud{

font-size:30px;

}


}



</style>