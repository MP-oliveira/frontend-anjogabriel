const Turno = require("../models/turno");

module.exports = class AuthController {

  static async createTurno(req, res) {
    const {
      nome,
      inicio,
      termino,
    } = req.body;

    /* Verificando se o turno já existe */
    // const checkIfTurnoExists = await Turno.findOne({
    //   where: { cpf: cpf },
    // });
    // if (checkIfTurnoExists) {
    //   res.render("register");
    //   return;
    // }

    try {

      const turno = {
        nome, 
        inicio, 
        termino,
      };

      const createdTurno = await Turno.create(turno);
    } catch (error) {
      console.error(error);
      res.render('register', { error: 'Erro ao criar Turno' });
    }
  }
};
