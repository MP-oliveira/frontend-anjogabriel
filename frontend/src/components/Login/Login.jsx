import React, { useState } from 'react';
import './Login.css';

function Login() {
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

      const data = await response.json();

      // if (response.ok) {
      //   // Redirecionar baseado na role
      //   switch(data.role) {
      //     case 'professor':
      //       window.location.href = '/professor/dashboard';
      //       break;
      //     case 'aluno':
      //       window.location.href = '/aluno/dashboard';
      //       break;
      //     case 'admin':
      //       window.location.href = '/admin/dashboard';
      //       break;
      //     default:
      //       window.location.href = '/dashboard';
      //   }
      // } else {
      //   setError(data.message || 'Erro no login');
      // }
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