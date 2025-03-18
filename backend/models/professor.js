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
    type: DataTypes.ENUM('ativo', 'inativo'),
    allowNull: false,
    defaultValue: 'ativo'
  },
  role: {
    type: DataTypes.ENUM('professor'),
    allowNull: false,
    defaultValue: 'professor'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100], // ajusta o segundo argumento conforme necessário
        msg: "Senha precisa ter ao menos 6 caracteres."
      }
    }
  }
}, {
  tableName: "professores",
  timestamps: false,
});

// Relacionamento Many-to-Many entre Professor e Disciplina
Professor.belongsToMany(Disciplina, { 
  through: 'professor_id',
  as: 'disciplinas'
});
Disciplina.belongsToMany(Professor, { 
  through: 'professor_id',
  as: 'professores'
});

module.exports = Professor;
