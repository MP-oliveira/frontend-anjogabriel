const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/AlunosController');
// const authMiddleware = require('../middlewares/authMiddleware');

router.get('/',  alunoController.getAllAlunos);
router.post('/create', alunoController.createAluno);

// Outras rotas (getAlunoById, updateAluno, deleteAluno)

module.exports = router;
