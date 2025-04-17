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

  cpf: {
    type: DataTypes.STRING(11),
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

  celular: {
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
  // data_termino_curso: {
  //   // quando colocar curso pra funcionar mudar para date
  //   type: DataTypes.STRING,
  // },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100], // ajusta o segundo argumento conforme necessário
        msg: "A senha precisa ter ao menos 6 caracteres."
      }
    }
  }
},
{
  tableName: "alunos"
});




// Curso.hasMany(Aluno);
// Aluno.hasMany(Curso);


module.exports = Aluno;

