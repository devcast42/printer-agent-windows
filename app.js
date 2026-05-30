const { ThermalPrinter, PrinterTypes } = require("node-thermal-printer");

// Cambia "printer:auto" por el nombre exacto de tu impresora si quieres
let printer = new ThermalPrinter({
    type: PrinterTypes.CUSTOM,
    interface: "printer:auto", // usa la impresora instalada en Windows (Bluetooth/USB)
});

async function printOrder(order) {
    printer.alignCenter();
    printer.println("NUEVO PEDIDO");
    printer.drawLine();

    printer.alignLeft();
    printer.println(`Mesa: ${order.mesa}`);

    order.items.forEach(item => {
        printer.println(`${item.cantidad}x ${item.nombre}`);
    });

    printer.drawLine();
    printer.cut();

    try {
        const isConnected = await printer.isPrinterConnected();
        console.log("Printer conectada:", isConnected);

        await printer.execute();
        console.log("Impreso correctamente");
    } catch (err) {
        console.error("Error imprimiendo:", err);
    }
}

// SOCKET.IO - Igual que antes
const { io } = require("socket.io-client");

const socket = io("https://tu-backend.com", {
    auth: {
        token: "TOKEN_DEL_RESTAURANTE"
    }
});

socket.on("connect", () => {
    console.log("Print Agent conectado");
});

socket.on("new_order", async (order) => {
    console.log("Pedido recibido:", order);
    await printOrder(order);
});

socket.on("disconnect", () => {
    console.log("Desconectado, reconectando...");
});

// TEST MANUAL
const testOrder = {
    mesa: 5,
    items: [
        { cantidad: 2, nombre: "Ceviche mixto" },
        { cantidad: 1, nombre: "Chicha morada" }
    ]
};

printOrder(testOrder);