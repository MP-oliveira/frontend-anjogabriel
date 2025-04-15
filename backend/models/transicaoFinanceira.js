const { DataTypes } = require('sequelize');
const db = require('../db/db');

// Modelo para transações financeiras (receitas e despesas)
const TransacaoFinanceira = db.define('TransacaoFinanceira', {
  tipo: {
    type: DataTypes.ENUM('receita', 'despesa'),
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  conta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contas_bancarias',
      key: 'id'
    }
  }
}, {
  tableName: "transacoes_financeiras",
  timestamps: true,
});

// Modelo para contas bancárias
const ContaBancaria = db.define('ContaBancaria', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numero_conta: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  saldo_atual: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
}, {
  tableName: "contas_bancarias",
  timestamps: true,
});

// Modelo para saldos diários das contas (acompanhamento histórico)
const SaldoDiario = db.define('SaldoDiario', {
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  saldo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  conta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contas_bancarias',
      key: 'id'
    }
  }
}, {
  tableName: "saldos_diarios",
  timestamps: true,
});

// Modelo para contas a pagar
const ContaPagar = db.define('ContaPagar', {
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  data_vencimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status_pagamento: {
    type: DataTypes.ENUM('pendente', 'pago', 'atrasado'),
    allowNull: false,
    defaultValue: 'pendente',
  },
  notificacao_enviada: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  conta_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'contas_bancarias',
      key: 'id'
    }
  }
}, {
  tableName: "contas_pagar",
  timestamps: true,
});

// Definir relacionamentos
ContaBancaria.hasMany(TransacaoFinanceira, { foreignKey: 'conta_id' });
TransacaoFinanceira.belongsTo(ContaBancaria, { foreignKey: 'conta_id' });

ContaBancaria.hasMany(SaldoDiario, { foreignKey: 'conta_id' });
SaldoDiario.belongsTo(ContaBancaria, { foreignKey: 'conta_id' });

ContaBancaria.hasMany(ContaPagar, { foreignKey: 'conta_id' });
ContaPagar.belongsTo(ContaBancaria, { foreignKey: 'conta_id' });

module.exports = {
  TransacaoFinanceira,
  ContaBancaria,
  SaldoDiario,
  ContaPagar
};