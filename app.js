const escpos = require("escpos");
escpos.SerialPort = require("escpos-serialport");
const { SerialPort } = require('serialport');

// Función auxiliar para imprimir un mensaje de buenos días en un puerto serial específico
function printGoodMorning(portName) {
    console.log(`[${portName}] Inicializando puerto...`);
    const device = new escpos.SerialPort(portName, {
        baudRate: 9600,
        autoOpen: false
    });
    
    const printer = new escpos.Printer(device);
      
    console.log(`[${portName}] Intentando abrir el puerto...`);
    device.open(() => {
        printer
            .align("ct")
            .text("=== PRUEBA H58B ===")
            .text("Buenos dias")
            .text(`Hola desde ${portName}`)
            .drawLine()
            .cut()
            .close()
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
                await printGoodMorning(portName);
                console.log(`[${portName}] ¡Mensaje de buenos días enviado correctamente!`);
            } catch (error) {
                console.error(`[${portName}] FAILED: ${error.message}`);
            }
        }
        
        console.log("\nProceso terminado para todos los puertos.");
        return
    } catch (err) {
        console.error("Error al listar los puertos seriales:", err.message);
    }
}

main()