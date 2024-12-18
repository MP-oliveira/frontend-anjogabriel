const Admin  = require('../models/admin');
const bcrypt = require('bcrypt');
const supabase = require('../db/supabaseCilent');

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;
    console.log(email, password)

    try {
      // Verifica se o usuário existe no banco de dados
      const usuario = await Admin.findOne({ where: { email } });
      console.log('usuario', usuario);
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verifica se a senha é correta
      const senhaCorreta = await bcrypt.compare(password, usuario.password);
      if (!senhaCorreta) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Autentica com o Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
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
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro no login' });
    }
  }
};
