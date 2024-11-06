const express = require('express');
const router = express.Router();
const disciplinaController = require('../controllers/DisciplinasController');
const upload = require('../db/upload')


// Rota para listar as disciplinas
 router.get('/',  disciplinaController.listDisciplinas)

// Rota para criar uma nova Disciplina
router.post('/create', disciplinaController.createDisciplina)

//Rota para buscar uma disciplina por ID
router.get('/:id', disciplinaController.getDisciplinaById)

// Rota para atualizar uma disciplina 
router.put('/edit/:id',disciplinaController.updateDisciplina)

// Rota para deletar uma disciplina
router.delete('/:id', disciplinaController.deleteDisciplina);


module.exports = router;
