const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

 module.exports = class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const { data: profileData, error: profileError } = await supabase
        .from('Users')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (profileError) {
        return res.status(500).json({ message: 'Erro ao buscar perfil' });
      }

      res.status(200).json({
        message: 'Login bem-sucedido',
        role: profileData.role,
        token: data.session.access_token
      });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor' });
    }
  }

  static async logout(req, res) {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return res.status(500).json({ message: 'Erro ao fazer logout' });
      }

      res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor' });
    }
  }
  static async esqueciASenha(req, res) {
    const { email } = req.body;

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/esqueciasenha'
      });
  
      if (error) {
        return res.status(400).json({ message: error.message });
      }
  
      res.status(200).json({ message: 'Link de recuperação enviado' });
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

