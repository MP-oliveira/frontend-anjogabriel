const { DataTypes } = require('sequelize');
const db = require('../db/db');




const Curso = db.define('Curso', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duracao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  carga_horaria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estagio_supervisionado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
  {
    tableName: "cursos",
    timestamps: false,
  });

module.exports = Curso;
