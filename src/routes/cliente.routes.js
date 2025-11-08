const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/cliente.controller');
const authenticateToken = require('../middleware/auth');


router.get('/', authenticateToken, ClienteController.getClientes);
router.post('/', authenticateToken, ClienteController.createCliente);
router.delete('/:id', authenticateToken, ClienteController.deleteCliente);
router.put('/:id', authenticateToken, ClienteController.updateCliente);

module.exports = router;