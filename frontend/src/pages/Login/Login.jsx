import React, { useState } from "react";
import api from "../../services/api";
import "./Login.css";
import { useUser } from '../../context/UseContext'; // Importar o contexto

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { setUser } = useUser(); // Obter o setter do estado do usuário

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Iniciando login...'); // Log de depuração
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        role,
      });
      console.log('response data', response.data)

      // Salvar token e informações do usuário
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(JSON.stringify(response.data)); // Defina o usuário no contexto
      // Redirecionar baseado no papel
      switch (role) {
        case "admin":
          window.location.href = "/";
          break;
        case "professor":
          window.location.href = "/professor/dashboard";
          break;
        case "aluno":
          window.location.href = "/aluno/dashboard";
          break;
      }
    } catch (error) {
      console.error('Erro no login:', error); // Log de erro detalhado
      alert(error.response?.data?.error || "Erro no login");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
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
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Selecione seu papel</option>
          <option value="admin">Admin</option>
          <option value="professor">Professor</option>
          <option value="aluno">Aluno</option>
        </select>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
