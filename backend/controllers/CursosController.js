const Curso = require("../models/curso");

module.exports = class AuthController {

  static async createCurso(req, res) {
    const {
      nome,
      duracao,
      carga_horaria,
      estagio_supervisionado,
    } = req.body;

    /* Verificando se o curso já existe */
    // const checkIfCursoExists = await Curso.findOne({
    //   where: { cpf: cpf },
    // });
    // if (checkIfCursoExists) {
    //   res.render("register");
    //   return;
    // }

    try {

      const curso = {
        nome,
        duracao,
        carga_horaria,
        estagio_supervisionado
      };

      const createdCurso = await Curso.create(curso);
    } catch (error) {
      console.error(error);
      res.render('register', { error: 'Erro ao criar curso' });
    }
  }
};
