import React, { useState } from 'react';
import { useUser } from '../../context/UseContext'; // Importar o contexto
import './Login.css';

function Login() {
  const  {setUser}  = useUser(); // Obter o setter do estado do usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const { message, role, token} = await response.json();
      // console.log(response, 'response front')
      if (response.ok) {
        // console.log(response, 'response ok', role)
        setUser(role); // Atualizar o estado global com os dados do usuário
        // console.log('ok', message, role.role)

      } else {
        setError(data.message || 'Erro no login');
      }
    } catch (err) {
      setError('Erro de conexão');
    }
  };

  const handleForgotPassword = () => {
    // Adicionar lógica de recuperação de senha
    alert('Funcionalidade de recuperação de senha em desenvolvimento');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">Entrar</button>
        <button 
          type="button" 
          onClick={handleForgotPassword} 
          className="forgot-password"
        >
          Esqueceu a senha?
        </button>
      </form>
    </div>
  );
}

export default Login;