const Disciplina = require("../models/disciplina");

module.exports = class DisciplinasController {
  static async listDisciplinas(req, res) {
    try {
      const disciplinas = await Disciplina.findAll();
      res.status(200).json(disciplinas)
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar disciplinas" });
    }
  }

  static async getDisciplinaById(req, res) {
    const { id } = req.params

    try {
      const disciplina = await Disciplina.findByPk(id);
      if (!disciplina) {
        return res.status(404).json({ message: "Disciplina não encontrada" });
      }
      res.status(200).json(disciplina)
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar disciplina" });
    }
  }

  static async createDisciplina(req, res) {
    const {
      nome,
      modulo,
      carga_horaria,
      carga_horaria_estagio,
      estagio_supervisionado,
      duracao,
      curso_id,
      professor_id,
      horario_inicio,
      horario_fim,
      dias_semana,
    } = req.body

    try {
      const disciplina = {
        nome,
        modulo,
        carga_horaria,
        carga_horaria_estagio,
        estagio_supervisionado,
        duracao,
        curso_id,
        professor_id,
        horario_inicio,
        horario_fim,
        dias_semana: Array.isArray(dias_semana) ? dias_semana.join(',') : dias_semana,
      };
      console.log('disciplina', disciplina)
      const createDisciplina = await Disciplina.create(disciplina)
      res.status(200).json(createDisciplina)
    } catch (error) {
      console.error("Erro ao criar disciplina", error);
      res.status(500).json({ message: "Erro ao criar disciplina", error: error.message, stack: error.stack });
    }
  }

  static async updateDisciplina(req, res) {
    const { id } = req.params
    const updatedData = { ...req.body };
    if (updatedData.dias_semana) {
      updatedData.dias_semana = Array.isArray(updatedData.dias_semana)
        ? updatedData.dias_semana.join(',')
        : updatedData.dias_semana;
    }

    try {
      const disciplina = await Disciplina.findByPk(id)
      if (!disciplina) {
        return res.status(404).json({ message: "Disciplina não encontrada" });
      }
      await disciplina.update(updatedData)
      res.status(200).json({ message: "Dados da disciplina atualizados com sucesso" })
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar disciplina", details: error.message, stack: error.stack });
    }
  }

  static async deleteDisciplina(req, res) {
    const { id } = req.params
    try {
      const disciplina = await Disciplina.findByPk(id)
      if (!disciplina) {
        return req.status(404).json({ error: "Disciplina não encontrada" })
      }

      await disciplina.destroy()
      res.status(200).json({ message: "Disciplina deletada com sucesso" })
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar disciplina", details: error.message, stack: error.stack });
    }
  }
}