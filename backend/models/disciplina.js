const { DataTypes } = require('sequelize');
const db = require('../db/db');


const Disciplina = db.define('disciplina', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  modulo: {
    type: DataTypes.ENUM('Modulo 1', 'Modulo 2', 'Modulo 3', 'Modulo 4'),
    allowNull: false,
  },
  carga_horaria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 1,
    },
  },
  carga_horaria_estagio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 0,
    },
  },
  estagio_supervisionado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duracao: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  curso_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  professor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  horario_inicio: {
    type: DataTypes.STRING,
    allowNull: false
  },
  horario_fim: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dias_semana: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    validate: {
      isValidDay(value) {
        const validDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
        if (!value.every(day => validDays.includes(day))) {
          throw new Error('Dias da semana inválidos');
        }
      },
    },
  },

}, {
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
});

module.exports = Disciplina;
