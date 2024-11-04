const Professores = require("../models/professor");

module.exports = class ProfessoressController {
  static async listProfessores(req, res) {
    try {
      const professores = await Professores.findAll();
      res.status(200).json(professores);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar professoress" });
    }
  }

  static async getProfessorById(req, res) {
    const { id } = req.params;

    try {
      const professores = await Professor.findByPk(id);
      if (!professor) {
        return res.status(404).json({ error: "Professor não encontrado" });
      }
      res.status(200).json(professor);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar professor" });
    }
  }

  static async createProfessor(req, res) {
    const {
      nome,
      email,
      cpf,
      telefone,
      status,
      disciplinas,
    } = req.body;

    try {
      const professor = {
        nome,
        email,
        cpf,
        telefone,
        status,
        disciplinas,
      };

      const createdProfessor = await Professor.create(professor);
      res.status(200).json(createdProfessor);
    } catch (error) {
      console.error("Erro ao criar professor:", error);
      res.status(500).json({ error: "Erro ao criar professor" });
    }
  }

  static async updateProfessor(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const professor = await Professor.findByPk(id);
      if (!professor) {
        return res.status(404).json({ error: "Professor não encontrado" });
      }

      await professor.update(updatedData);
      res.status(200).json({ message: "Dados do professor atualizados com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar professor" });
    }
  }

  static async deleteProfessor(req, res) {
    const { id } = req.params;

    try {
      const professor = await Professor.findByPk(id);
      if (!professor) {
        return res.status(404).json({ error: "Professor não encontrado" });
      }

      await professor.destroy();
      res.status(200).json({ message: "Professor deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar professor" });
    }
  }
};
