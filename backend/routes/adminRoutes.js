const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

// Rota para listar todos os professores
router.get('/', adminController.listAdmins);

// Rota para criar um novo professor
router.post('/create', adminController.createAdmin);

// Rota para buscar um professor por ID
router.get('/:id', adminController.getAdminById);

// Rota para atualizar um professor
router.put('/edit/:id', adminController.updateAdmin);

// Rota para deletar um professor
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
