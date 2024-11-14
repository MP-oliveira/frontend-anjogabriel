import React, { useState } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import '../AddAluno/AddAluno.css';

const adminSchema = z.object({
  nome: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  telefone: z.string().min(10, { message: "Telefone inválido." }),
  status: z.string().nonempty({ message: "Selecione um status válido." }),
});

const AddAdmin = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [adminData, setAdminData] = useState({
    nome: "",
    email: "",
    telefone: "",
    status: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adminResult = adminSchema.safeParse(adminData);

    if (!adminResult.success) {
      setErrors(adminResult.error.format());
      return;
    }

    try {
      await api.post("/admins/create", adminData);
      navigate("/admins");
    } catch (error) {
      console.error("Erro ao adicionar admin", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAdminData(prev => ({
      ...prev,
      [name]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: undefined,
    }));
  };

  return (
    <div className="addaluno-container">
      <form className="form-addaluno" onSubmit={handleSubmit}>
        <h2>Adicionar Admin</h2>

        <input
          type="text"
          name="nome"
          value={adminData.nome}
          onChange={handleChange}
          placeholder="Nome do Admin"
        />
        {errors.nome && <p className="error_message" style={{ color: "red" }}>{errors.nome._errors?.[0]}</p>}

        <input
          type="email"
          name="email"
          value={adminData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <p className="error_message" style={{ color: "red" }}>{errors.email._errors?.[0]}</p>}

        <input
          type="text"
          name="telefone"
          value={adminData.telefone}
          onChange={handleChange}
          placeholder="Telefone"
        />
        {errors.telefone && <p className="error_message" style={{ color: "red" }}>{errors.telefone._errors?.[0]}</p>}

        <select name="status" value={adminData.status} onChange={handleChange}>
          <option value="">Selecione um status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
        {errors.status && <p className="error_message" style={{ color: "red" }}>{errors.status._errors?.[0]}</p>}

        <button className="aluno-btn" type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default AddAdmin;
