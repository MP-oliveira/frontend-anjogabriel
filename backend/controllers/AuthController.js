const { createClient } = require("@supabase/supabase-js");

const supabase = require("../db/supabaseCilent");

module.exports = class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;

    try {
      // Autenticar o usuário no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ message: "Credenciais inválidas", error: error.message });
      }

      // Obter o user_id do usuário autenticado
      const userId = data.user.id;
      console.log(data)


      // Verificar em qual tabela o user_id está presente
      const roles = ["professores", "alunos", "admins"];
      let userRole = null;
      let roler = null;
      
      for (const role of roles) {
        const { data: roleData, error: roleError } = await supabase
        .from(role) // Acessa a tabela dinâmica
        .select("*") // Seleciona todos os campos (ou apenas o necessário)
        .eq("email", email)
        .single(); // Retorna apenas um registro
        
        roler = roleData
        if (!roleError && roleData) {
          userRole = role;
          break; // Interrompe o loop quando encontrar o usuário
        }
      }

      if (!userRole) {
        return res
          .status(404)
          .json({ message: "Usuário não encontrado em nenhuma tabela" });
      }

      // Retornar o papel do usuário e o token de sessão
      res.status(200).json({
        message: "Login bem-sucedido",
        role: roler,
        token: data.session.access_token,
      });
      
    } catch (error) {
      console.error("Erro no servidor:", error);
      res.status(500).json({ message: "Erro no servidor" });
    }
  }

  static async logout(req, res) {

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }

      res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor" });
    }
  }
  
  static async esqueciASenha(req, res) {
    const { email } = req.body;

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/esqueciasenha",
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.status(200).json({ message: "Link de recuperação enviado" });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
};
