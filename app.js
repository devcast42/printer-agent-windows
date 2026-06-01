const escpos = require("escpos");
escpos.SerialPort = require("escpos-serialport");
const { SerialPort } = require('serialport');

// Función auxiliar para imprimir un mensaje de buenos días en un puerto serial específico
function printBuenosDias(portName) {
    return new Promise((resolve, reject) => {
        let device;
        try {
            console.log(`[${portName}] Inicializando puerto...`);
            device = new escpos.SerialPort(portName, {
                baudRate: 9600,
                autoOpen: false
            });
        } catch (err) {
            return reject(new Error(`Error al inicializar el puerto: ${err.message}`));
        }

        const underlyingPort = device.device;
        if (!underlyingPort) {
            return reject(new Error("No se pudo obtener la instancia del puerto serial interno."));
        }

        // Manejar errores del puerto a nivel de socket/conexión
        const errorHandler = (err) => {
            reject(new Error(`Error en el dispositivo serial: ${err.message}`));
        };
        
        underlyingPort.once('error', errorHandler);

        console.log(`[${portName}] Intentando abrir el puerto...`);
        device.open((err) => {
            if (err) {
                // Remover el listener para no dejar colgado el proceso
                underlyingPort.removeListener('error', errorHandler);
                return reject(new Error(`No se pudo abrir el puerto: ${err.message}`));
            }

            console.log(`[${portName}] Puerto abierto con éxito. Enviando mensaje...`);
            try {
                const printer = new escpos.Printer(device);
                
                printer
                    .align("ct")
                    .text("=== PRUEBA H58B ===")
                    .text("Buenos dias")
                    .text(`Hola desde ${portName}`)
                    .drawLine()
                    .cut();

                console.log(`[${portName}] Mensaje enviado. Cerrando puerto...`);
                // Esperar a que se envíen todos los datos antes de cerrar
                device.close((closeErr) => {
                    underlyingPort.removeListener('error', errorHandler);
                    if (closeErr) {
                        console.warn(`[${portName}] Advertencia al cerrar el puerto:`, closeErr.message);
                    }
                    resolve();
                });
            } catch (printErr) {
                underlyingPort.removeListener('error', errorHandler);
                console.error(`[${portName}] Error al construir el printer o imprimir. Cerrando puerto forzadamente...`);
                device.close(() => {
                    reject(new Error(`Error durante la impresión: ${printErr.message}`));
                });
            }
        });
    });
}

// Función principal para listar y procesar todos los puertos
async function main() {
    console.log("Buscando puertos seriales activos...");
    try {
        const ports = await SerialPort.list();
        if (ports.length === 0) {
            console.log("No se encontraron puertos seriales activos.");
            return;
        }

        console.log(`Se encontraron ${ports.length} puertos seriales:`);
        ports.forEach(p => console.log(`- ${p.path} (${p.friendlyName || p.manufacturer || 'Desconocido'})`));
        console.log("-----------------------------------------");

        for (const port of ports) {
            const portName = port.path;
            console.log(`\nProcesando ${portName}...`);
            try {
                await printBuenosDias(portName);
                console.log(`[${portName}] ¡Mensaje de buenos días enviado correctamente!`);
            } catch (error) {
                console.error(`[${portName}] FAILED: ${error.message}`);
            }
        }
        
        console.log("\nProceso terminado para todos los puertos.");
    } catch (err) {
        console.error("Error al listar los puertos seriales:", err.message);
    }
}

main();
