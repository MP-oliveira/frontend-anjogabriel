const { Financial, BankAccount, Bill } = require('../models'); // Ajuste conforme necessário

module.exports = class FinancialController {
  static async listTransactions(req, res) {
    try {
      const transactions = await Financial.findAll();
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar transações financeiras' });
    }
  }

  static async createTransaction(req, res) {
    const { type, amount, description, category, date, account_id } = req.body;

    try {
      const transaction = await Financial.create({
        type,
        amount,
        description,
        category,
        date,
        account_id,
      });
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar transação financeira' });
    }
  }

  static async listAccounts(req, res) {
    try {
      const accounts = await BankAccount.findAll();
      res.status(200).json(accounts);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar contas' });
    }
  }

  static async createAccount(req, res) {
    const { name, account_number, current_balance } = req.body;

    try {
      const account = await BankAccount.create({
        name,
        account_number,
        current_balance,
      });
      res.status(201).json(account);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar conta' });
    }
  }

  static async listBills(req, res) {
    try {
      const bills = await Bill.findAll();
      res.status(200).json(bills);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar boletos' });
    }
  }

  static async createBill(req, res) {
    const { description, amount, due_date, payment_status, category } = req.body;

    try {
      const bill = await Bill.create({
        description,
        amount,
        due_date,
        payment_status,
        category,
      });
      res.status(201).json(bill);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar boleto' });
    }
  }
}; 