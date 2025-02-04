const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const Aluno = require("../models/aluno");
const Disciplina = require("../models/disciplina");
const RegistroAcademico = require("../models/registroAcademico");

// Esse controller esta ok - FUNCIONANDO
// Função para criar um novo registro acadêmico
const createRegistroAcademico = async (req, res) => {
  let media = 0
  let mediaFinal = 0
  const {
    alunoId,
    disciplinaId,
    faltaData,
    faltaMotivo,
    testeData,
    testeDescricao,
    notaTeste,
    provaData,
    provaDescricao,
    notaProva,
    trabalhoData,
    trabalhoDescricao,
    notaTrabalho,
    estagioData,
    estagioDescricao,
    estagioNota,
    // fazer o calculo da media para salvar no banco de dados
  } = req.body;

  media = (notaTeste + notaProva + notaTrabalho + estagioNota) / 4
  mediaFinal = (media + mediaFinal) / 2

  if (!alunoId || !disciplinaId) {
    return res
      .status(400)
      .json({
        error:
          "Campos obrigatórios ausentes: alunoId, disciplinaId  são necessários.",
      });
  }

  try {
    const aluno = await Aluno.findByPk(alunoId);
    const disciplina = await Disciplina.findByPk(disciplinaId)

    // console.log(aluno.id, disciplina.id)  // Aqui esta recebendo o aluno e disciplina

    if (!aluno) {
      res.status(404).json({ error: ["Aluno nao encotnrato, informe o codigo do aluno valido!"] })
      return
    }

    if (!disciplina) {
      res.status(404).json({ error: ["Disciplina nao encotnrato, informe o codigo da disciplina valido!"] })
      return
    }


    const novoRegistro = await RegistroAcademico.create({
      alunoId: aluno.id,
      disciplinaId: disciplina.id,
      faltaData,
      faltaMotivo,
      testeData,
      testeDescricao,
      notaTeste,
      provaData,
      provaDescricao,
      notaProva,
      trabalhoData,
      trabalhoDescricao,
      notaTrabalho,
      estagioData,
      estagioDescricao,
      estagioNota,
      media,
      mediaFinal,
    });

    // Deus erro no formato da data
    res.status(200).json({ message: "Aluno e disciplina encontrado", aluno: aluno.nome, disciplina: disciplina.nome, novoRegistro: novoRegistro })
  } catch (error) {
    console.error("Erro ao criar registro acadêmico:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Esse controller esta ok - FUNCIONANDO
// Função para obter todos os registros acadêmicos
const listRegistrosAcademicos = async (req, res) => {
  try {
    const registros = await RegistroAcademico.findAll({
      include: [
        {
          model: Aluno,
          as: "alunos",
          // attributes: ["id", "nome"],
        },
        {
          model: Disciplina,
          as: "disciplinas",
          // attributes: ["id", "nome"],
        },
      ],
      // attributes: [
      //   "id",
      //   "alunoId",
      //   "disciplinaId",
      //   "faltaData",
      //   "faltaMotivo",
      //   "notaTeste",
      //   "notaProva",
      //   "provaData",
      //   "provaDescricao",
      //   "testeData",
      //   "testeDescricao",
      //   "notaTrabalho",
      //   "trabalhoData",
      //   "trabalhoDescricao",
      //   "estagioData",
      //   "estagioDescricao",
      //   "estagioNota",
      //   "media",
      //   "mediaFinal",
      //   "createdAt",
      //   "updatedAt",
      // ],
    });

    // console.log("registro academico", registros[0].alunos)  // chegou aqui ok

    const registrosFormatados = registros.map((registro) => ({
      id: registro.id,
      aluno: registro.alunos.nome,
      disciplina: registro.disciplinas.nome,
      faltaData: registro.faltaData,
      faltaMotivo: registro.faltaMotivo,
      notaTeste: registro.notaTeste,
      media: registro.media,
      mediaFinal: registro.mediaFinal,
      notaProva: registro.notaProva,
      provaData: registro.provaData,
      provaDescricao: registro.provaDescricao,
      testeData: registro.testeData,
      testeDescricao: registro.testeDescricao,
      notaTrabalho: registro.notaTrabalho,
      trabalhoData: registro.trabalhoData,
      trabalhoDescricao: registro.trabalhoDescricao,
      createdAt: registro.createdAt,
      updatedAt: registro.updatedAt,
    }));
    // console.log("registro formatado", registrosFormatados)  chegou aqui ok
    res.status(200).json(registrosFormatados);
  } catch (error) {
    console.error("Erro ao listar registros acadêmicos:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Esse controller esta ok - FUNCIONANDO
// Função para obter um registro acadêmico por ID
const getRegistroAcademicoById = async (req, res) => {
  // console.log('Requisição recebida para o ID:', req.params.id);
  const { id } = req.params;

  try {
    const registro = await RegistroAcademico.findByPk(id, {
      include: [
        { model: Aluno, as: "alunos" /*, attributes: ["id", "nome"]*/ },
        { model: Disciplina, as: "disciplinas"/*, attributes: ["id", "nome"]*/ },
      ],
    });
    if (registro) {
      const registroFormatado = {
        id: registro.id,
        aluno: registro.aluno,
        disciplina: registro.disciplina,
        faltaData: registro.faltaData,
        faltaMotivo: registro.faltaMotivo,
        notaTeste: registro.notaTeste,
        media: registro.media,
        mediaFinal: registro.mediaFinal,
        notaProva: registro.notaProva,
        provaData: registro.provaData,
        provaDescricao: registro.provaDescricao,
        testeData: registro.testeData,
        testeDescricao: registro.testeDescricao,
        notaTrabalho: registro.notaTrabalho,
        trabalhoData: registro.trabalhoData,
        trabalhoDescricao: registro.trabalhoDescricao,
        createdAt: registro.createdAt,
        updatedAt: registro.updatedAt,
      };
      res.status(200).json(registroFormatado);
    } else {
      res.status(404).json({ error: "Registro não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar registro acadêmico por ID:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Esse controller esta ok - FUNCIONANDO
// Função para atualizar um registro acadêmico
const updateRegistroAcademico = async (req, res) => {
  const { id } = req.params;
  const {
    faltaData,
    faltaMotivo,
    testeData,
    testeDescricao,
    notaTeste,
    provaData,
    provaDescricao,
    notaProva,
    trabalhoData,
    trabalhoDescricao,
    notaTrabalho,
    estagioData,
    estagioDescricao,
    estagioNota,
  } = req.body;

  try {
    const registro = await RegistroAcademico.findByPk(id);
    
    if (registro) {
      // Calcula a nova média com os valores do body
      const novaMedia = (
        (notaTeste || registro.notaTeste) + 
        (notaProva || registro.notaProva) + 
        (notaTrabalho || registro.notaTrabalho) + 
        (estagioNota || registro.estagioNota)
      ) / 4;
      
      // Calcula a média final usando a média antiga do registro e a nova média
      const mediaFinal = (novaMedia + registro.media) / 2;

      await registro.update({
        faltaData,
        faltaMotivo,
        testeData,
        testeDescricao,
        notaTeste,
        provaData,
        provaDescricao,
        notaProva,
        trabalhoData,
        trabalhoDescricao,
        notaTrabalho,
        estagioData,
        estagioDescricao,
        estagioNota,
        media: novaMedia,
        mediaFinal,
      });
      
      res.status(200).json({message: "Registro atualizado com sucesso", registro: registro});
    } else {
      res.status(404).json({ error: "Registro não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao atualizar registro acadêmico:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Esse controller esta ok - FUNCIONANDO
// Função para excluir um registro acadêmico
const deleteRegistroAcademico = async (req, res) => {
  const { id } = req.params;

  try {
    const registro = await RegistroAcademico.findByPk(id);
    if (registro) {
      await registro.destroy();

    } else {
      res.status(404).json({ error: "Registro não encontrado" });
      return
    }

  } catch (error) {
    console.error("Erro ao excluir registro acadêmico:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Função de teste
const testeRegistroAcademico = (req, res) => {
  res.status(200).json({ message: "Teste de conexão bem-sucedido" });
};

module.exports = {
  createRegistroAcademico,
  listRegistrosAcademicos,
  getRegistroAcademicoById,
  updateRegistroAcademico,
  deleteRegistroAcademico,
  testeRegistroAcademico,
};
