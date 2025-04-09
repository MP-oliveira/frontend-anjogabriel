const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/TransacoesFinanceirasController');
// const authMiddleware = require('../middlewares/authMiddleware');

// Rota para listar todas as transações
router.get('/', transacaoController.listarTransacoes);

// Rota para criar uma nova transação
router.post('/create', transacaoController.createTransacao);

// Rota para buscar transações por categoria
router.get('/categoria', transacaoController.getTransacoesByCategoria);

// Rota para buscar transações por data
router.get('/periodo', transacaoController.getTransacoesByData);

// Rota para gerar balanço mensal
router.get('/balanco', transacaoController.getBalancoMensal);

// Rota para buscar uma transação por ID
router.get('/:id', transacaoController.getTransacaoById);

// Rota para atualizar uma transação
router.put('/edit/:id', transacaoController.updateTransacao);

// Rota para deletar uma transação
router.delete('/:id', transacaoController.deleteTransacao);

// Rota para listar contas
router.get('/api/contas', transacaoController.listarContas);
router.get('/api/contas/:id', transacaoController.getContaById);

module.exports = router;