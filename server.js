const express = require('express');
const path = require('path');
const app = express();

// Ruta al directorio de salida de Angular
const appPath = path.join(__dirname, 'dist/onvert-theme');

// Servir los archivos estáticos de Angular
app.use(express.static(appPath));

// Todas las rutas deben redirigir al index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(appPath, 'index.html'));
});

// Escucha en el puerto definido por Heroku o el puerto 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
