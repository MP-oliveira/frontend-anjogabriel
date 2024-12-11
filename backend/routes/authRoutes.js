const router = require('express').Router();
const authController = require('../controllers/AuthController')

router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/esqueciasenha', authController.esqueciASenha)
 

module.exports = router;