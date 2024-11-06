const { DataTypes } = require('sequelize');
const db = require('../db/db');


const Disciplina = db.define('Disciplina', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  descricao: {
    type: DataTypes.STRING,
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
  semestre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Ativo', 'Inativo'),
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
  pre_requisitos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modalidade: {
    type: DataTypes.ENUM('Presencial', 'Online', 'Híbrido'),
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
});

module.exports = Disciplina;
