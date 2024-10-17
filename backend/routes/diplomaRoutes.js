const express = require('express');
const router = express.Router();
const diplomaController = require('../controllers/DiplomasController');


router.post('/create', diplomaController.createDiploma);


module.exports = router;
