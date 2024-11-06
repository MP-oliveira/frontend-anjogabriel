const { DataTypes } = require('sequelize');
const db = require('../db/db');


const Disciplina = sequelize.define('Disciplina', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  carga_horaria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 1,
    },
  },
  descricao: {
    type: DataTypes.TEXT,
  },
  pre_requisitos: {
    type: DataTypes.STRING,
  },
  modalidade: {
    type: DataTypes.ENUM('Presencial', 'Online', 'Híbrido'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Ativo', 'Inativo'),
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
});

module.exports = Disciplina;
