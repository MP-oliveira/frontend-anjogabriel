const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const Aluno = require("../models/aluno");
const Disciplina = require("../models/disciplina");
const Curso = require("../models/curso");
const RegistroAcademico = require("../models/registroAcademico");

// Função para criar um novo registro acadêmico
const createRegistroAcademico = async (req, res) => {
  let media = 0;
  let mediaFinal = 0;
  const {
    alunoId,
    disciplinaId,
    cursoId,
    faltaData,
    faltaMotivo,
    faltaQuantidade,
    testeData,
    notaTeste,
    provaData,
    notaProva,
    trabalhoData,
    notaTrabalho,
    estagioData,
    estagioNota,
    totalAulas,
  } = req.body;

  // Calcula a média
  media = (notaTeste + notaProva + notaTrabalho + estagioNota) / 4;
  mediaFinal = (media + mediaFinal) / 2;

  if (!alunoId || !disciplinaId) {
    return res
      .status(400)
      .json({
        error:
          "Campos obrigatórios ausentes: alunoId, disciplinaId são necessários.",
      });
  }

  try {
    const aluno = await Aluno.findByPk(alunoId);
    const disciplina = await Disciplina.findByPk(disciplinaId);
    const curso = await Curso.findByPk(cursoId);

    if (!aluno) {
      res.status(404).json({ error: ["Aluno não encontrado, informe o código do aluno válido!"] });
      return;
    }

    if (!disciplina) {
      res.status(404).json({ error: ["Disciplina não encontrada, informe o código da disciplina válido!"] });
      return;
    }

    if (!curso) {
      res.status(404).json({ error: ["Curso não encontrado, informe o código do curso válido!"] });
      return;
    }

    // Garantir que os arrays estejam definidos ou inicializá-los como vazios
    const faltaDataArray = Array.isArray(faltaData) ? faltaData : [faltaData].filter(Boolean);
    const faltaMotivoArray = Array.isArray(faltaMotivo) ? faltaMotivo : [faltaMotivo].filter(Boolean);
    const faltaQuantidadeArray = Array.isArray(faltaQuantidade) ? faltaQuantidade : [faltaQuantidade].filter(Boolean);

    const novoRegistro = await RegistroAcademico.create({
      alunoId: aluno.id,
      disciplinaId: disciplina.id,
      cursoId: curso.id,
      faltaData: faltaDataArray,
      faltaMotivo: faltaMotivoArray,
      faltaQuantidade: faltaQuantidadeArray,
      testeData,
      notaTeste,
      provaData,
      notaProva,
      trabalhoData,
      notaTrabalho,
      estagioData,
      estagioNota,
      media,
      mediaFinal,
      totalAulas,
    });

    res.status(200).json({ 
      message: "Aluno e disciplina encontrado", 
      aluno: aluno.nome, 
      disciplina: disciplina.nome, 
      novoRegistro: novoRegistro 
    });
  } catch (error) {
    console.error("Erro ao criar registro acadêmico:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Função para obter todos os registros acadêmicos
const listRegistrosAcademicos = async (req, res) => {
  try {
    const registros = await RegistroAcademico.findAll({
      include: [
        {
          model: Aluno,
          as: "alunos",
        },
        {
          model: Disciplina,
          as: "disciplinas",
        },
        {
          model: Curso,
          as: "cursos",
        },
      ],
    });

    const registrosFormatados = registros.map((registro) => ({
      id: registro.id,
      aluno: registro.alunos.nome,
      disciplina: registro.disciplinas.nome,
      curso: registro.cursos.nome,
      faltaData: registro.faltaData,
      faltaMotivo: registro.faltaMotivo,
      faltaQuantidade: registro.faltaQuantidade,
      notaTeste: registro.notaTeste,
      media: registro.media,
      mediaFinal: registro.mediaFinal,
      notaProva: registro.notaProva,
      provaData: registro.provaData,
      testeData: registro.testeData,
      notaTrabalho: registro.notaTrabalho,
      trabalhoData: registro.trabalhoData,
      estagioData: registro.estagioData,
      estagioNota: registro.estagioNota,
      totalAulas: registro.totalAulas,
      createdAt: registro.createdAt,
      updatedAt: registro.updatedAt,
    }));
    
    res.status(200).json(registrosFormatados);
  } catch (error) {
    console.error("Erro ao listar registros acadêmicos:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Função para obter um registro acadêmico por ID
const getRegistroAcademicoById = async (req, res) => {
  const { id } = req.params;

  try {
    const registro = await RegistroAcademico.findByPk(id, {
      include: [
        { model: Aluno, as: "alunos" },
        { model: Disciplina, as: "disciplinas" },
        { model: Curso, as: "cursos" },
      ],
    });
    
    if (registro) {
      const registroFormatado = {
        id: registro.id,
        aluno: registro.alunos.nome,
        disciplina: registro.disciplinas.nome,
        curso: registro.cursos.nome,
        faltaData: registro.faltaData,
        faltaMotivo: registro.faltaMotivo,
        faltaQuantidade: registro.faltaQuantidade,
        notaTeste: registro.notaTeste,
        media: registro.media,
        mediaFinal: registro.mediaFinal,
        notaProva: registro.notaProva,
        provaData: registro.provaData,
        testeData: registro.testeData,
        notaTrabalho: registro.notaTrabalho,
        trabalhoData: registro.trabalhoData,
        estagioData: registro.estagioData,
        estagioNota: registro.estagioNota,
        totalAulas: registro.totalAulas,
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

// Função para atualizar um registro acadêmico
const updateRegistroAcademico = async (req, res) => {
  const { id } = req.params;
  const {
    faltaData,
    faltaMotivo,
    faltaQuantidade,
    testeData,
    notaTeste,
    provaData,
    notaProva,
    trabalhoData,
    notaTrabalho,
    estagioData,
    estagioNota,
    totalAulas,
  } = req.body;

  try {
    const registro = await RegistroAcademico.findByPk(id);
    
    if (registro) {
      // Calcula a nova média apenas com as notas preenchidas
      const notas = [
        { nome: 'Teste', valor: notaTeste },
        { nome: 'Prova', valor: notaProva },
        { nome: 'Trabalho', valor: notaTrabalho },
        { nome: 'Estágio', valor: estagioNota }
      ];

      const notasPreenchidas = notas.filter(n => n.valor > 0);
      const novaMedia = notasPreenchidas.length > 0 
        ? notasPreenchidas.reduce((acc, n) => acc + parseFloat(n.valor), 0) / notasPreenchidas.length 
        : 0;
      
      // Calcula a média final usando a média antiga do registro e a nova média
      const mediaFinal = (novaMedia + registro.media) / 2;

      // Tratar os arrays de faltas
      let faltaDataAtualizada = faltaData || [];
      let faltaMotivoAtualizada = faltaMotivo || [];
      let faltaQuantidadeAtualizada = faltaQuantidade || [];

      // Converter para arrays se não forem
      faltaDataAtualizada = Array.isArray(faltaDataAtualizada) ? faltaDataAtualizada : [faltaDataAtualizada].filter(Boolean);
      faltaMotivoAtualizada = Array.isArray(faltaMotivoAtualizada) ? faltaMotivoAtualizada : [faltaMotivoAtualizada].filter(Boolean);
      faltaQuantidadeAtualizada = Array.isArray(faltaQuantidadeAtualizada) ? faltaQuantidadeAtualizada : [faltaQuantidadeAtualizada].filter(Boolean);

      await registro.update({
        faltaData: faltaDataAtualizada,
        faltaMotivo: faltaMotivoAtualizada,
        faltaQuantidade: faltaQuantidadeAtualizada,
        testeData,
        notaTeste,
        provaData,
        notaProva,
        trabalhoData,
        notaTrabalho,
        estagioData,
        estagioNota,
        media: novaMedia,
        mediaFinal,
        totalAulas,
      });
      
      res.status(200).json({ message: "Registro atualizado com sucesso", registro });
    } else {
      res.status(404).json({ error: "Registro não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao atualizar registro acadêmico:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Função para excluir um registro acadêmico
const deleteRegistroAcademico = async (req, res) => {
  const { id } = req.params;

  try {
    const registro = await RegistroAcademico.findByPk(id);
    if (registro) {
      await registro.destroy();
      res.status(200).json({ message: "Registro deletado com sucesso" });
    } else {
      res.status(404).json({ error: "Registro não encontrado" });
      return;
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

// Função para obter registros acadêmicos por ID do aluno
const getRegistrosByAlunoId = async (req, res) => {
  const { alunoId } = req.params;

  try {
    const registros = await RegistroAcademico.findAll({
      where: { alunoId: alunoId },
      include: [
        { model: Aluno, as: "alunos" },
        { model: Disciplina, as: "disciplinas" },
        { model: Curso, as: "cursos" },
      ],
    });

    if (registros.length === 0) {
      return res.status(404).json({ error: "Nenhum registro acadêmico encontrado para este aluno" });
    }

    const registrosFormatados = registros.map((registro) => ({
      id: registro.id,
      alunoId: registro.alunoId,
      disciplinaId: registro.disciplinaId,
      aluno: registro.alunos.nome,
      disciplina: registro.disciplinas.nome,
      curso: registro.cursos.nome,
      faltaData: registro.faltaData,
      faltaMotivo: registro.faltaMotivo,
      faltaQuantidade: registro.faltaQuantidade,
      notaTeste: registro.notaTeste,
      media: registro.media,
      mediaFinal: registro.mediaFinal,
      notaProva: registro.notaProva,
      provaData: registro.provaData,
      testeData: registro.testeData,
      notaTrabalho: registro.notaTrabalho,
      trabalhoData: registro.trabalhoData,
      estagioNota: registro.estagioNota,
      estagioData: registro.estagioData,
      totalAulas: registro.totalAulas,
      createdAt: registro.createdAt,
      updatedAt: registro.updatedAt,
    }));

    res.status(200).json(registrosFormatados);
  } catch (error) {
    console.error("Erro ao buscar registros acadêmicos por ID do aluno:", error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createRegistroAcademico,
  listRegistrosAcademicos,
  getRegistroAcademicoById,
  updateRegistroAcademico,
  deleteRegistroAcademico,
  testeRegistroAcademico,
  getRegistrosByAlunoId,
};