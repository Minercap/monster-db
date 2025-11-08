-- Crear la tabla de clientes si no existe
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario_discord VARCHAR(100),
    telefono VARCHAR(20),
    monto_pagado DECIMAL(10,2),
    descripcion_trabajo TEXT,
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario_discord VARCHAR(100),
    telefono VARCHAR(20),
    monto_pagado DECIMAL(10,2),
    descripcion_trabajo TEXT,
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);