import { useState } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import '../AddAluno/AddAluno.css';
import InputPassword from '../InputPassword/InputPassword';
import VoltarButton from "../VoltarButton/VoltarButton";
const professorSchema = z.object({
  nome: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  especialidade: z.string().min(3, { message: "A especialidade precisa ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  telefone: z.string().min(10, { message: "Telefone inválido." }),
  status: z.string().nonempty({ message: "Selecione um status válido." }),
  password: z.string().min(6, { message: "Senha Invalida. A senha de ter pelo menos 6 caracteres." })
});

const AddProfessor = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [professorData, setProfessorData] = useState({
    nome: "",
    especialidade: "",
    email: "",
    telefone: "",
    status: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const professorResult = professorSchema.safeParse(professorData);
    if (!professorResult.success) {
      setErrors(professorResult.error.format());
      return;
    }

    try {
      await api.post("/professores/create", professorData);
      navigate("/professores");
    } catch (error) {
      console.error("Erro ao adicionar professor", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfessorData(prev => ({
      ...prev,
      [name]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: undefined,
    }));
  };

  return (
    <div className="form-container">
      <form className="form-add" onSubmit={handleSubmit}>
        <VoltarButton url="/professores" />
        <h2>Adicionar Professor</h2>
        <input
          type="text"
          name="nome"
          value={professorData.nome}
          onChange={handleChange}
          placeholder="Nome do Professor"
        />
        {errors.nome && <p className="error_message" style={{ color: "red" }}>{errors.nome._errors?.[0]}</p>}
        <div className="input-three-columns">
          <input
            type="text"
            name="especialidade"
            value={professorData.especialidade}
            onChange={handleChange}
            placeholder="Especialidade"
          />
          {errors.especialidade && <p className="error_message" style={{ color: "red" }}>{errors.especialidade._errors?.[0]}</p>}
          <input
            type="email"
            name="email"
            value={professorData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          {errors.email && <p className="error_message" style={{ color: "red" }}>{errors.email._errors?.[0]}</p>}
        </div>
        <div className="input-three-columns">
          <input
            type="text"
            name="telefone"
            value={professorData.telefone}
            onChange={handleChange}
            placeholder="Telefone"
          />
          {errors.telefone && <p className="error_message" style={{ color: "red" }}>{errors.telefone._errors?.[0]}</p>}
          <div className="custom-select-wrapper">
            <select name="status" value={professorData.status} onChange={handleChange}>
              <option value="">Selecione um status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          {errors.status && <p className="error_message" style={{ color: "red" }}>{errors.status._errors?.[0]}</p>}
        </div>
        <InputPassword
          value={professorData.password}
          onChange={(e) => handleChange({ target: { name: 'password', value: e.target.value } })}
        />
        {errors.password &&
          <p className="error_message" style={{ color: "red" }}>
            {errors.password._errors?.[0]}</p>}
        <button className="aluno-btn" type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default AddProfessor;
