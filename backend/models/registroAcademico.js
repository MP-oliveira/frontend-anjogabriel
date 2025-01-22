const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Aluno = require('./aluno')
const Disciplina = require('./disciplina')

// Modelo RegistroAcademico
const RegistroAcademico = sequelize.define('registroAcademico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  alunoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alunos', 
      key: 'id',
    },
  },
  disciplinaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'disciplinas', 
      key: 'id',
    },
  },

  faltaData: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  faltaMotivo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notaValor: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  provaData: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  provaDescricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  testeData: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  testeDescricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trabalhoData: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  trabalhoDescricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

RegistroAcademico.belongsTo(Aluno, { foreignKey: 'alunoId', as: 'aluno' });
RegistroAcademico.belongsTo(Disciplina, { foreignKey: 'disciplinaId', as: 'disciplina' });

module.exports = RegistroAcademico;
