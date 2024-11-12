const express = require('express');
const router = express.Router();
const professorController = require('../controllers/ProfessoresController');

// Rota para listar todos os professores
router.get('/', professorController.listProfessores);

// Rota para criar um novo professor
router.post('/create', professorController.createProfessor);

// Rota para buscar um professor por ID
router.get('/:id', professorController.getProfessorById);

// Rota para atualizar um professor
router.put('/edit/:id', professorController.updateProfessor);

// Rota para deletar um professor
router.delete('/:id', professorController.deleteProfessor);

module.exports = router;
