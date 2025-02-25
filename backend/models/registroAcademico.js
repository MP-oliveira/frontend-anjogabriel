const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");
const Aluno = require("./aluno");
const Disciplina = require("./disciplina");
const Curso = require("./curso");

// Modelo RegistroAcademico
const RegistroAcademico = sequelize.define("registroAcademico", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  alunoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "alunos",
      key: "id",
    },
  },
  disciplinaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "disciplinas",
      key: "id",
    },
  },

  cursoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "cursos",
      key: "id",
    },
  },

  faltaData: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  faltaMotivo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  testeData: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  testeDescricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notaTeste: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  provaData: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  provaDescricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notaProva: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  trabalhoData: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  trabalhoDescricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notaTrabalho: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  estagioData: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  estagioDescricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estagioNota: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  media: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  mediaFinal: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
},
  {
    tableName: "registroAcademico"
  });

RegistroAcademico.belongsTo(Aluno, { foreignKey: "alunoId", as: "alunos" });
RegistroAcademico.belongsTo(Curso, { foreignKey: "cursoId", as: "cursos" });
RegistroAcademico.belongsTo(Disciplina, { foreignKey: "disciplinaId", as: "disciplinas", });

module.exports = RegistroAcademico;
