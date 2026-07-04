<template>
  <div class="tarjeta tarjeta-infantil">
    <h2 class="titulo-seccion borde-amarillo">
      🧸 Un libro para ayudar a losniños a comprender lo ocurrido
    </h2>

    <p class="descripcion">
      Después de una emergencia, muchos niños pueden sentir miedo,
      tristeza o tener preguntas difíciles de responder.
    </p>

    <p class="descripcion">
      Este libro ilustrado, elaborado por la editorial independiente
      <strong>Ate con Queso</strong>, ofrece palabras sencillas para ayudar a
      madres, padres y cuidadores a conversar con las infancias sobre lo
      ocurrido.
    </p>

    <p class="descripcion">
      Su autora ha puesto este material a disposición del público de forma
      gratuita para que pueda ser utilizado por las familias y comunidades que
      lo necesiten.
    </p>

    <a
      href="https://cdn.shopify.com/s/files/1/0679/0332/4411/files/PALABRAS_CARTA-2_compressed.pdf?v=1783097491"
      target="_blank"
      rel="noopener noreferrer"
      class="btn-libro"
    >
      📚 Leer el libro gratuito
    </a>

    <p class="nota">
      💙 Recurso compartido con fines de apoyo emocional para las familias
      afectadas.
    </p>
  </div>
</template>

<script setup>
// Este componente es informativo y no requiere lógica.
</script>

<style scoped>

.tarjeta-infantil{
    margin-bottom:20px;
}

.descripcion{
    font-size:14px;
    line-height:1.7;
    color:#475569;
    margin-bottom:14px;
}

.btn-libro{

    display:block;
    width:100%;
    box-sizing:border-box;

    text-align:center;

    background:#2563eb;
    color:white;

    text-decoration:none;

    padding:16px;

    border-radius:8px;

    font-size:15px;
    font-weight:700;

    transition:.25s;
}

.btn-libro:hover{

    background:#1d4ed8;

}

.nota{

    margin-top:15px;

    font-size:12px;

    color:#64748b;

    text-align:center;

    font-style:italic;

}

</style>