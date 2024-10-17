const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/CursosController');

// router.get('/create',  cursoController.create);
router.post('/create', cursoController.createCurso);


module.exports = router;
