const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Admin = db.define('Admin', {
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
  status: {
    type: DataTypes.ENUM('ativo', 'inativo'),
    allowNull: false,
  }
}, {
  tableName: "admins",
  timestamps: false,
});



module.exports = Admin;
