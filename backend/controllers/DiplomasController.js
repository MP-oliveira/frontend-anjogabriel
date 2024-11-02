const Diploma = require("../models/diploma");
const { Op } = require('sequelize');

module.exports = class DiplomasController {
  static async listDiplomas(req, res) {
    try {
      const diplomas = await Diploma.findAll();
      res.status(200).json(diplomas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar diplomas' });
    }
  }

  static async getDiplomaByName(req, res) {
    const { nome } = req.query;
    
    console.log(`Nome recebido: ${nome}`);

    try {
      const diplomas = await Diploma.findAll({
        where: { nome: { [Op.like]: `%${nome}%` } },
      });
  
      console.log(`Diplomas encontrados: ${JSON.stringify(diplomas)}`);
  
      if (diplomas.length === 0) {
        return res.status(404).json({ error: 'Diploma não encontrado' });
      }
  
      res.status(200).json(diplomas);
    } catch (error) {
      console.error('Erro ao buscar diploma:', error);
      res.status(500).json({ error: 'Erro ao buscar diploma' });
    }
  }

  static async createDiploma(req, res) {
    const {
      nome,
    } = req.body;

    try {
      const diploma = {
        nome,
      };

      const diplomaLowercase = Object.fromEntries(
        Object.entries(diploma).map(([key, value]) => [key, typeof value === 'string' ? value.toLowerCase() : value])
      );

      const createdDiploma = await Diploma.create(diplomaLowercase);
      res.status(201).json(createdDiploma);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar diploma' });
    }
  }

  static async getDiplomaById(req, res) {
    const { id } = req.params;
    
    try {
      const diploma = await Diploma.findByPk(id);
      if (!diploma) {
        return res.status(404).json({ error: 'Diploma não encontrado' });
      }
      res.status(200).json(diploma);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar diploma' });
    }
  }

  static async updateDiploma(req, res) {
    const { id } = req.params;
    const updatedData = req.body;
    
    try {
      const diploma = await Diploma.findByPk(id);
      if (!diploma) {
        return res.status(404).json({ error: 'Diploma não encontrado' });
      }

      await diploma.update(updatedData);
      res.status(200).json({ message: 'Diploma atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar diploma' });
    }
  }

  static async deleteDiploma(req, res) {
    const { id } = req.params;

    try {
      const diploma = await Diploma.findByPk(id);
      if (!diploma) {
        return res.status(404).json({ error: 'Diploma não encontrado' });
      }

      await diploma.destroy();
      res.status(200).json({ message: 'Diploma deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar diploma' });
    }
  }
};