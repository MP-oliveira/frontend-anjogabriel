const express = require('express');
const router = express.Router();
const registroAcademicoController = require('../controllers/RegistroAcademicoController');

// Rotas para Registro Acadêmico
router.post('/create', registroAcademicoController.createRegistroAcademico);
router.get('/aluno/:alunoId', registroAcademicoController.getRegistrosByAlunoId);
router.get('/:id', registroAcademicoController.getRegistroAcademicoById);
router.get('/', registroAcademicoController.listRegistrosAcademicos);
router.put('/edit/:id', registroAcademicoController.updateRegistroAcademico);
router.delete('/delete/:id', registroAcademicoController.deleteRegistroAcademico);
router.get('/teste', registroAcademicoController.testeRegistroAcademico);



module.exports = router;