const express = require('express');
const router = express.Router();
const materialEUtensilioController = require('../controllers/MaterialEUtensiliosController');

// router.get('/create',  disciplinaController.create);
router.post('/create', materialEUtensilioController.createMaterialEUtensilio);


module.exports = router;
