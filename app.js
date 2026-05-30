const escpos = require("escpos");
escpos.SerialPort = require("escpos-serialport");

const device = new escpos.SerialPort("COM3", {
    baudRate: 9600
});

const printer = new escpos.Printer(device);

device.open(() => {
    printer
        .align("ct")
        .text("=== PRUEBA H58B ===")
        .text("Hola desde COM3")
        .drawLine()
        .cut()
        .close();
});