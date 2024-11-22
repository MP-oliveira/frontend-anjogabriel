import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { 
        email, 
        password, 
        role 
      });

      // Salvar token e informações do usuário
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirecionar baseado no papel
      switch(role) {
        case 'admin':
          window.location.href = '/admin/dashboard';
          break;
        case 'professor':
          window.location.href = '/professor/dashboard';
          break;
        case 'aluno':
          window.location.href = '/aluno/dashboard';
          break;
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Erro no login');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required 
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        required 
      />
      <select 
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      >
        <option value="">Selecione seu papel</option>
        <option value="admin">Admin</option>
        <option value="professor">Professor</option>
        <option value="aluno">Aluno</option>
      </select>
      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;
