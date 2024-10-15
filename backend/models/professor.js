const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Professor = db.define('Professor', {
  nome: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  rg: {
    type: DataTypes.STRING(20),
  },
  cpf: {
    type: DataTypes.STRING(11),
    // allowNull: false,
    unique: true,
  },
  celular: {
    type: DataTypes.STRING(15),
  },
},
  {
    tableName: "professores"
  });

module.exports = Professor;
