import { useState } from 'react';
import './EsqueciASenha.css';

function EsqueciASenha() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/esqueciasenha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Link de recuperação enviado para seu email');
      } else {
        setError(data.message || 'Erro ao enviar link de recuperação');
      }
    } catch (err) {
      console.error('Erro ao enviar link de recuperação:', err);
      setError('Erro de conexão');
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleForgotPassword} className="forgot-password-form">
        <h2>Recuperar Senha</h2>
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
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="recover-button">
          Enviar Link de Recuperação
        </button>
      </form>
    </div>
  );
}

export default EsqueciASenha;