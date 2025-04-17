const { createClient } = require("@supabase/supabase-js");

const supabase = require("../db/supabaseCilent");

module.exports = class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;
  
    // Validação básica das entradas
    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }
  
    // Log para debug
    console.log("Tentativa de login para:", email);
  
    try {
      // Autenticar o usuário no Supabase
      console.log("Iniciando autenticação no Supabase...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });
  
      console.log("Resposta da autenticação:", { 
        user: data?.user ? 'existe' : 'null', 
        session: data?.session ? 'existe' : 'null', 
        error: error ? error.message : 'nenhum' 
      });
  
      if (error) {
        console.error("Erro de autenticação:", error.message, error.code);
        return res.status(401).json({ 
          message: "Falha na autenticação", 
          error: error.message,
          code: error.code 
        });
      }
  
      // Verificação adicional de usuário
      if (!data || !data.user) {
        console.error("Dados de usuário ausentes na resposta");
        return res.status(401).json({ message: "Dados de autenticação incompletos" });
      }
  
      // Obter o user_id do usuário autenticado
      const userId = data.user.id;
      console.log("Usuário autenticado com ID:", userId);
      
      // Verificação específica na tabela de admins primeiro
      console.log("Verificando diretamente na tabela admins...");
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select("*");
      
      console.log("Todos os admins na tabela:", adminData);
      console.log("Erro ao buscar admins:", adminError);
      
      // Agora tenta buscar especificamente pelo email
      const { data: adminByEmail, error: adminByEmailError } = await supabase
        .from("admins")
        .select("*")
        .eq("email", email);
      
      console.log(`Buscando admin com email específico '${email}':`, adminByEmail);
      console.log("Erro ao buscar admin por email:", adminByEmailError);
      
      // Verificar formatação do email (case-sensitive)
      console.log("Email usado para login:", email);
      console.log("Email em minúsculas:", email.toLowerCase());
      
      // Tentativa com email em minúsculas
      const { data: adminByLowerEmail, error: adminLowerError } = await supabase
        .from("admins")
        .select("*")
        .eq("email", email.toLowerCase());
      
      console.log("Resultados com email em minúsculas:", adminByLowerEmail);
  
      // Verificar em qual tabela o usuário está presente
      const roles = ["professores", "alunos", "admins"];
      let userRole = null;
      let roleData = null;
      
      for (const role of roles) {
        console.log(`Verificando usuário na tabela ${role}...`);
        
        // Tenta buscar tanto com o email original quanto com o email em minúsculas
        const { data: userData, error: roleError } = await supabase
          .from(role)
          .select("*")
          .or(`email.eq.${email},email.eq.${email.toLowerCase()}`);
        
        if (roleError) {
          console.log(`Erro ao buscar na tabela ${role}:`, roleError.message);
          continue;
        }
        
        if (userData && userData.length > 0) {
          console.log(`Usuário encontrado na tabela ${role}:`, userData);
          userRole = role;
          roleData = userData[0];  // Pega o primeiro resultado
          break;
        }
      }
  
      if (!userRole) {
        console.error("Usuário autenticado mas não encontrado em nenhuma tabela de função");
        return res
          .status(404)
          .json({ message: "Usuário autenticado mas não encontrado em nenhuma tabela de função" });
      }
  
      // Retornar o papel do usuário e o token de sessão
      console.log("Login bem-sucedido para usuário com função:", userRole);
      
      return res.status(200).json({
        message: "Login bem-sucedido",
        role: roleData,
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: userRole
        }
      });
      
    } catch (error) {
      console.error("Erro no servidor durante autenticação:", error);
      return res.status(500).json({ 
        message: "Erro interno no servidor durante autenticação", 
        error: error.message 
      });
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
