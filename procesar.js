import fs from 'node:fs';
import path from 'node:path';
import PDFParser from 'pdf2json';

const carpetaDocumentos = './documentos';
const rutaJsonMaestro = './src/pacientes.json';

console.log("⏳ Iniciando Extractor Nativo de Alta Fidelidad por Casillas...");

try {
    const archivos = fs.readdirSync(carpetaDocumentos).filter(file => file.endsWith('.pdf'));

    if (archivos.length === 0) {
        console.log("❌ Error: No encontré ningún archivo .pdf dentro de la carpeta './documentos'.");
        process.exit(1);
    }

    const pacientesProcesados = [];
    const listaIgnoradosTexto = [];
    const cedulasRegistradas = new Set();

    const procesarTodosLosArchivos = async () => {
        for (const archivo of archivos) {
            const rutaCompleta = path.join(carpetaDocumentos, archivo);
            console.log(`📄 Indexando filas individuales de: ${archivo}...`);

            const pdfParser = new PDFParser();

            const cargarPDF = () => {
                return new Promise((resolve, reject) => {
                    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
                    pdfParser.on("pdfParser_dataReady", pdfData => resolve(pdfData));
                    pdfParser.loadPDF(rutaCompleta);
                });
            };

            try {
                const data = await cargarPDF();

                data.Pages.forEach((pagina, indicePagina) => {
                    const filasMap = {};

                    // Agrupamos el texto por su coordenada vertical exacta
                    pagina.Texts.forEach(item => {
                        const textoDecodificado = decodeURIComponent(item.R[0].T).trim();
                        if (!textoDecodificado) return;

                        // Redondeamos la coordenada Y para alinear las palabras de la misma línea
                        const y = Math.round(item.Y * 2) / 2; 
                        if (!filasMap[y]) filasMap[y] = [];
                        filasMap[y].push({ x: item.X, text: textoDecodificado });
                    });

                    const filasOrdenadasY = Object.keys(filasMap).sort((a, b) => Number(a) - Number(b));

                    filasOrdenadasY.forEach(y => {
                        const celdas = filasMap[y].sort((a, b) => a.x - b.x);
                        
                        // Juntamos el texto completo para detectar metadatos de control
                        const lineaTextoCompleto = celdas.map(c => c.text).join(" ");
                        const textoUpper = lineaTextoCompleto.toUpperCase();

                        if (textoUpper.includes("APELLIDOS") || textoUpper.includes("REGISTRO MAESTRO") || celdas.length < 2) {
                            return;
                        }

                        // Inicializamos los campos con guiones limpios
                        let apellidosLista = [];
                        let nombresLista = [];
                        let cedula = "—";
                        let edad = "—";
                        let sexo = "—";
                        let procedencia = "—";
                        let hospital = "Hospital no especificado";

                        // Recorremos las celdas usando su posición horizontal (X) nativa del PDF
                        celdas.forEach(celda => {
                            const txt = celda.text.trim();
                            const x = celda.x;

                            // Filtramos números correlativos sueltos de la primera columna
                            if (x < 3 && /^\d+$/.test(txt)) return;

                            // Clasificación estricta por coordenadas de columna
                            if (x >= 2 && x < 12) {
                                if (!txt.toUpperCase().includes("HOSPITAL")) apellidosLista.push(txt);
                            } 
                            else if (x >= 12 && x < 24) {
                                if (!txt.toUpperCase().includes("HOSPITAL")) nombresLista.push(txt);
                            } 
                            else if (x >= 24 && x < 34) {
                                if (/\d+/.test(txt) || txt.toUpperCase().includes("MENOR")) {
                                    cedula = txt.replace(')', '').trim();
                                }
                            } 
                            else if (x >= 34 && x < 40) {
                                if (/^\d+$/.test(txt)) edad = txt;
                            } 
                            else if (x >= 40 && x < 45) {
                                if (txt === "F" || txt === "M") sexo = txt;
                            } 
                            else if (x >= 45 && x < 60) {
                                if (txt !== "NONE" && txt !== "—") procedencia = txt;
                            }
                        });

                        // Unificamos las palabras capturadas en cadenas de texto limpias
                        const apellidoFinal = apellidosLista.join(" ").trim();
                        const nombreFinal = nombresLista.join(" ").trim();

                        // Si la fila no tiene apellido válido o es ruido visual, la saltamos
                        if (!apellidoFinal || apellidoFinal === "—" || /^\d+$/.test(apellidoFinal)) return;

                        // Asignación precisa del hospital evaluando la línea completa
                        if (textoUpper.includes("UNIVERSITARIO")) hospital = "Hospital Universitario de Caracas";
                        else if (textoUpper.includes("LUCIANI")) hospital = "Hospital Domingo Luciani (El Llanito)";
                        else if (textoUpper.includes("PEREZ CARREÑO") || textoUpper.includes("PÉREZ CARREÑO")) hospital = "Hospital Pérez Carreño";
                        else if (textoUpper.includes("CRUZ ROJA")) hospital = "Cruz Roja Venezolana";
                        else if (textoUpper.includes("CATIA") || textoUpper.includes("PERIFÉRICO")) hospital = "Hospital Periférico de Catia";
                        else if (textoUpper.includes("VARGAS")) hospital = "Hospital Vargas de Caracas";
                        else if (textoUpper.includes("RICARDO BAQUERO") || textoUpper.includes("BAQUERO")) hospital = "Hospital Ricardo Baquero González";

                        const registroFinal = {
                            apellidos: apellidoFinal.toUpperCase(),
                            nombres: nombreFinal.toUpperCase(),
                            ci: cedula,
                            edad: edad,
                            sexo: sexo,
                            procedencia: procedencia.toUpperCase(),
                            hospital: hospital,
                            fecha: '25/6/26'
                        };

                        // Candado antiduplicados estricto por número de identidad
                        if (cedula !== "—" && !cedula.toUpperCase().includes("MENOR")) {
                            const claveCI = cedula.replace(/\./g, '').trim();
                            if (!cedulasRegistradas.has(claveCI)) {
                                cedulasRegistradas.add(claveCI);
                                pacientesProcesados.push(registroFinal);
                            } else {
                                listaIgnoradosTexto.push(`- CÉDULA REPETIDA: ${registroFinal.apellidos} ${registroFinal.nombres} (CI: ${cedula})`);
                            }
                        } else {
                            // Si no hay cédula, validamos por nombre y hospital para evitar duplicar filas
                            const yaExiste = pacientesProcesados.some(p => p.apellidos === registroFinal.apellidos && p.nombres === registroFinal.nombres && p.hospital === registroFinal.hospital);
                            if (!yaExiste) {
                                pacientesProcesados.push(registroFinal);
                            } else {
                                listaIgnoradosTexto.push(`- REGISTRO REPETIDO: ${registroFinal.apellidos} ${registroFinal.nombres} [En: ${hospital}]`);
                            }
                        }
                    });
                });

            } catch (errorAnálisis) {
                console.error(`❌ Error analizando las celdas del archivo:`, errorAnálisis);
            }
        }

        // Guardamos los datos reales unificados de forma impecable
        fs.writeFileSync(rutaJsonMaestro, JSON.stringify(pacientesProcesados, null, 2), 'utf-8');
        fs.writeFileSync('./ignorados.txt', listaIgnoradosTexto.join('\n'), 'utf-8');

        console.log(`\n✅ ¡PROCESAMIENTO MASIVO NATIVO COMPLETADO!`);
        console.log(`🚀 Total de pacientes individuales guardados limpiamente: ${pacientesProcesados.length}`);
        console.log(`🛡️ Duplicados reales filtrados por seguridad: ${listaIgnoradosTexto.length}`);
    };

    await procesarTodosLosArchivos();

} catch (error) {
    console.error("❌ Error en el proceso general:", error);
}
