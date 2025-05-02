const { DataTypes } = require('sequelize');
const db = require('../db/db');


const Disciplina = db.define('disciplina', {
  nome: {
    type: DataTypes.STRING,
  },
  modulo: {
    type: DataTypes.STRING,
  },
  carga_horaria: {
    type: DataTypes.INTEGER,
  },
  carga_horaria_estagio: {
    type: DataTypes.INTEGER,
  },
  estagio_supervisionado: {
    type: DataTypes.STRING,
  },
  duracao: {
    type: DataTypes.INTEGER,
  },
  curso_id: {
    type: DataTypes.INTEGER,
  },
  professor_id: {
    type: DataTypes.INTEGER,
  },
  horario_inicio: {
    type: DataTypes.STRING,
  },
  horario_fim: {
    type: DataTypes.STRING,
  },
  dias_semana: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'disciplinas',
});

// Sincronização temporária para garantir que a tabela está alinhada com o model
if (process.env.NODE_ENV !== 'production') {
  Disciplina.sync({ alter: true })
    .then(() => console.log('Tabela Disciplina sincronizada com sucesso!'))
    .catch((err) => console.error('Erro ao sincronizar tabela Disciplina:', err));
}

module.exports = Disciplina;
