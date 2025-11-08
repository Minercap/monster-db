const pool = require('../config/database');

class ClienteModel {
    static async getAll() {
        // Backwards-compatible: allow optional pagination parameters
        // Signature: getAll(page, limit) -> when page and limit provided returns { rows, total }
        try {
            if (arguments.length === 2) {
                const page = arguments[0];
                const limit = arguments[1];
                const offset = (page - 1) * limit;
                // total count
                const countResult = await pool.query('SELECT COUNT(*) FROM clientes');
                const total = parseInt(countResult.rows[0].count, 10);
                const result = await pool.query(
                    'SELECT * FROM clientes ORDER BY fecha_creacion DESC LIMIT $1 OFFSET $2',
                    [limit, offset]
                );
                return { rows: result.rows, total };
            }

            const result = await pool.query('SELECT * FROM clientes ORDER BY fecha_creacion DESC');
            return result.rows;
        } catch (err) {
            throw new Error(`Error al obtener clientes: ${err.message}`);
        }
    }

    static async create(clienteData) {
        const { optimizador, nombre, usuario_discord, telefono, monto_pagado, descripcion_trabajo, notas } = clienteData;
        try {
            const result = await pool.query(
                'INSERT INTO clientes (optimizador, nombre, usuario_discord, telefono, monto_pagado, descripcion_trabajo, notas) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [optimizador, nombre, usuario_discord, telefono, monto_pagado, descripcion_trabajo, notas]
            );
            return result.rows[0];
        } catch (err) {
            throw new Error(`Error al crear cliente: ${err.message}`);
        }
    }

    static async delete(id) {
        try {
            await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
        } catch (err) {
            throw new Error(`Error al borrar cliente: ${err.message}`);
        }
    }

    static async update(id, clienteData) {
        const { optimizador, nombre, usuario_discord, telefono, monto_pagado, descripcion_trabajo, notas } = clienteData;
        try {
            const result = await pool.query(
                'UPDATE clientes SET optimizador = $1, nombre = $2, usuario_discord = $3, telefono = $4, monto_pagado = $5, descripcion_trabajo = $6, notas = $7 WHERE id = $8 RETURNING *',
                [optimizador, nombre, usuario_discord, telefono, monto_pagado, descripcion_trabajo, notas, id]
            );
            if (result.rows.length === 0) {
                throw new Error('No existe un cliente con ese ID o no se pudo actualizar');
            }
            return result.rows[0];
        } catch (err) {
            throw new Error(`Error al actualizar cliente: ${err.message}`);
        }
    }
}

module.exports = ClienteModel;