const express = require('express');
const router = express.Router();
const FinancialController = require('../controllers/FinancialController');

// Rotas para transações financeiras
router.get('/transactions', FinancialController.listTransactions);
router.post('/transactions', FinancialController.createTransaction);

// Rotas para contas
router.get('/accounts', FinancialController.listAccounts);
router.post('/accounts', FinancialController.createAccount);

// Rotas para boletos
router.get('/bills', FinancialController.listBills);
router.post('/bills', FinancialController.createBill);

module.exports = router; 