import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import '../AddAluno/AddAluno.css';

const registroAcademicoSchema = z.object({
  alunoId: z.string().nonempty({ message: "Selecione um aluno válido." }),
  disciplinaId: z.string().nonempty({ message: "Selecione uma disciplina válida." }),
  faltaData: z.string().optional(),
  faltaMotivo: z.string().optional(),
  notaValor: z.number().optional(),
  provaData: z.string().optional(),
  provaDescricao: z.string().optional(),
  testeData: z.string().optional(),
  testeDescricao: z.string().optional(),
  trabalhoData: z.string().optional(),
  trabalhoDescricao: z.string().optional(),
});

const EditRegistroAcademico = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [registroData, setRegistroData] = useState({
    alunoId: "",
    disciplinaId: "",
    faltaData: "",
    faltaMotivo: "",
    notaValor: "",
    provaData: "",
    provaDescricao: "",
    testeData: "",
    testeDescricao: "",
    trabalhoData: "",
    trabalhoDescricao: "",
  });

  useEffect(() => {
    const fetchRegistro = async () => {
      try {
        console.log(id, 'edit front')
        const response = await api.get(`/registroacademico/edit/${id}`);
        setRegistroData(response.data);
      } catch (error) {
        console.error("Erro ao carregar os dados do registro acadêmico", error);
        setApiError(
          error.response?.data?.message ||
          'Erro ao carregar os dados do registro acadêmico. Por favor, tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRegistro();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registroResult = registroAcademicoSchema.safeParse({
      ...registroData,
      notaValor: registroData.notaValor ? parseFloat(registroData.notaValor) : undefined,
    });

    if (!registroResult.success) {
      setErrors(registroResult.error.format());
      return;
    }

    try {
      await api.put(`/registroacademico/edit/${id}`, registroData);
      navigate("/registroacademico");
    } catch (error) {
      console.error("Erro ao atualizar registro acadêmico", error);
      setApiError("Erro ao atualizar registro acadêmico. Por favor, tente novamente.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRegistroData(prev => ({
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
        <h2>Editar Registro Acadêmico</h2>

        <input
          type="text"
          name="alunoId"
          value={registroData.alunoId}
          onChange={handleChange}
          placeholder="ID do Aluno"
        />
        {errors.alunoId && <p className="error_message" style={{ color: "red" }}>{errors.alunoId._errors?.[0]}</p>}

        <input
          type="text"
          name="disciplinaId"
          value={registroData.disciplinaId}
          onChange={handleChange}
          placeholder="ID da Disciplina"
        />
        {errors.disciplinaId && <p className="error_message" style={{ color: "red" }}>{errors.disciplinaId._errors?.[0]}</p>}

        <input
          type="date"
          name="faltaData"
          value={registroData.faltaData}
          onChange={handleChange}
          placeholder="Data da Falta"
        />

        <input
          type="text"
          name="faltaMotivo"
          value={registroData.faltaMotivo}
          onChange={handleChange}
          placeholder="Motivo da Falta"
        />

        <input
          type="number"
          name="notaValor"
          value={registroData.notaValor}
          onChange={handleChange}
          placeholder="Nota"
        />

        <input
          type="date"
          name="provaData"
          value={registroData.provaData}
          onChange={handleChange}
          placeholder="Data da Prova"
        />

        <input
          type="text"
          name="provaDescricao"
          value={registroData.provaDescricao}
          onChange={handleChange}
          placeholder="Descrição da Prova"
        />

        <input
          type="date"
          name="testeData"
          value={registroData.testeData}
          onChange={handleChange}
          placeholder="Data do Teste"
        />

        <input
          type="text"
          name="testeDescricao"
          value={registroData.testeDescricao}
          onChange={handleChange}
          placeholder="Descrição do Teste"
        />

        <input
          type="date"
          name="trabalhoData"
          value={registroData.trabalhoData}
          onChange={handleChange}
          placeholder="Data do Trabalho"
        />

        <input
          type="text"
          name="trabalhoDescricao"
          value={registroData.trabalhoDescricao}
          onChange={handleChange}
          placeholder="Descrição do Trabalho"
        />

        <button className="professor-btn" type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditRegistroAcademico;
