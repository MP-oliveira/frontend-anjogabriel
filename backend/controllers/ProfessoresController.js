const Professor = require("../models/professor");
const { Op } = require('sequelize');

module.exports = class ProfessoresController {
  static async listProfessores(req, res) {
    try {
      const professores = await Professor.findAll();
      res.status(200).json(professores);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar professores' });
    }
  }

  static async getProfessorByName(req, res) {
    const { nome } = req.query;
    
    console.log(`Nome recebido: ${nome}`);

    try {
      const professores = await Professor.findAll({
        where: { nome: { [Op.like]: `%${nome}%` } },
      });
  
      console.log(`Professores encontrados: ${JSON.stringify(professores)}`);
  
      if (professores.length === 0) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }
  
      res.status(200).json(professores);
    } catch (error) {
      console.error('Erro ao buscar professor:', error);
      res.status(500).json({ error: 'Erro ao buscar professor' });
    }
  }

  static async createProfessor(req, res) {
    const {
      nome,
      email,
      rg,
      cpf,
      celular,
    } = req.body;

    try {
      const professor = {
        nome,
        email,
        rg,
        cpf,
        celular,
      };

      const professorLowercase = Object.fromEntries(
        Object.entries(professor).map(([key, value]) => [key, typeof value === 'string' ? value.toLowerCase() : value])
      );

      const createdProfessor = await Professor.create(professorLowercase);
      res.status(201).json(createdProfessor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar professor' });
    }
  }

  static async getProfessorById(req, res) {
    const { id } = req.params;
    
    try {
      const professor = await Professor.findByPk(id);
      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }
      res.status(200).json(professor);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar professor' });
    }
  }

  static async updateProfessor(req, res) {
    const { id } = req.params;
    const updatedData = req.body;
    
    try {
      const professor = await Professor.findByPk(id);
      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      await professor.update(updatedData);
      res.status(200).json({ message: 'Professor atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar professor' });
    }
  }

  static async deleteProfessor(req, res) {
    const { id } = req.params;

    try {
      const professor = await Professor.findByPk(id);
      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      await professor.destroy();
      res.status(200).json({ message: 'Professor deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar professor' });
    }
  }
};