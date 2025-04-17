const Aluno = require("../models/aluno");
const { Op } = require("sequelize");
const supabase = require("../db/supabaseCilent");

// Função para criar um usuário no Supabase Auth
async function createSupabaseUser(nome, email, password, role) {
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName: nome,
          role // Definir o papel do usuário (aluno, professor ou admin)
        }
      }
    });

    if (error) {
      console.error('Erro ao criar usuário:', error.message);
      return null;
    }

    return user;
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    return null;
  }
}

module.exports = class AlunosController {
  static async listAlunos(req, res) {
    try {
      const alunos = await Aluno.findAll();
      res.status(200).json(alunos);
    } catch (err) {
      res.status(500).json({ err: "Erro ao buscar alunos" });
    }
  }

  static async getAlunoByName(req, res) {
    const { nome } = req.query;

    console.log(`Nome recebido: ${nome}`);

    try {
      const alunos = await Aluno.findAll({
        where: { nome: { [Op.like]: `%${nome}%` } },
      });

      console.log(`Alunos encontrados: ${JSON.stringify(alunos)}`);

      if (alunos.length === 0) {
        return res.status(404).json({ error: "Aluno não encontrado" });
      }

      res.status(200).json(alunos);
    } catch (error) {
      console.error("Erro ao buscar aluno controller:", error);
      res.status(500).json({ error: "Erro ao buscar aluno controller" });
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
      cpf,
      endereco,
      n_casa,
      bairro,
      celular,
      cep,
      cidade,
      estado,
      curso,
      turno,
      data_matricula,
      // data_termino_curso,
      password
    } = req.body;

    try {
      if (!req.files || !req.files.file || !req.files.historico) {
        return res.status(400).json({ message: "Nenhum arquivo enviado." });
      }

      const normalizeFileName = (fileName) => {
        return fileName
          .normalize("NFD") // Normaliza caracteres Unicode
          .replace(/[\u0300-\u036f]/g, "") // Remove acentos
          .replace(/[^a-zA-Z0-9.]/g, "_"); // Substitui caracteres especiais por "_"
      };

      // Subir a foto do aluno para o Supabase
      const { originalname: imageName, buffer: imageBuffer } = req.files.file[0];
      const normalizedImageName = normalizeFileName(imageName);

      const { data: imageData, error: fileError } = await supabase.storage
        .from("aluno_foto")
        .upload(`aluno_foto/${Date.now()}-${normalizedImageName}`, imageBuffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: req.files.file[0].mimetype,
        });

      if (fileError) {
        console.error("Erro ao fazer upload da foto no Supabase:", fileError.message);
        return res.status(500).json({ error: "Erro ao fazer upload da foto" });
      }

      // Subir o histórico do aluno para o Supabase
      const { originalname: historicoName, buffer: historicoBuffer } = req.files.historico[0];
      const normalizedHistoricoName = normalizeFileName(historicoName);

      const { data: historicoData, error: historicoError } = await supabase.storage
        .from("aluno_historico")
        .upload(`aluno_historico/${Date.now()}-${normalizedHistoricoName}`, historicoBuffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: req.files.historico[0].mimetype,
        });

      if (historicoError) {
        console.error("Erro ao fazer upload do histórico no Supabase:", historicoError.message);
        return res.status(500).json({ error: "Erro ao fazer upload do histórico" });
      }

      // Obter a URL pública dos arquivos
      const imagePublicUrl = supabase.storage.from("aluno_foto").getPublicUrl(imageData.path).data.publicUrl;
      const historicoPublicUrl = supabase.storage.from("aluno_historico").getPublicUrl(historicoData.path).data.publicUrl;

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
        cpf,
        endereco,
        n_casa,
        bairro,
        celular,
        cep,
        cidade,
        estado,
        curso,
        turno,
        data_matricula,
        // data_termino_curso,
        foto_url: imagePublicUrl,
        historico_url: historicoPublicUrl,
        password
      };

      // Converter campos específicos para minúsculas
      const alunoLowercase = Object.fromEntries(
        Object.entries(aluno).map(([key, value]) => [
          key,
          typeof value === "string" && key !== "nome" && key !== "pai" && key !== "mae"
            ? value.toLowerCase()
            : value,
        ])
      );

      // Criar aluno no banco de dados
      const createdUser = await Aluno.create(alunoLowercase);
      res.status(200).json(createdUser);

      // Criar usuário no Supabase Auth
      await createSupabaseUser(alunoLowercase.nome, alunoLowercase.email, alunoLowercase.password, 'aluno');
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
      res.status(500).json({ error: "Erro ao criar aluno" });
    }
  }

  static async getAlunoById(req, res) {
    const { id } = req.params;

    try {
      const aluno = await Aluno.findByPk(id);
      if (!aluno) {
        return res.status(404).json({ error: "Aluno não encontrado" });
      }
      res.status(200).json(aluno);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar aluno" });
    }
  }

  static async updateAluno(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const aluno = await Aluno.findByPk(id);
      if (!aluno) {
        return res.status(404).json({ error: "Aluno não encontrado" });
      }

      await aluno.update(updatedData);
      res.status(200).json({ message: "Dados do aluno atualizados com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar aluno" });
    }
  }

  static async deleteAluno(req, res) {
    const { id } = req.params;

    try {
      const aluno = await Aluno.findByPk(id);
      if (!aluno) {
        return res.status(404).json({ error: "Aluno não encontrado" });
      }

      await aluno.destroy();
      res.status(200).json({ message: "Aluno deletado com sucesso" });
    } catch (err) {
      res.status(500).json({ error: "Erro ao deletar aluno" });
    }
  }
};
