const Aluno = require("../models/aluno");
// Adicionando o SDK do Supabase no servidor
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://your-project-url.supabase.co'; // Substitua pela URL do seu projeto
const supabaseKey = 'your-anon-key'; // Substitua pela chave do seu projeto
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para fazer o upload dos arquivos no Supabase Storage
async function uploadFileToSupabase(file, bucketName) {
  const { data, error } = await supabase.storage.from(bucketName).upload(file.name, file.data);
  if (error) throw error;
  return data.path;
}
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
      numero_casa,
      bairro,
      telefone_residencial,
      celular,
      telefone_trabalho,
      cep,
      cidade,
      estado,
      curso,
      turno
      // Removido foto_url e historico_url dos dados recebidos
    } = req.body;

    /* Verificando se o aluno já existe */
    const checkIfAlunoExists = await Aluno.findOne({
      where: { cpf: cpf },
    });
    if (checkIfAlunoExists) {
      res.render("register");
      return;
    }

    try {
      // Upload da foto no Supabase Storage (Se a foto for enviada)
      let foto_url = "";
      if (req.files && req.files.foto_url) {
        const foto = req.files.foto_url;
        const fotoPath = await uploadFileToSupabase(foto, 'fotos-alunos'); // Define o bucket 'fotos-alunos'
        foto_url = `${supabaseUrl}/storage/v1/object/public/fotos-alunos/${fotoPath}`;
      }

      // Upload do histórico no Supabase Storage (Se o histórico for enviado)
      let historico_url = "";
      if (req.files && req.files.historico) {
        const historico = req.files.historico;
        const historicoPath = await uploadFileToSupabase(historico, 'historico-alunos'); // Define o bucket 'historico-alunos'
        historico_url = `${supabaseUrl}/storage/v1/object/public/historico-alunos/${historicoPath}`;
      }

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
        numero_casa,
        bairro,
        telefone_residencial,
        celular,
        telefone_trabalho,
        cep,
        cidade,
        estado,
        curso,
        turno,
        foto_url, // Adicionando URL da foto no objeto aluno
        historico_url // Adicionando URL do histórico no objeto aluno
      };

      const createdUser = await Aluno.create(aluno);
      res.redirect('/');
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
