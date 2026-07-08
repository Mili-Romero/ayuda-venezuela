<template>

<section class="stats panel">


    <!-- FUERTES -->

    <div class="stat-card rojo">

        <div class="icon">
            🔴
        </div>

        <div class="numero">
            {{ fuertes }}
        </div>

        <div class="texto">
            Fuertes
        </div>

    </div>



    <!-- MODERADOS -->

    <div class="stat-card naranja">

        <div class="icon">
            🟠
        </div>

        <div class="numero">
            {{ moderados }}
        </div>

        <div class="texto">
            Moderados
        </div>

    </div>




    <!-- MENORES -->

    <div class="stat-card verde">

        <div class="icon">
            🟢
        </div>

        <div class="numero">
            {{ menores }}
        </div>

        <div class="texto">
            Menores
        </div>

    </div>




    <!-- SISTEMA -->

    <div class="stat-card sistema">


        <div class="icon">
            📡
        </div>


        <div class="numero online">

            Sincronizado

        </div>


        <div class="texto">

            con USGS

        </div>


    </div>


</section>


</template>



<script setup>


defineProps({

    fuertes:{
        type:Number,
        default:0
    },


    moderados:{
        type:Number,
        default:0
    },


    menores:{
        type:Number,
        default:0
    }


})


</script>




<style scoped>


.stats{

display:grid;

grid-template-columns:repeat(4,1fr);

gap:18px;

padding:24px;

}




.stat-card{

background:#f8fafc;

border:1px solid #e5e7eb;

border-radius:16px;

padding:20px;

display:flex;

flex-direction:column;

align-items:center;

justify-content:center;

min-height:120px;

transition:.3s;

}



.stat-card:hover{

transform:translateY(-5px);

box-shadow:0 10px 25px rgba(0,0,0,.08);

}




.icon{

font-size:26px;

margin-bottom:8px;

}



.numero{

font-size:32px;

font-weight:900;

color:#0f172a;

line-height:1;

}



.texto{

margin-top:8px;

font-size:13px;

font-weight:600;

color:#64748b;

}



.rojo{

border-top:4px solid #dc2626;

}



.naranja{

border-top:4px solid #f59e0b;

}



.verde{

border-top:4px solid #16a34a;

}



.sistema{

border-top:4px solid #2563eb;

}



.online{

font-size:18px;

color:#2563eb;

}



@media(max-width:900px){


.stats{

grid-template-columns:repeat(2,1fr);

}


}



@media(max-width:500px){


.stats{

grid-template-columns:1fr;

}


}



</style>