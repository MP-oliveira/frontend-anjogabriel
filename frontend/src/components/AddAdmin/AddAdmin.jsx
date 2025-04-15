import { useState } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import "../AddAluno/AddAluno.css";
import VoltarButton from "../VoltarButton/VoltarButton";
import InputPassword from "../InputPassword/InputPassword";

const adminSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  telefone: z.string().min(10, { message: "Telefone inválido." }),
  role: z.string().nonempty({ message: "Selecione um status válido." }),
  password: z
    .string()
    .min(6, {
      message: "Senha Invalida. A senha de ter pelo menos 6 caracteres. ",
    }),
});

const AddAdmin = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [adminData, setAdminData] = useState({
    nome: "",
    email: "",
    telefone: "",
    role: "",
    password: "",
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

    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  return (
    <div className="form-container">
      <form className="form-add" onSubmit={handleSubmit}>
        <VoltarButton url="/admins" />

        <h2>Adicionar Admin</h2>
        <input
          type="text"
          name="nome"
          value={adminData.nome}
          onChange={handleChange}
          placeholder="Nome do Admin"
        />
        {errors.nome && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.nome._errors?.[0]}
          </p>
        )}

        <input
          type="email"
          name="email"
          value={adminData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.email._errors?.[0]}
          </p>
        )}
        <div className="input-three-columns">
          <input
            type="text"
            name="telefone"
            value={adminData.telefone}
            onChange={handleChange}
            placeholder="Telefone"
          />
          {errors.telefone && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.telefone._errors?.[0]}
            </p>
          )}
          {/* 
          <InputPassword
            value={adminData.password}
            onChange={(e) => handleChange({ target: { name: 'password', value: e.target.value } })}
          /> */}
          <input
            type="password"
            name="password"
            value={adminData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          {errors.password && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.password._errors?.[0]}
            </p>
          )}

          <div className="custom-select-wrapper">
            <select name="role" value={adminData.role} onChange={handleChange}>
              <option value="">Selecione um status</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        {errors.role && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.role._errors?.[0]}
          </p>
        )}

        <button className="aluno-btn" type="submit">
          Salvar
        </button>
      </form>
    </div>
  );
};

export default AddAdmin;
