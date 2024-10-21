const { DataTypes } = require('sequelize');
const db = require('../db/db');
const Curso = require('../models/curso') 

const Aluno = db.define('Aluno', {
  nome: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  data_nascimento: {
    // ajustar pra DATE depois 
    type: DataTypes.STRING,
    // allowNull: false,
  },
  estado_civil: {
    type: DataTypes.STRING,
  },
  grupo_sanguineo: {
    type: DataTypes.STRING(3),
  },
  naturalidade: {
    type: DataTypes.STRING,
  },
  nacionalidade: {
    type: DataTypes.STRING,
  },
  pai: {
    type: DataTypes.STRING,
  },
  mae: {
    type: DataTypes.STRING,
  },
  rg: {
    type: DataTypes.STRING(20),
  },
  orgao_expedidor_rg: {
    type: DataTypes.STRING,
  },
  data_expedicao_rg: {
    // mudar para DATE 
    type: DataTypes.STRING,
  },
  cpf: {
    type: DataTypes.STRING(11),
    // allowNull: false,
    unique: true,
  },
  endereco: {
    type: DataTypes.STRING,
  },
  n_casa: {
    type: DataTypes.STRING(10),
  },
  bairro: {
    type: DataTypes.STRING,
  },
  tel_res: {
    type: DataTypes.STRING(15),
  },
  celular: {
    type: DataTypes.STRING(15),
  },
  tel_trabalho: {
    type: DataTypes.STRING(15),
  },
  cep: {
    type: DataTypes.STRING(10),
  },
  cidade: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.STRING,
  },
  curso: { // relacionar com tabela curso
    type: DataTypes.STRING,
  },
  turno: { // relacionar com tabela curso
    type: DataTypes.STRING,
  },
  foto_url: {
    type: DataTypes.STRING,
  },
  historico_url: {
    type: DataTypes.STRING,
  },
  data_matricula: {
    // quando colocar curso pra funcionar mudar para date
    type: DataTypes.STRING,
  },
  data_termino_curso: {
    // quando colocar curso pra funcionar mudar para date
    type: DataTypes.STRING,
  },

},
{
  tableName: "alunos"
});

// Curso.hasMany(Aluno);
// Aluno.hasMany(Curso);


module.exports = Aluno;
