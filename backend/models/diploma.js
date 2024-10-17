const { DataTypes } = require('sequelize');
const db = require('../db/db')

const Diploma = db.define("Diploma", {
  nome: {
    type: DataTypes.STRING,
    // allowNull: false
  }
},
{
  tableName: 'diplomas',
}
);

module.exports = Diploma;

