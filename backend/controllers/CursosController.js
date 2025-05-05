const Curso = require("../models/curso");
const { Op } = require('sequelize');

module.exports = class CursosController {
  static async listCursos(req, res) {
    try {
      const cursos = await Curso.findAll();
      res.status(200).json(cursos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar cursos" });
    }
  }

  static async getCursoById(req, res) {
    const { id } = req.params;

    try {
      const curso = await Curso.findByPk(id);
      if (!curso) {
        return res.status(404).json({ error: "Curso não encontrado" });
      }
      res.status(200).json(curso);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar curso" });
    }
  }

  static async createCurso(req, res) {
    const {
      nome,
      carga_horaria,
      duracao,
      valor_total,
      valor_mensal,
      status,
      modalidade,
    } = req.body;

    try {
      const curso = {
        nome,
        carga_horaria,
        duracao,
        valor_total,
        valor_mensal,
        status,
        modalidade,
      };

      const createdCurso = await Curso.create(curso);
      res.status(200).json(createdCurso);
    } catch (error) {
      console.error("Erro ao criar curso:", error);
      res.status(500).json({ error: "Erro ao criar curso" });
    }
  }

  static async updateCurso(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const curso = await Curso.findByPk(id);
      if (!curso) {
        return res.status(404).json({ error: "Curso não encontrado" });
      }

      await curso.update(updatedData);
      res.status(200).json({ message: "Dados do curso atualizados com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar curso" });
    }
  }

  static async deleteCurso(req, res) {
    const { id } = req.params;

    try {
      const curso = await Curso.findByPk(id);
      if (!curso) {
        return res.status(404).json({ error: "Curso não encontrado" });
      }

      await curso.destroy();
      res.status(200).json({ message: "Curso deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar curso" });
    }
  }
};
