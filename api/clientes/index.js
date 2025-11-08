const ClienteModel = require('../../src/models/cliente.model');

module.exports = async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const { page, limit } = req.query || {};
            if (page && limit) {
                const p = parseInt(page, 10) || 1;
                const l = parseInt(limit, 10) || 10;
                const data = await ClienteModel.getAll(p, l);
                return res.status(200).json({ rows: data.rows, total: data.total, page: p, limit: l });
            }
            const clientes = await ClienteModel.getAll();
            return res.status(200).json(clientes);
        }

        if (req.method === 'POST') {
            const { nombre, monto_pagado } = req.body;
            if (!nombre || String(nombre).trim() === '') {
                return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
            }
            const monto = parseFloat(monto_pagado);
            if (isNaN(monto) || monto < 0) {
                return res.status(400).json({ error: 'El campo "monto_pagado" debe ser un número mayor o igual a 0' });
            }
            const nuevo = await ClienteModel.create(req.body);
            return res.status(201).json(nuevo);
        }

        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
