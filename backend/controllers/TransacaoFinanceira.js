const { TransacaoFinanceira, ContaBancaria } = require("../models/transicaoFinanceira");
const { Op, Sequelize } = require("sequelize");

module.exports = class TransacoesFinanceirasController {
  static async listarTransacoes(req, res) {
    try {
      console.log('Buscando todas as transações...');
      const transacoes = await TransacaoFinanceira.findAll({
        include: [{ model: ContaBancaria }],
        order: [['data', 'DESC']]
      });
      console.log('Número de transações encontradas:', transacoes.length);
      console.log('Transações encontradas:', JSON.stringify(transacoes, null, 2));
      res.status(200).json(transacoes);
    } catch (err) {
      console.error("Erro ao buscar transações:", err);
      res.status(500).json({ erro: "Erro ao buscar transações financeiras" });
    }
  }

  static async getTransacaoById(req, res) {
    const { id } = req.params;

    try {
      const transacao = await TransacaoFinanceira.findByPk(id, {
        include: [{ model: ContaBancaria }]
      });
      
      if (!transacao) {
        return res.status(404).json({ erro: "Transação não encontrada" });
      }
      
      res.status(200).json(transacao);
    } catch (error) {
      console.error("Erro ao buscar transação:", error);
      res.status(500).json({ erro: "Erro ao buscar transação" });
    }
  }

  static async getTransacoesByCategoria(req, res) {
    const { categoria } = req.query;

    console.log(`Categoria recebida: ${categoria}`);

    try {
      const transacoes = await TransacaoFinanceira.findAll({
        where: { categoria: { [Op.like]: `%${categoria}%` } },
        include: [{ model: ContaBancaria }]
      });

      console.log(`Transações encontradas: ${JSON.stringify(transacoes)}`);

      if (transacoes.length === 0) {
        return res.status(404).json({ erro: "Nenhuma transação encontrada nesta categoria" });
      }

      res.status(200).json(transacoes);
    } catch (error) {
      console.error("Erro ao buscar transações por categoria:", error);
      res.status(500).json({ erro: "Erro ao buscar transações por categoria" });
    }
  }

  static async getTransacoesByData(req, res) {
    const { dataInicio, dataFim } = req.query;

    try {
      const where = {};
      
      if (dataInicio && dataFim) {
        where.data = {
          [Op.between]: [dataInicio, dataFim]
        };
      } else if (dataInicio) {
        where.data = {
          [Op.gte]: dataInicio
        };
      } else if (dataFim) {
        where.data = {
          [Op.lte]: dataFim
        };
      }

      const transacoes = await TransacaoFinanceira.findAll({
        where,
        include: [{ model: ContaBancaria }],
        order: [['data', 'DESC']]
      });

      if (transacoes.length === 0) {
        return res.status(404).json({ erro: "Nenhuma transação encontrada no período especificado" });
      }

      res.status(200).json(transacoes);
    } catch (error) {
      console.error("Erro ao buscar transações por data:", error);
      res.status(500).json({ erro: "Erro ao buscar transações por data" });
    }
  }

  static async createTransacao(req, res) {
    const {
      tipo,
      valor,
      descricao,
      categoria,
      data,
      conta_id
    } = req.body;

    try {
      // Verificar se a conta bancária existe
      const conta = await ContaBancaria.findByPk(conta_id);
      if (!conta) {
        return res.status(404).json({ erro: "Conta bancária não encontrada" });
      }

      // Criar a transação
      const transacao = await TransacaoFinanceira.create({
        tipo,
        valor,
        descricao,
        categoria,
        data,
        conta_id
      });

      // Atualizar o saldo da conta
      const novoSaldo = tipo === 'receita' 
        ? parseFloat(conta.saldo_atual) + parseFloat(valor)
        : parseFloat(conta.saldo_atual) - parseFloat(valor);
      
      await conta.update({ saldo_atual: novoSaldo });

      res.status(201).json({
        transacao,
        mensagem: "Transação criada com sucesso e saldo atualizado"
      });
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      res.status(500).json({ erro: "Erro ao criar transação financeira" });
    }
  }

  static async updateTransacao(req, res) {
    const { id } = req.params;
    const {
      tipo,
      valor,
      descricao,
      categoria,
      data,
      conta_id
    } = req.body;

    try {
      // Buscar a transação existente
      const transacao = await TransacaoFinanceira.findByPk(id);
      if (!transacao) {
        return res.status(404).json({ erro: "Transação não encontrada" });
      }

      // Se o valor ou tipo está sendo alterado, precisamos atualizar o saldo da conta
      if (valor !== transacao.valor || tipo !== transacao.tipo || conta_id !== transacao.conta_id) {
        // Primeiro revertemos a transação anterior
        const contaAnterior = await ContaBancaria.findByPk(transacao.conta_id);
        
        if (contaAnterior) {
          const saldoRevertido = transacao.tipo === 'receita'
            ? parseFloat(contaAnterior.saldo_atual) - parseFloat(transacao.valor)
            : parseFloat(contaAnterior.saldo_atual) + parseFloat(transacao.valor);
          
          await contaAnterior.update({ saldo_atual: saldoRevertido });
        }

        // Depois aplicamos a nova transação
        const novaConta = await ContaBancaria.findByPk(conta_id || transacao.conta_id);
        
        if (novaConta) {
          const novoSaldo = tipo === 'receita'
            ? parseFloat(novaConta.saldo_atual) + parseFloat(valor)
            : parseFloat(novaConta.saldo_atual) - parseFloat(valor);
          
          await novaConta.update({ saldo_atual: novoSaldo });
        }
      }

      // Atualizar a transação
      await transacao.update({
        tipo,
        valor,
        descricao,
        categoria,
        data,
        conta_id: conta_id || transacao.conta_id
      });

      res.status(200).json({
        mensagem: "Transação atualizada com sucesso e saldo recalculado",
        transacao
      });
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      res.status(500).json({ erro: "Erro ao atualizar transação" });
    }
  }

  static async deleteTransacao(req, res) {
    const { id } = req.params;

    try {
      const transacao = await TransacaoFinanceira.findByPk(id);
      if (!transacao) {
        return res.status(404).json({ erro: "Transação não encontrada" });
      }

      // Atualizar o saldo da conta ao excluir a transação
      const conta = await ContaBancaria.findByPk(transacao.conta_id);
      if (conta) {
        const novoSaldo = transacao.tipo === 'receita'
          ? parseFloat(conta.saldo_atual) - parseFloat(transacao.valor)
          : parseFloat(conta.saldo_atual) + parseFloat(transacao.valor);
        
        await conta.update({ saldo_atual: novoSaldo });
      }

      // Excluir a transação
      await transacao.destroy();

      res.status(200).json({ 
        mensagem: "Transação excluída com sucesso e saldo atualizado" 
      });
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      res.status(500).json({ erro: "Erro ao deletar transação" });
    }
  }

  static async getBalancoMensal(req, res) {
    const { ano, mes } = req.query;
    
    try {
      // Definir o primeiro e último dia do mês
      const dataInicio = `${ano}-${mes.padStart(2, '0')}-01`;
      const ultimoDia = new Date(ano, mes, 0).getDate();
      const dataFim = `${ano}-${mes.padStart(2, '0')}-${ultimoDia}`;
      
      // Buscar receitas do mês
      const receitas = await TransacaoFinanceira.findAll({
        where: {
          tipo: 'receita',
          data: {
            [Op.between]: [dataInicio, dataFim]
          }
        },
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('valor')), 'total']
        ],
        raw: true
      });
      
      // Buscar despesas do mês
      const despesas = await TransacaoFinanceira.findAll({
        where: {
          tipo: 'despesa',
          data: {
            [Op.between]: [dataInicio, dataFim]
          }
        },
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('valor')), 'total']
        ],
        raw: true
      });
      
      // Calcular totais e saldo
      const totalReceitas = parseFloat(receitas[0].total || 0);
      const totalDespesas = parseFloat(despesas[0].total || 0);
      const saldo = totalReceitas - totalDespesas;
      
      res.status(200).json({
        periodo: `${mes}/${ano}`,
        receitas: totalReceitas,
        despesas: totalDespesas,
        saldo
      });
    } catch (error) {
      console.error("Erro ao gerar balanço mensal:", error);
      res.status(500).json({ erro: "Erro ao gerar balanço mensal" });
    }
  }

  // Métodos adicionados para lidar com contas
  static async listarContas(req, res) {
    try {
      const contas = await ContaBancaria.findAll();
      res.status(200).json(contas);
    } catch (err) {
      console.error("Erro ao buscar contas:", err);
      res.status(500).json({ erro: "Erro ao buscar contas" });
    }
  }

  static async getContaById(req, res) {
    const { id } = req.params;
    try {
      const conta = await ContaBancaria.findByPk(id);
      if (!conta) {
        return res.status(404).json({ erro: "Conta não encontrada" });
      }
      res.status(200).json(conta);
    } catch (err) {
      console.error("Erro ao buscar conta:", err);
      res.status(500).json({ erro: "Erro ao buscar conta" });
    }
  }

  static async createConta(req, res) {
    const { nome, numero_conta, saldo_atual } = req.body;

    try {
      const novaConta = await ContaBancaria.create({
        nome,
        numero_conta,
        saldo_atual
      });
      res.status(201).json(novaConta);
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      res.status(500).json({ erro: 'Erro ao criar conta' });
    }
  }
};