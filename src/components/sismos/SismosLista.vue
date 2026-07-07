<template>

<section class="lista panel">


    <div class="lista-header">

        <div>

            <h3>
                Últimos eventos
            </h3>

            <span>
                Actividad sísmica reciente
            </span>

        </div>


        <div class="contador">

            {{ sismos.length }} eventos

        </div>


    </div>




    <div class="tabla">


        <div
            v-for="(sismo,index) in sismos"
            :key="sismo.id"
            class="evento"
            :style="{animationDelay:index*0.08+'s'}"
        >


            <!-- MAGNITUD -->

            <div
                class="magnitud"
                :class="claseMagnitud(sismo.mag)"
            >

                M{{ sismo.mag.toFixed(1) }}

            </div>




            <!-- LUGAR -->

            <div class="ubicacion">


                <strong>

                    {{ sismo.lugar }}

                </strong>


                <span>
                    📍 {{ obtenerPais(sismo.lugar) }}
                </span>


            </div>





            <!-- PROFUNDIDAD -->

            <div class="profundidad">


                <span>
                    🌊
                </span>


                {{ sismo.profundidad || '--' }} km


            </div>





            <!-- TIEMPO -->

            <div class="tiempo">


                {{ sismo.tiempo }}


            </div>




        </div>


    </div>


</section>


</template>




<script setup>


defineProps({

    sismos:{

        type:Array,

        default:()=>[]

    }

})

function obtenerPais(lugar) {
  if (!lugar) return "Ubicación no disponible"

  if (
    lugar.includes("Venezuela") ||
    lugar.includes("Caracas") ||
    lugar.includes("La Guaira")
  ) {
    return "Venezuela"
  }

  if (
    lugar.includes("CA") ||
    lugar.includes("Alaska") ||
    lugar.includes("New Mexico")
  ) {
    return "Estados Unidos"
  }

  return "Ubicación internacional"
}

function claseMagnitud(mag){


    if(mag >= 6)

        return "rojo"



    if(mag >= 4)

        return "naranja"



    return "verde"


}



</script>




<style scoped>


.lista{

padding:24px;

}



.lista-header{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:20px;

}



h3{

margin:0;

font-size:18px;

color:#0f172a;

}



.lista-header span{

font-size:13px;

color:#64748b;

}



.contador{

background:#f1f5f9;

padding:8px 14px;

border-radius:20px;

font-size:13px;

font-weight:700;

color:#475569;

}




.tabla{

display:flex;

flex-direction:column;

gap:10px;

}





.evento{

display:grid;

grid-template-columns:90px 1fr 120px 100px;

align-items:center;

gap:15px;

padding:15px;

background:#f8fafc;

border:1px solid #e5e7eb;

border-radius:14px;

animation:entrada .4s ease forwards;

opacity:0;

}



@keyframes entrada{


from{

opacity:0;

transform:translateY(15px);

}


to{

opacity:1;

transform:translateY(0);

}


}






.magnitud{

color:white;

font-weight:900;

font-size:15px;

padding:8px;

text-align:center;

border-radius:8px;

width:70px;

}




.rojo{

background:#dc2626;

}



.naranja{

background:#f59e0b;

}



.verde{

background:#16a34a;

}





.ubicacion{

display:flex;

flex-direction:column;

gap:4px;

}



.ubicacion strong{

font-size:15px;

color:#0f172a;

}



.ubicacion span{

font-size:12px;

color:#64748b;

}





.profundidad{

font-size:14px;

color:#475569;

}




.tiempo{

text-align:right;

font-size:13px;

color:#64748b;

font-weight:600;

}




@media(max-width:800px){


.evento{

grid-template-columns:80px 1fr;

}


.profundidad,
.tiempo{

text-align:left;

}


}



@media(max-width:500px){


.evento{

grid-template-columns:1fr;

}


.magnitud{

width:100%;

}


}



</style>