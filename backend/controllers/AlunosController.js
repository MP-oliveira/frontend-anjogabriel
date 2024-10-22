const Aluno = require("../models/aluno");
const { Op } = require('sequelize');


module.exports = class AlunosController {
  static async listAlunos(req, res) {
    try {
      const alunos = await Aluno.findAll();
      // console.log(alunos);
      res.status(200).json(alunos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar alunos' });
    }
  }


  static async getAlunoByName(req, res) {
    const { nome } = req.query;
    console.log(`Nome recebido: ${nome}`);  // <-- Adicione este log
  
    try {
      const alunos = await Aluno.findAll({
        where: { nome: { [Op.like]: `%${nome}%` } },
      });
  
      console.log(`Alunos encontrados: ${JSON.stringify(alunos)}`);  // <-- Adicione este log
  
      if (alunos.length === 0) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
  
      res.status(200).json(alunos);
      // res.status(200).json([{ id: 1, nome: 'Teste', email: 'teste@example.com', cpf: '12345678900' }]);
    } catch (error) {
      console.error('Erro ao buscar aluno:', error);  // <-- Verifique o erro aqui
      res.status(500).json({ error: 'Erro ao buscar aluno' });
    }
  }


  static async createAluno(req, res) {
    const {
      nome,
      email,
      data_nascimento,
      estado_civil,
      grupo_sanguineo,
      naturalidade,
      nacionalidade,
      pai,
      mae,
      rg,
      orgao_expedidor_rg,
      data_expedicao_rg,
      cpf,
      endereco,
      n_casa,
      bairro,
      tel_res,
      celular,
      tel_trabalho,
      cep,
      cidade,
      estado,
      curso,
      turno,
      data_matricula,
      data_termino_curso,
    } = req.body;

    try {
      const aluno = {
        nome,
        email,
        data_nascimento,
        estado_civil,
        grupo_sanguineo,
        naturalidade,
        nacionalidade,
        pai,
        mae,
        rg,
        orgao_expedidor_rg,
        data_expedicao_rg,
        cpf,
        endereco,
        n_casa,
        bairro,
        tel_res,
        celular,
        tel_trabalho,
        cep,
        cidade,
        estado,
        curso,
        turno,
        data_matricula,
        data_termino_curso,
      };

      const createdUser = await Aluno.create(aluno);
      res.status(201).json(createdUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar aluno' });
    }
  }
  static async getAlunoById(req, res) {
    const { id } = req.params;
    try {
      const aluno = await Aluno.findByPk(id);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      res.status(200).json(aluno);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar aluno' });
    }
  }
  static async updateAluno(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const aluno = await Aluno.findByPk(id);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      await aluno.update(updatedData);
      res.status(200).json({ message: 'Dados do aluno atualizados com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar aluno' });
    }
  }

  static async deleteAluno(req, res) {
    const { id } = req.params;

    try {
      const aluno = await Aluno.findByPk(id);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      await aluno.destroy();
      res.status(200).json({ message: 'Aluno deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar aluno' });
    }
  }
};
