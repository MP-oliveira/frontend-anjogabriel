const express = require('express');
const router = express.Router();
const materialEUtensilioController = require('../controllers/MaterialEUtensiliosController');

// router.get('/create',  disciplinaController.create);
router.get('/', materialEUtensilioController.listMateriais);

// Rota para criar um novo material
router.post('/create', materialEUtensilioController.createMaterialEUtensilio);

// Rota para buscar um curso por ID
router.get('/:id', materialEUtensilioController.getMaterialById);

// Rota para atualizar um curso
router.put('/edit/:id', materialEUtensilioController.updateMaterial);

// Rota para deletar um curso
router.delete('/:id', materialEUtensilioController.deleteMaterial);

module.exports = router;
