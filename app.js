// prueba-h58b.js
const { ThermalPrinter, PrinterTypes } = require("node-thermal-printer");

async function testPrinter() {
    // Configura la impresora
    let printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,    // usa EPSON para ESC/POS
        interface: "printer:auto"    // Windows maneja la H58B Bluetooth
    });

    try {
        // Verifica si la impresora está conectada
        const isConnected = await printer.isPrinterConnected();
        console.log("¿Impresora conectada?", isConnected);

        if (!isConnected) {
            console.log("Revisa que la H58B esté emparejada y encendida.");
            return;
        }

        // Imprime algo de prueba
        printer.alignCenter();
        printer.println("=== PRUEBA H58B ===");
        printer.println("¡Hola, impresora!");
        printer.drawLine();
        printer.cut();

        await printer.execute();
        console.log("Texto de prueba enviado ✅");

    } catch (err) {
        console.error("Error al conectar o imprimir:", err);
    }
}

// Ejecuta la prueba
testPrinter();