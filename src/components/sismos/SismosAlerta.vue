<template>

<section
    class="alerta"
    :class="nivelAlerta"
>


    <div class="icono">

        🚨

    </div>



    <div class="contenido">


        <h3>

            {{ titulo }}

        </h3>


        <p>

            Se detectó un sismo de
            <strong>
                M {{ magnitud.toFixed(1) }}
            </strong>

            cerca de

            <strong>
                {{ lugar }}
            </strong>

        </p>



    </div>



    <div class="estado">

        {{ mensaje }}

    </div>


</section>


</template>



<script setup>


import { computed } from "vue"



const props = defineProps({

    magnitud:{

        type:Number,

        required:true

    },


    lugar:{

        type:String,

        default:"Zona desconocida"

    }


})





const nivelAlerta = computed(()=>{


    if(props.magnitud >= 6)

        return "critica"



    if(props.magnitud >= 5.5)

        return "alta"



    return "normal"


})






const titulo = computed(()=>{


    if(props.magnitud >= 6)

        return "ALERTA SÍSMICA FUERTE"



    if(props.magnitud >= 5.5)

        return "SISMO IMPORTANTE DETECTADO"



    return "Actividad sísmica"


})






const mensaje = computed(()=>{


    if(props.magnitud >= 6)

        return "Requiere atención inmediata"



    if(props.magnitud >= 5.5)

        return "Monitoreo activo"



    return "Actividad normal"



})



</script>




<style scoped>


.alerta{


display:flex;

align-items:center;

gap:18px;

padding:18px 24px;

margin:0 24px 20px;

border-radius:14px;

border:1px solid transparent;

animation:entrada .4s ease;

}



.icono{

font-size:32px;

}



.contenido{

flex:1;

}



h3{

margin:0 0 5px;

font-size:18px;

}



p{

margin:0;

font-size:14px;

}



.estado{

font-weight:700;

font-size:13px;

padding:8px 14px;

border-radius:20px;

}



.alta{


background:#fff7ed;

border-color:#fb923c;

color:#9a3412;

}



.alta .estado{

background:#f97316;

color:white;

}



.critica{


background:#fef2f2;

border-color:#ef4444;

color:#991b1b;

animation:alarma 1.2s infinite;

}



.critica .estado{

background:#dc2626;

color:white;

}



.normal{

display:none;

}





@keyframes alarma{


0%{

box-shadow:0 0 0 rgba(220,38,38,0);

}


50%{

box-shadow:0 0 25px rgba(220,38,38,.35);

}


100%{

box-shadow:0 0 0 rgba(220,38,38,0);

}


}



@keyframes entrada{


from{

opacity:0;

transform:translateY(-10px);

}


to{

opacity:1;

transform:translateY(0);

}


}



@media(max-width:700px){


.alerta{

flex-direction:column;

align-items:flex-start;

margin:0 15px 15px;

}


}

</style>