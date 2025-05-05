const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/CursosController');

// Rota para listar todos os cursos
router.get('/', cursoController.listCursos);

// Rota para criar um novo curso
router.post('/create', cursoController.createCurso);

// Rota para buscar um curso por ID
router.get('/:id', cursoController.getCursoById);

// Rota para atualizar um curso
router.put('/edit/:id', cursoController.updateCurso);

// Rota para deletar um curso
router.delete('/:id', cursoController.deleteCurso);

module.exports = router;
