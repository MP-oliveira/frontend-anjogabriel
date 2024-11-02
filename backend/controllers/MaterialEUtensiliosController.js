const MaterialEUtensilio = require("../models/materialEUtensilio");
const { Op } = require('sequelize');

module.exports = class MaterialEUtensiliosController {
  static async listMateriais(req, res) {
    try {
      const materiais = await MaterialEUtensilio.findAll();
      res.status(200).json(materiais);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar materiais' });
    }
  }

  static async getMaterialByName(req, res) {
    const { nome } = req.query;
    
    console.log(`Nome recebido: ${nome}`);

    try {
      const materiais = await MaterialEUtensilio.findAll({
        where: { nome: { [Op.like]: `%${nome}%` } },
      });
  
      console.log(`Materiais encontrados: ${JSON.stringify(materiais)}`);
  
      if (materiais.length === 0) {
        return res.status(404).json({ error: 'Material não encontrado' });
      }
  
      res.status(200).json(materiais);
    } catch (error) {
      console.error('Erro ao buscar material:', error);
      res.status(500).json({ error: 'Erro ao buscar material' });
    }
  }

  static async createMaterialEUtensilio(req, res) {
    const {
      nome,
      categoria,
      quantidade,
      unidade,
      valor_unitario,
      ultimo_pedido,
      status_material,
    } = req.body;

    try {
      const material = {
        nome,
        categoria,
        quantidade,
        unidade,
        valor_unitario,
        ultimo_pedido,
        status_material,
      };

      const materialLowercase = Object.fromEntries(
        Object.entries(material).map(([key, value]) => [key, typeof value === 'string' ? value.toLowerCase() : value])
      );

      const createdMaterial = await MaterialEUtensilio.create(materialLowercase);
      res.status(201).json(createdMaterial);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar material' });
    }
  }

  static async getMaterialById(req, res) {
    const { id } = req.params;
    
    try {
      const material = await MaterialEUtensilio.findByPk(id);
      if (!material) {
        return res.status(404).json({ error: 'Material não encontrado' });
      }
      res.status(200).json(material);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar material' });
    }
  }

  static async updateMaterial(req, res) {
    const { id } = req.params;
    const updatedData = req.body;
    
    try {
      const material = await MaterialEUtensilio.findByPk(id);
      if (!material) {
        return res.status(404).json({ error: 'Material não encontrado' });
      }

      await material.update(updatedData);
      res.status(200).json({ message: 'Material atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar material' });
    }
  }

  static async deleteMaterial(req, res) {
    const { id } = req.params;

    try {
      const material = await MaterialEUtensilio.findByPk(id);
      if (!material) {
        return res.status(404).json({ error: 'Material não encontrado' });
      }

      await material.destroy();
      res.status(200).json({ message: 'Material deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar material' });
    }
  }
};