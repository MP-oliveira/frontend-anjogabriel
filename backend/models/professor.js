const { DataTypes } = require('sequelize');
const db = require('../db/db');
const Disciplina = require('./disciplina');

const Professor = db.define('Professor', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  especialidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Ativo', 'Inativo'),
    allowNull: false,
    defaultValue: 'Ativo'
  }
}, {
  tableName: "professores",
  timestamps: false,
});

// Relacionamento Many-to-Many entre Professor e Disciplina
Professor.belongsToMany(Disciplina, { 
  through: 'professor_disciplinas',
  as: 'disciplinas'
});
Disciplina.belongsToMany(Professor, { 
  through: 'professor_disciplinas',
  as: 'professores'
});

module.exports = Professor;
