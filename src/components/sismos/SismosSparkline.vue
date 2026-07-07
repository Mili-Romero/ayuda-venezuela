<template>

<section class="sparkline panel">


    <div class="spark-header">

        <div>

            <h3>
                Actividad sísmica
            </h3>

            <span>
                Últimas 24 horas
            </span>

        </div>


        <div class="contador">

            {{ totalEventos }} eventos

        </div>


    </div>



    <div class="grafico">


        <svg
            viewBox="0 0 500 120"
            preserveAspectRatio="none"
        >


            <!-- Área inferior -->

            <defs>

                <linearGradient
                    id="relleno"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                >

                    <stop
                        offset="0%"
                        stop-color="#2563eb"
                        stop-opacity=".35"
                    />

                    <stop
                        offset="100%"
                        stop-color="#2563eb"
                        stop-opacity="0"
                    />

                </linearGradient>


            </defs>



            <polygon

                :points="area"

                fill="url(#relleno)"

            />



            <!-- Línea -->

            <polyline

                :points="linea"

                fill="none"

                stroke="#2563eb"

                stroke-width="4"

                stroke-linecap="round"

                stroke-linejoin="round"

            />



            <!-- puntos -->

            <circle

                v-for="(p,index) in puntos"

                :key="index"

                :cx="p.x"

                :cy="p.y"

                r="4"

                fill="#2563eb"

            />



        </svg>


    </div>




    <div class="horas">


        <span>
            00h
        </span>


        <span>
            06h
        </span>


        <span>
            12h
        </span>


        <span>
            18h
        </span>


        <span>
            Ahora
        </span>


    </div>


</section>

</template>



<script setup>


import { computed } from "vue"



const props = defineProps({

    datos:{

        type:Array,

        default:()=>[]

    }

})





const puntos = computed(()=>{


    const valores = props.datos.length
        ? props.datos
        : [5,8,6,10,12,15,18,22,17,12,8,10]


    const max = Math.max(...valores)



    return valores.map((valor,index)=>{


        const x =
        (index/(valores.length-1))*500


        const y =
        100 - ((valor/max)*80)


        return {

            x,

            y

        }


    })


})





const linea = computed(()=>{


    return puntos.value

    .map(p=>`${p.x},${p.y}`)

    .join(" ")


})





const area = computed(()=>{


    return [

        "0,120",

        linea.value,

        "500,120"

    ].join(" ")


})





const totalEventos = computed(()=>{


    return props.datos.reduce(

        (a,b)=>a+b,

        0

    )


})



</script>





<style scoped>


.sparkline{

padding:24px;

}



.spark-header{

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



.spark-header span{

font-size:13px;

color:#64748b;

}



.contador{

background:#eff6ff;

color:#2563eb;

padding:8px 14px;

border-radius:20px;

font-size:13px;

font-weight:700;

}



.grafico{

height:160px;

background:#f8fafc;

border-radius:14px;

padding:15px;

border:1px solid #e5e7eb;

}



svg{

width:100%;

height:100%;

}





.horas{

display:flex;

justify-content:space-between;

margin-top:12px;

font-size:12px;

color:#94a3b8;

}



@media(max-width:600px){


.grafico{

height:120px;

}


}

</style>