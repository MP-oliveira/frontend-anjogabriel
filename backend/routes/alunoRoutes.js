const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/AlunosController');
const upload = require('../db/upload')
// const authMiddleware = require('../middlewares/authMiddleware');

// Rota para listar todos os alunos
router.get('/', alunoController.listAlunos);

// Rota para criar um novo aluno
router.post('/create', upload, alunoController.createAluno);

router.get('/search', alunoController.getAlunoByName);

// Rota para buscar um aluno por ID
router.get('/:id', alunoController.getAlunoById);

// Rota para atualizar um aluno
router.put('/edit/:id', alunoController.updateAluno);

// Rota para deletar um aluno
router.delete('/:id', alunoController.deleteAluno);

module.exports = router;
