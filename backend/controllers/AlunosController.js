const Aluno = require("../models/aluno");
const { Op } = require('sequelize');
const supabase = require('../db/supabaseCilent')

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
      console.error('Erro ao buscar aluno controller:', error);  // <-- Verifique o erro aqui
      res.status(500).json({ error: 'Erro ao buscar aluno controller' });
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
      if (!req.files|| !req.files.file || !req.files.historico) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
      }

      // Subir o arquivo para o Supabase
      const { originalname: file, buffer: fileBuffer } = req.files.file[0];
      const { data: fileData, error: fileError } = await supabase.storage
        .from('aluno_foto')
        .upload(`aluno_foto/${Date.now()}-${originalname}`, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: req.files.file[0].mimetype,
        });

      if (fileError) {
        console.error("Erro ao fazer upload da foto no Supabase:", error.message);
        return res.status(500).json({ error: 'Erro ao fazer upload da foto' });
      }

      const { originalname: historico, buffer: historicoBuffer } = req.files.file[0];
      const { dataHistorico: historicoData, error: historicoError } = await supabase.storage
        .from('aluno_historico')
        .upload(`aluno_historico/${Date.now()}-${originalname}`, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: req.files.historico[0].mimetype,
        });

      if (historicoError) {
        console.error("Erro ao fazer upload do historico no Supabase:", error.message);
        return res.status(500).json({ error: 'Erro ao fazer upload da foto' });
      }

      // Obter a URL pública do arquivo
      const publicUrl = supabase.storage
        .from('aluno_foto')
        .getPublicUrl(data.path);
      const url = publicUrl.data.publicUrl;

      const historicPublicUrl = supabase.storage
        .from('aluno_historico')
        .getPublicUrl(historicoData.path);
      const historicoUrl = historicPublicUrl.data.publicUrl;

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
        foto_url: url,
        historico_url: historicoUrl,
      };

      // Converter para minúsculas com exceções
      const alunoLowercase = Object.fromEntries(
        Object.entries(aluno).map(([key, value]) =>
          [key, typeof value === 'string' && key !== 'nome' && key !== 'pai' && key !== 'mae' ? value.toLowerCase() : value]
        )
      );

      const createdUser = await Aluno.create(alunoLowercase);
      res.status(201).json(createdUser);
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
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
    console.log(id)
    try {
      const aluno = await Aluno.findByPk(id);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      await aluno.update(updatedData);
      res.status(200).json({ message: 'Dados do aluno atualizados com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar aluno back' });
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
