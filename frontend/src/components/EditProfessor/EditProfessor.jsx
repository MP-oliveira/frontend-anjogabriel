import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import '../AddAluno/AddAluno.css';

const professorSchema = z.object({
  nome: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  especialidade: z.string().min(3, { message: "A especialidade precisa ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  telefone: z.string().min(10, { message: "Telefone inválido." }),
  status: z.string().nonempty({ message: "Selecione um status válido." }),
});

const EditProfessor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [professorData, setProfessorData] = useState({
    nome: "",
    especialidade: "",
    email: "",
    telefone: "",
    status: "",
  });

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        const response = await api.get(`/professores/${id}`);
        setProfessorData(response.data);
      } catch (error) {
        console.error("Erro ao carregar os dados do professor", error);
        setApiError(
          error.response?.data?.message ||
          'Erro ao carregar os dados do professor. Por favor, tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfessor();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const professorResult = professorSchema.safeParse(professorData);

    if (!professorResult.success) {
      setErrors(professorResult.error.format());
      return;
    }

    try {
      await api.put(`/professores/edit/${id}`, professorData);
      navigate("/professores");
    } catch (error) {
      console.error("Erro ao atualizar professor", error);
      setApiError("Erro ao atualizar professor. Por favor, tente novamente.");
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

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (apiError) {
    return <div className="error">{apiError}</div>;
  }

  return (
    <div className="addaluno-container">
      <form className="form-addaluno" onSubmit={handleSubmit}>
        <h2>Editar Professor</h2>

        <input
          type="text"
          name="nome"
          value={professorData.nome}
          onChange={handleChange}
          placeholder="Nome do Professor"
        />
        {errors.nome && <p className="error_message" style={{ color: "red" }}>{errors.nome._errors?.[0]}</p>}

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

        <input
          type="text"
          name="telefone"
          value={professorData.telefone}
          onChange={handleChange}
          placeholder="Telefone"
        />
        {errors.telefone && <p className="error_message" style={{ color: "red" }}>{errors.telefone._errors?.[0]}</p>}

        <select name="status" value={professorData.status} onChange={handleChange}>
          <option value="">Selecione um status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
        {errors.status && <p className="error_message" style={{ color: "red" }}>{errors.status._errors?.[0]}</p>}

        <button className="professor-btn" type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditProfessor;
