const ClienteModel = require('../models/cliente.model');

class ClienteController {
    static async getClientes(req, res) {
        try {
            const { page, limit } = req.query;
            if (page && limit) {
                const p = parseInt(page, 10) || 1;
                const l = parseInt(limit, 10) || 10;
                const data = await ClienteModel.getAll(p, l);
                return res.json({ rows: data.rows, total: data.total, page: p, limit: l });
            }

            const clientes = await ClienteModel.getAll();
            res.json(clientes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async createCliente(req, res) {
        try {
            const { nombre, monto_pagado } = req.body;
            if (!nombre || String(nombre).trim() === '') {
                return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
            }
            const monto = parseFloat(monto_pagado);
            if (isNaN(monto) || monto < 0) {
                return res.status(400).json({ error: 'El campo "monto_pagado" debe ser un número mayor o igual a 0' });
            }
            const nuevoCliente = await ClienteModel.create(req.body);
            res.json(nuevoCliente);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async deleteCliente(req, res) {
        try {
            const id = req.params.id;
            await ClienteModel.delete(id);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async updateCliente(req, res) {
        try {
            const id = req.params.id;
            const { nombre, monto_pagado } = req.body;
            if (!nombre || String(nombre).trim() === '') {
                return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
            }
            const monto = parseFloat(monto_pagado);
            if (isNaN(monto) || monto < 0) {
                return res.status(400).json({ error: 'El campo "monto_pagado" debe ser un número mayor o igual a 0' });
            }
            const updatedCliente = await ClienteModel.update(id, req.body);
            res.json(updatedCliente);
        } catch (err) {
            console.error('Error al editar cliente:', err);
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = ClienteController;