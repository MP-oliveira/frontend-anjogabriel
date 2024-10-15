const { DataTypes } = require('sequelize');
const db = require('../db/db');




const Disciplina = db.define('Disciplina', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // verifica se é do tipo string ou inteiro 
  carga_horaria_semestral: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // estagio é um campo do tipo select
  estagio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
  {
    tableName: "disciplinas",
    timestamps: false,
  });

module.exports = Disciplina;
