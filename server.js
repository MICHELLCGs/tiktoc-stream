const express = require('express');
const dotenv = require('dotenv');
const videoRoutes = require('./routes/videoRoutes');
const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

// Configurar motor de vistas
app.set('view engine', 'ejs');
app.set('views', './views');

// Ruta para la página principal
app.get('/', (req, res) => {
  res.render('index', { message: 'Bienvenido al servicio de stream de videos.' });
});

// Middleware de rutas protegidas
app.use('/videos', videoRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
