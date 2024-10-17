const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/TurnosController');


router.post('/create', turnoController.createTurno);


module.exports = router;
