const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/TurnosController');


router.post('/create', turnoController.createTurno);

router.get('/', turnoController.listTurnos);

router.get('/:id', turnoController.getTurnoById);




module.exports = router;
