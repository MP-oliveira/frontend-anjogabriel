const { DataTypes } = require('sequelize');
const db = require('../db/db');
const Aluno = require('./Aluno');
const { ContaBancaria } = require('./transicaoFinanceira');

const Pagamento = db.define('Pagamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  aluno_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alunos',
      key: 'id'
    }
  },
  conta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contas_bancarias',
      key: 'id'
    }
  },
  mes_referencia: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  recebido_por: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data_pagamento: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  observacao: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'pagamentos',
  timestamps: true
});

Pagamento.belongsTo(Aluno, { foreignKey: 'aluno_id' });
Pagamento.belongsTo(ContaBancaria, { foreignKey: 'conta_id' });

module.exports = Pagamento; 