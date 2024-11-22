const { Login } = require('../models/login');
const bcrypt = require('bcrypt');
const supabase = require('../db/supabaseCilent');

module.exports = {
  async login(req, res) {
    const { email, senha, role } = req.body;

    try {
      // Verifica se o usuário existe no banco de dados
      const usuario = await Login.findOne({ where: { email } });

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verifica se a senha é correta
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verifica se o papel corresponde
      if (usuario.role !== role) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }

      // Autentica com o Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
      });

      if (error) {
        return res.status(401).json({ error: 'Erro na autenticação com Supabase' });
      }

      res.json({
        token: data.session.access_token,
        user: {
          id: usuario.id,
          email: usuario.email,
          role: usuario.role
        }
      });

    } catch (error) {
      res.status(500).json({ error: 'Erro no login' });
    }
  }
};
