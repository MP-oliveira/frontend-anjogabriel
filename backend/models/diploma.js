const { DataTypes } = require('sequelize');
const db = require('../db/db');
const Aluno = require('./aluno');

const Diploma = db.define("Diploma", {
  numero_registro: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  data_emissao: {
    type: DataTypes.DATE,
    allowNull: false
  },
  data_conclusao: {
    type: DataTypes.DATE,
    allowNull: false
  },
  livro_registro: {
    type: DataTypes.STRING,
    allowNull: false
  },
  folha_registro: {
    type: DataTypes.STRING,
    allowNull: false
  },
  processo_numero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  observacoes: {
    type: DataTypes.TEXT
  },
  diploma_url: {
    type: DataTypes.STRING
  },
  aluno_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alunos',
      key: 'id'
    }
  }
}, {
  tableName: 'diplomas',
});

// Definindo o relacionamento
Diploma.belongsTo(Aluno, { 
  foreignKey: 'aluno_id',
  as: 'aluno'
});
Aluno.hasOne(Diploma, {
  foreignKey: 'aluno_id',
  as: 'diploma'
});

module.exports = Diploma;