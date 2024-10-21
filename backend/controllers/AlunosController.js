const Aluno = require("../models/aluno");

module.exports = class AuthController {
  // static login(req, res) {
  // 	res.render("auth/login");
  // }

  // static async loginPost(req, res) {
  // 	const cpf = req.body.cpf;

  // 	// find user?
  // 	const user = await Aluno.findOne({ where: { cpf: cpf } });

  // 	if (!user) {
  // 		req.flash("message", "Usuário não encontrado");
  // 		res.render("auth/register", {user});
  // 		return;
  // 	}

  // 	// check if password match
  // 	const passwordMatch = bcrypt.compareSync(password, user.password);

  // 	if (!passwordMatch) {
  // 		req.flash("message", "Senha incorreta");
  // 		res.render("auth/login");
  //           return
  // 	}

  // 	// initialize session
  // 	req.session.userid = user.id;

  // 	req.flash("message", "Autenticação realizada com sucesso!");

  // 	/* Salvando a sessão */
  // 	req.session.save(() => {
  // 		res.redirect("/");
  // 	});
  // }

  static create(req, res) {
    res.render("register");
  }

  static async createAluno(req, res) {
    const {
      nome,
      email,
      data_nascimento,
      estado_civil,
      grupo_sanguineo,
      naturalidade,
      nacionalidade,
      pai,
      mae,
      rg,
      orgao_expedidor_rg,
      data_expedicao_rg,
      cpf,
      endereco,
      n_casa,
      bairro,
      tel_res,
      celular,
      tel_trabalho,
      cep,
      cidade,
      estado,
      curso,
      turno,
      data_matricula,
      data_termino_curso,
      
    } = req.body;

    /* Verificando se o aluno já existe */
    // const checkIfAlunoExists = await Aluno.findOne({
    //   where: { cpf: cpf },
    // });
    // if (checkIfAlunoExists) {
    //   res.render("register");
    //   return;
    // }

    try {


      const aluno = {
        nome,
        email,
        data_nascimento,
        estado_civil,
        grupo_sanguineo,
        naturalidade,
        nacionalidade,
        pai,
        mae,
        rg,
        orgao_expedidor_rg,
        data_expedicao_rg,
        cpf,
        endereco,
        n_casa,
        bairro,
        tel_res,
        celular,
        tel_trabalho,
        cep,
        cidade,
        estado,
        curso,
        turno,
        data_matricula,
        data_termino_curso,
      };

      console.log(aluno, nome)
      const createdUser = await Aluno.create(aluno);
    } catch (error) {
      console.error(error);
      res.render('register', { error: 'Erro ao criar aluno' });
    }
  }

  static async logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
