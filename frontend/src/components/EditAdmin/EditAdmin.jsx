import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import '../AddAluno/AddAluno.css';
import VoltarButton from '../VoltarButton/VoltarButton';
import InputPassword from '../InputPassword/InputPassword';

const adminSchema = z.object({
  nome: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  telefone: z.string().min(10, { message: "Telefone inválido." }),
  status: z.string().nonempty({ message: "Selecione um status válido." }),
});

const EditAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [adminData, setAdminData] = useState({
    nome: "",
    email: "",
    telefone: "",
    status: "",
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await api.get(`/admins/${id}`);
        setAdminData(response.data);
      } catch (error) {
        console.error("Erro ao carregar os dados do admin", error);
        setApiError(
          error.response?.data?.message ||
          'Erro ao carregar os dados do admin. Por favor, tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAdmin();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adminResult = adminSchema.safeParse(adminData);

    if (!adminResult.success) {
      setErrors(adminResult.error.format());
      return;
    }

    try {
      await api.put(`/admins/edit/${id}`, adminData);
      navigate("/admins");
    } catch (error) {
      console.error("Erro ao atualizar admin", error);
      setApiError("Erro ao atualizar admin. Por favor, tente novamente.");
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

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (apiError) {
    return <div className="error">{apiError}</div>;
  }

  return (
    <div className="form-container">
      <form className="form-add" onSubmit={handleSubmit}>
       <VoltarButton url= '/admins'  />
       
        <h2>Editar Admin</h2>

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

        <div className="input-three-columns">
          <input
            type="text"
            name="telefone"
            value={adminData.telefone}
            onChange={handleChange}
            placeholder="Telefone"
            className='admin-input'
          />
          {errors.telefone && <p className="error_message" style={{ color: "red" }}>{errors.telefone._errors?.[0]}</p>}
          <div className="custom-select-wrapper">
            <select className='admin-input' name="status" value={adminData.status} onChange={handleChange}>
              <option value="">Selecione um status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          {errors.status && <p className="error_message" style={{ color: "red" }}>{errors.status._errors?.[0]}</p>}
          <InputPassword
            value={adminData.password}
            onChange={(e) => handleChange({ target: { name: 'password', value: e.target.value } })}
          />
          {errors.password &&
            <p className="error_message" style={{ color: "red" }}>
              {errors.password._errors?.[0]}</p>}
        </div>

        <button className="aluno-btn" type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditAdmin;
