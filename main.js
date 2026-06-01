const { app } = require('electron');
const { start } = require('./app');

app.whenReady().then(() => {
    app.setLoginItemSettings({
        openAtLogin: true
    });
    console.log("Aplicación lista. Iniciando proceso principal...");
    start();
}).catch(err => {
    console.error("Error al iniciar la aplicación:", err.message);
});