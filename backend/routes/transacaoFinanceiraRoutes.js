const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/TransacaoFinanceira');
// const authMiddleware = require('../middlewares/authMiddleware');

// Rotas para contas bancárias
router.get('/contas', transacaoController.listarContas);
router.get('/contas/:id', transacaoController.getContaById);
router.post('/contas', transacaoController.createConta);

// Rotas para transações
router.get('/', transacaoController.listarTransacoes);
router.post('/create', transacaoController.createTransacao);
router.get('/categoria', transacaoController.getTransacoesByCategoria);
router.get('/periodo', transacaoController.getTransacoesByData);
router.get('/balanco', transacaoController.getBalancoMensal);
router.get('/:id', transacaoController.getTransacaoById);
router.put('/edit/:id', transacaoController.updateTransacao);
router.delete('/:id', transacaoController.deleteTransacao);

module.exports = router;