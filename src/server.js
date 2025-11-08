const express = require('express');
const cors = require('cors');
const clientesRoutes = require('./routes/cliente.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
const port = 3000;

const path = require('path');

// Middleware
app.use(cors({ exposedHeaders: ['Authorization'] }));
app.use(express.json());
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// debug route removed

// Routes
app.use('/clientes', clientesRoutes);
app.use('/auth', authRoutes);

// Start server
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});