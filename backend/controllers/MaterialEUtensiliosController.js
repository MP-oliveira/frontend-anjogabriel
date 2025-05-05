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
  
    const CATEGORIAS_VALIDAS = [
      'Material Hospitalar / Material Técnico',
      'Material Didático / Escolar',
      'Material de Escritório / Administrativo',
      'Material de Limpeza e Higiene',
      'Equipamentos de Manutenção'
    ];
  
    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
      return res.status(400).json({
        error: `Categoria inválida. As categorias válidas são: ${CATEGORIAS_VALIDAS.join(', ')}`
      });
    }
  
    try {
      if (!ultimo_pedido || isNaN(new Date(ultimo_pedido).getTime())) {
        return res.status(400).json({
          error: 'Data do último pedido inválida. Use o formato YYYY-MM-DD'
        });
      }

      const dataFormatada = new Date(ultimo_pedido).toISOString().split('T')[0];

      const material = {
        nome,
        categoria,
        quantidade,
        unidade,
        valor_unitario,
        ultimo_pedido: dataFormatada,
        status_material,
      };
  
      const createdMaterial = await MaterialEUtensilio.create(material);
      res.status(200).json(createdMaterial);
    } catch (error) {
      console.error('Erro ao criar material', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          error: 'Dados inválidos. Verifique os campos e tente novamente.',
          details: error.errors.map(err => err.message)
        });
      }
      
      res.status(500).json({ error: 'Erro ao criar material' });
    }
  }
  
  static async updateMaterial(req, res) {
    const { id } = req.params;
    const updatedData = req.body;
  
    const CATEGORIAS_VALIDAS = [
      'Material Hospitalar / Material Técnico',
      'Material Didático / Escolar',
      'Material de Escritório / Administrativo',
      'Material de Limpeza e Higiene',
      'Equipamentos de Manutenção'
    ];
  
    if (updatedData.categoria && !CATEGORIAS_VALIDAS.includes(updatedData.categoria)) {
      return res.status(400).json({
        error: `Categoria inválida. As categorias válidas são: ${CATEGORIAS_VALIDAS.join(', ')}`
      });
    }
  
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