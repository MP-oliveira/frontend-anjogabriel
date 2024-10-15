const express = require('express');
const router = express.Router();
const disciplinaController = require('../controllers/DisciplinasController');

// router.get('/create',  disciplinaController.create);
router.post('/create', disciplinaController.createDisciplina);


module.exports = router;
