const Diploma = require("../models/diploma");

module.exports = class AuthController {

  static async createDiploma(req, res) {
    const {
      nome,
    } = req.body;

    /* Verificando se o diploma já existe */
    // const checkIfDiplomaExists = await Diploma.findOne({
    //   where: { cpf: cpf },
    // });
    // if (checkIfDiplomaExists) {
    //   res.render("register");
    //   return;
    // }

    try {

      const diploma = {
        nome,
      };

      const createdDiploma = await Diploma.create(diploma);
    } catch (error) {
      console.error(error);
      res.render('register', { error: 'Erro ao criar Diploma' });
    }
  }
};
