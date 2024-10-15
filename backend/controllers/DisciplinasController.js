const Disciplina = require("../models/disciplina");

module.exports = class AuthController {

  static async createDisciplina(req, res) {
    const {
      nome,
      carga_horaria_semestral,
      estagio
    } = req.body;

    /* Verificando se o aluno já existe */
    // const checkIfDisciplinaExists = await Disciplina.findOne({
    //   where: { cpf: cpf },
    // });
    // if (checkIfDisciplinaExists) {
    //   res.render("register");
    //   return;
    // }

    try {

      const disciplina = {
        nome,
        carga_horaria_semestral,
        estagio
      };

      const createdDisciplina = await Disciplina.create(disciplina);
    } catch (error) {
      console.error(error);
      res.render('register', { error: 'Erro ao criar disciplina' });
    }
  }
};
