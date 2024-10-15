const Professor = require("../models/professor");

module.exports = class AuthController {

  static async createProfessor(req, res) {
    const {
      nome,
      email,
      rg,
      cpf,
      celular,
    
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

      const professor = {
        nome,
        email,
        rg,
        cpf,
        celular,  
      };

      const createdProfessor = await Professor.create(professor);
    } catch (error) {
      console.error(error);
      res.render('register', { error: 'Erro ao criar Professor' });
    }
  }
};
