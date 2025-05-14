const express = require('express');
const router = express.Router();
const { ContaBancaria } = require('../models/transicaoFinanceira');

// Listar todas as contas
router.get('/', async (req, res) => {
  try {
    const contas = await ContaBancaria.findAll({
      order: [['nome', 'ASC']]
    });
    res.json(contas);
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    res.status(500).json({ error: 'Erro ao buscar contas' });
  }
});

// Buscar conta por ID
router.get('/:id', async (req, res) => {
  try {
    const conta = await ContaBancaria.findByPk(req.params.id);
    if (!conta) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }
    res.json(conta);
  } catch (error) {
    console.error('Erro ao buscar conta:', error);
    res.status(500).json({ error: 'Erro ao buscar conta' });
  }
});

// Criar nova conta
router.post('/', async (req, res) => {
  try {
    const { nome, numero_conta, saldo_atual } = req.body;
    
    if (!nome) {
      return res.status(400).json({ error: 'Nome da conta é obrigatório' });
    }

    const conta = await ContaBancaria.create({
      nome,
      numero_conta,
      saldo_atual: saldo_atual || 0
    });

    res.status(201).json(conta);
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

// Atualizar conta
router.put('/:id', async (req, res) => {
  try {
    const { nome, numero_conta, saldo_atual } = req.body;
    const conta = await ContaBancaria.findByPk(req.params.id);

    if (!conta) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    await conta.update({
      nome,
      numero_conta,
      saldo_atual
    });

    res.json(conta);
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    res.status(500).json({ error: 'Erro ao atualizar conta' });
  }
});

// Deletar conta
router.delete('/:id', async (req, res) => {
  try {
    const conta = await ContaBancaria.findByPk(req.params.id);

    if (!conta) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    await conta.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    res.status(500).json({ error: 'Erro ao deletar conta' });
  }
});

module.exports = router; 