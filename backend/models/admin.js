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
  role: {
    type: DataTypes.ENUM('admin'),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100], // ajusta o segundo argumento conforme necessário
        msg: "Password should be at least 6 characters."
      }
    }
  }
},
  {
    tableName: "admins",
    timestamps: false,
  });



module.exports = Admin;
