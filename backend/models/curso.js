const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Curso = db.define('Curso', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  carga_horaria: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duracao: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  valor_total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  valor_mensal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('ativo', 'inativo', 'em breve'),
    allowNull: false,
  },
  modalidade: {
    type: DataTypes.ENUM('presencial', 'hibrido', 'EAD'),
    allowNull: false,
  },

}, {
  tableName: 'cursos',
});

module.exports = Curso;
