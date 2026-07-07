import { ref } from "vue"


export function useSismos(){


    const sismos = ref([])

    const cargando = ref(false)

    const error = ref(null)

    const ultimaActualizacion = ref("")


    async function obtenerSismos(){


        try {


            cargando.value = true


            error.value = null



            const url =
            "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=20&orderby=time"



            const respuesta =
            await fetch(url)



            const datos =
            await respuesta.json()



            sismos.value =
            datos.features.map(item=>{


                const propiedades =
                item.properties


                const coordenadas =
                item.geometry.coordinates



                return {


                    id:item.id,


                    mag:
                    propiedades.mag || 0,



                    lugar:
                    propiedades.place || "Ubicación desconocida",



                    profundidad:
                    coordenadas[2],



                    lon:
                    coordenadas[0],



                    lat:
                    coordenadas[1],



                    hora:
                    new Date(
                        propiedades.time
                    ).toLocaleTimeString(),



                    tiempo:
                    tiempoDesde(
                        propiedades.time
                    )



                }


            })



            ultimaActualizacion.value =
            "Hace unos segundos"



        }

        catch(e){


            error.value =
            "Error conectando con USGS"



        }

        finally{


            cargando.value=false


        }


    }




    function tiempoDesde(fecha){


        const minutos =
        Math.floor(
            (Date.now()-fecha)
            /
            60000
        )



        if(minutos < 1)

            return "Ahora"



        if(minutos < 60)

            return `Hace ${minutos} min`



        const horas =
        Math.floor(minutos/60)



        return `Hace ${horas} h`


    }





    return {

        sismos,

        cargando,

        error,

        ultimaActualizacion,

        obtenerSismos


    }


}