import { useState, useContext } from "react";
import api from "../../services/api";
import "./Login.css";
import { UserContext } from "../../context/UseContext";



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { setUser } = useContext(UserContext);


  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Iniciando login..."); // Log de depuração

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        role,
      });

      // Salvar token e informações do usuário
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      const newUser = JSON.stringify(localStorage.getItem("user"));
      console.log("newUseer", newUser);
      setUser(JSON.stringify(localStorage.getItem("user"))); // Defina o usuário no contexto
      // Redirecionar baseado no papel
      switch (role) {
        case "admin":
          window.location.href = "/";
          break;
        case "professor":
          window.location.href = "/";
          break;
      }
    } catch (error) {
      console.error("Erro no login:", error); // Log de erro detalhado
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
          className="form-input"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="form-input"
        />
        <div className="custom-select-wrapper">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="form-input"
          >
            <option value="">Selecione seu papel</option>
            <option value="admin">Admin</option>
            <option value="professor">Professor</option>
          </select>
        </div>
        <button type="submit" className="form-input aluno-btn">
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
