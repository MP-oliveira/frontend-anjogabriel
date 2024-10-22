const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/AlunosController');
// const authMiddleware = require('../middlewares/authMiddleware');

// Rota para listar todos os alunos
router.get('/alunos', alunoController.listAlunos);

// Rota para exibir a página de criação de aluno
router.get('/create', alunoController.create);

// Rota para criar um novo aluno
router.post('/create', alunoController.createAluno);

// Rota para buscar um aluno por ID
router.get('/aluno/:id', alunoController.getAlunoById);

// Rota para atualizar um aluno
router.put('/aluno/:id', alunoController.updateAluno);

// Rota para deletar um aluno
router.delete('/aluno/:id', alunoController.deleteAluno);

module.exports = router;
