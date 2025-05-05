const { DataTypes } = require('sequelize');
const db = require('../db/db');

const Turno = db.define('Turno', {
  nome: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  inicio: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  termino: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
},
  {
    tableName: "turnos"
  });

module.exports = Turno;
