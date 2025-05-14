const express = require('express');
const router = express.Router();
const PagamentoController = require('../controllers/PagamentoController');

// Criar um novo pagamento
router.post('/', PagamentoController.create);

// Buscar pagamentos por aluno
router.get('/aluno/:aluno_id', PagamentoController.getByAluno);

// Buscar pagamentos por período
router.get('/periodo', PagamentoController.getByPeriod);

// Buscar todos os pagamentos
router.get('/', PagamentoController.getAll);

module.exports = router; 