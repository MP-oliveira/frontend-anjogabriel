const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/AlunosController');
// const authMiddleware = require('../middlewares/authMiddleware');

router.get('/create',  alunoController.create);
router.post('/create', alunoController.createAluno);

// Outras rotas (getAlunoById, updateAluno, deleteAluno)

module.exports = router;
