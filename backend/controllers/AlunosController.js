const Aluno = require('../models/aluno');

exports.getAllAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.findAll();
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alunos.' });
  }
};

exports.createAluno = async (req, res) => {
  const nome = req.body.nome;
  try {
    await Aluno.create(nome);
    res.status(201).json();
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar aluno.' });
  }
};



// Outros métodos (getAlunoById, updateAluno, deleteAluno)
