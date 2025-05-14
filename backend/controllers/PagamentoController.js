const Pagamento = require('../models/Pagamento');
const Aluno = require('../models/Aluno');
const { ContaBancaria } = require('../models/transicaoFinanceira');
const { TransacaoFinanceira } = require('../models/transicaoFinanceira');
const { Op } = require('sequelize');

const PagamentoController = {
  // Criar um novo pagamento
  async create(req, res) {
    try {
      const { aluno_id, conta_id, mes_referencia, valor, observacao } = req.body;
      const recebido_por = req.body.recebido_por || 'Usuário não identificado';

      // Validar dados
      if (!aluno_id || !conta_id || !mes_referencia || !valor) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
      }

      // Verificar se o aluno existe
      const aluno = await Aluno.findByPk(aluno_id);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      // Verificar se a conta existe
      const conta = await ContaBancaria.findByPk(conta_id);
      if (!conta) {
        return res.status(404).json({ error: 'Conta não encontrada' });
      }

      // Criar o pagamento
      const pagamento = await Pagamento.create({
        aluno_id,
        conta_id,
        mes_referencia,
        valor,
        recebido_por,
        observacao
      });

      // Atualizar o saldo da conta
      await conta.update({
        saldo_atual: parseFloat(conta.saldo_atual) + parseFloat(valor)
      });

      // Criar uma transação financeira
      await TransacaoFinanceira.create({
        tipo: 'receita',
        valor: valor,
        descricao: `Mensalidade - ${aluno.nome} - ${new Date(mes_referencia).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} - ${new Date().toLocaleTimeString('pt-BR')}`,
        categoria: 'mensalidade',
        data: new Date(),
        conta_id: conta_id
      });

      return res.status(201).json(pagamento);
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      return res.status(500).json({ error: 'Erro ao criar pagamento' });
    }
  },

  // Buscar pagamentos por aluno
  async getByAluno(req, res) {
    try {
      const { aluno_id } = req.params;

      const pagamentos = await Pagamento.findAll({
        where: { aluno_id },
        include: [
          { model: Aluno, attributes: ['nome'] },
          { model: ContaBancaria, attributes: ['nome'] }
        ],
        order: [['data_pagamento', 'DESC']]
      });

      // Calcular totais
      const totalPago = pagamentos.reduce((acc, pag) => acc + parseFloat(pag.valor), 0);
      const mesesPagos = pagamentos.length;

      return res.json({
        pagamentos,
        totalPago,
        mesesPagos
      });
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      return res.status(500).json({ error: 'Erro ao buscar pagamentos' });
    }
  },

  // Buscar pagamentos por período
  async getByPeriod(req, res) {
    try {
      const { data_inicio, data_fim } = req.query;

      if (!data_inicio || !data_fim) {
        return res.status(400).json({ error: 'Data inicial e final são obrigatórias' });
      }

      const pagamentos = await Pagamento.findAll({
        where: {
          data_pagamento: {
            [Op.between]: [data_inicio, data_fim]
          }
        },
        include: [
          { model: Aluno, attributes: ['nome'] },
          { model: ContaBancaria, attributes: ['nome'] }
        ],
        order: [['data_pagamento', 'DESC']]
      });

      return res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao buscar pagamentos por período:', error);
      return res.status(500).json({ error: 'Erro ao buscar pagamentos por período' });
    }
  },

  // Buscar todos os pagamentos
  async getAll(req, res) {
    try {
      const pagamentos = await Pagamento.findAll({
        include: [
          { model: Aluno, attributes: ['nome'] },
          { model: ContaBancaria, attributes: ['nome'] }
        ],
        order: [['data_pagamento', 'DESC']]
      });

      return res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao buscar todos os pagamentos:', error);
      return res.status(500).json({ error: 'Erro ao buscar todos os pagamentos' });
    }
  }
};

module.exports = PagamentoController; 