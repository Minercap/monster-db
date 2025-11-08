const ClienteModel = require('../../src/models/cliente.model');

module.exports = async function handler(req, res) {
    const { id } = req.query;
    try {
        if (req.method === 'PUT') {
            const { nombre, monto_pagado } = req.body;
            if (!nombre || String(nombre).trim() === '') {
                return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
            }
            const monto = parseFloat(monto_pagado);
            if (isNaN(monto) || monto < 0) {
                return res.status(400).json({ error: 'El campo "monto_pagado" debe ser un número mayor o igual a 0' });
            }
            const updated = await ClienteModel.update(id, req.body);
            return res.status(200).json(updated);
        }

        if (req.method === 'DELETE') {
            await ClienteModel.delete(id);
            return res.status(200).json({ success: true });
        }

        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
