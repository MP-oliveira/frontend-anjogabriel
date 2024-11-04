const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Professor = db.define('Professor', {
  nome: {
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
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  disciplinas: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},
{
  tableName: "professores",
  timestamps: false,
});

module.exports = Professor;