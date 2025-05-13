const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");
const Aluno = require("./aluno");
const Disciplina = require("./disciplina");
const Curso = require("./curso");

const RegistroAcademico = sequelize.define(
  "registroAcademico",
  {
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
      type: DataTypes.ARRAY(DataTypes.DATE),
      allowNull: true,
      defaultValue: [],
    },
    faltaMotivo: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    faltaQuantidade: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
    testeData: {
      type: DataTypes.DATE,
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
    notaProva: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    trabalhoData: {
      type: DataTypes.DATE,
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
    totalAulas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: "registroAcademico",
  }
);

RegistroAcademico.belongsTo(Aluno, { foreignKey: "alunoId", as: "alunos" });
RegistroAcademico.belongsTo(Curso, { foreignKey: "cursoId", as: "cursos" });
RegistroAcademico.belongsTo(Disciplina, {
  foreignKey: "disciplinaId",
  as: "disciplinas",
});

module.exports = RegistroAcademico;