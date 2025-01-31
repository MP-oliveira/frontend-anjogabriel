import "../EditAluno/Edit.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";

const disciplinaSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  descricao: z
    .string()
    .min(10, { message: "A descrição precisa ter no mínimo 10 caracteres." }),
  carga_horaria: 
    z.number()
    .min(1, { message: "A carga horária precisa ser maior que 0" }),
  duracao: 
    z.number()
    .min(1, { message: "A duração precisa ser maior que 0" }),
  curso_id: z.string().min(1, { message: "Selecione um curso válido" }),
  professor_id: z.string().min(1, { message: "Selecione um professor válido" }),
  semestre: z.string().min(1, { message: "Informe o semestre" }),
  status: z.string().min(1, { message: "Selecione um status válido" }),
  horario_inicio: z.string().min(1, { message: "Informe o horário de início" }),
  horario_fim: z.string().min(1, { message: "Informe o horário de fim" }),
  dias_semana: z
    .array(z.string())
    .min(1, { message: "Selecione pelo menos um dia da semana" }),
  pre_requisitos: z.string().min(1, { message: "Informe os pré-requisitos" }),
  modalidade: z.string().min(1, { message: "Selecione uma modalidade" }),
});

const EditDisciplina = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disciplinaData, setDisciplinaData] = useState({
    nome: "",
    descricao: "",
    carga_horaria: 0,
    duracao: 0,
    curso_id: "",
    professor_id: "",
    semestre: "",
    status: "",
    horario_inicio: "",
    horario_fim: "",
    dias_semana: "",
    pre_requisitos: "",
    modalidade: "",
  });

  useEffect(() => {
    const fetchDisciplina = async () => {
      try {
        const response = await api.get(`/disciplinas/${id}`);
        const disciplina = response.data;
        
        setDisciplinaData({
          ...disciplina,
          carga_horaria: Number(disciplina.carga_horaria),
          duracao: Number(disciplina.duracao),
        });
      } catch (error) {
        console.error("Erro ao carregar os dados da disciplina", error);
        setApiError(
          error.response?.data?.message ||
          'Erro ao carregar os dados da disciplina. Por favor, tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDisciplina();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar os dados
    const dataToValidate = {
      ...disciplinaData,
      carga_horaria: Number(disciplinaData.carga_horaria),
      duracao: Number(disciplinaData.duracao),
    };

    const disciplinaResult = disciplinaSchema.safeParse(dataToValidate);

    if (!disciplinaResult.success) {
      setErrors(disciplinaResult.error.format());
      return;
    }

    try {
      await api.put(`/disciplinas/edit/${id}`, dataToValidate);
      navigate("/disciplinas");
    } catch (error) {
      console.error("Erro ao atualizar disciplina", error);
      setApiError("Erro ao atualizar disciplina. Por favor, tente novamente.");
    }
  };

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    
    let processedValue = value;
    if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    }
    
    setDisciplinaData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Limpar erro do campo quando editado
    setErrors(prev => ({
      ...prev,
      [name]: undefined
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
        <h2>Editar Disciplina</h2>

        <input
          type="text"
          name="nome"
          value={disciplinaData.nome}
          onChange={handleChange}
          placeholder="Nome da Disciplina"
        />
        {errors.nome && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.nome._errors?.[0]}
          </p>
        )}

        <textarea
          name="descricao"
          value={disciplinaData.descricao}
          onChange={handleChange}
          placeholder="Descrição da Disciplina"
          rows={4}
        />
        {errors.descricao && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.descricao._errors?.[0]}
          </p>
        )}

        <div className="addaluno-info">
          <input
            name="carga_horaria"
            type="number"
            value={disciplinaData.carga_horaria}
            onChange={handleChange}
            placeholder="Carga Horária (horas)"
          />
          {errors.carga_horaria && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.carga_horaria._errors?.[0]}
            </p>
          )}

          <input
            name="duracao"
            type="number"
            value={disciplinaData.duracao}
            onChange={handleChange}
            placeholder="Duração (meses)"
          />
          {errors.duracao && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.duracao._errors?.[0]}
            </p>
          )}
        </div>

        <div className="disciplina-status">
          <input
            name="semestre"
            value={disciplinaData.semestre}
            onChange={handleChange}
            placeholder="Semestre"
          />
          {errors.semestre && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.semestre._errors?.[0]}
            </p>
          )}

          <select
            name="status"
            value={disciplinaData.status}
            onChange={handleChange}
          >
            <option value="">Selecione um status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
          {errors.status && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.status._errors?.[0]}
            </p>
          )}
        </div>

        <div className="disciplina-horarios">
          <input
            name="horario_inicio"
            value={disciplinaData.horario_inicio}
            onChange={handleChange}
            placeholder="Horário de Início"
          />
          {errors.horario_inicio && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.horario_inicio._errors?.[0]}
            </p>
          )}

          <input
            name="horario_fim"
            value={disciplinaData.horario_fim}
            onChange={handleChange}
            placeholder="Horário de Fim"
          />
          {errors.horario_fim && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.horario_fim._errors?.[0]}
            </p>
          )}
        </div>

        <div className="disciplina-dias">
          <input
            name="dias_semana"
            value={disciplinaData.dias_semana}
            onChange={handleChange}
            placeholder="Dias da Semana"
          />
          {errors.dias_semana && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.dias_semana._errors?.[0]}
            </p>
          )}

          <textarea
            name="pre_requisitos"
            value={disciplinaData.pre_requisitos}
            onChange={handleChange}
            placeholder="Pré-Requisitos"
            rows={3}
          />
          {errors.pre_requisitos && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.pre_requisitos._errors?.[0]}
            </p>
          )}

          <select
            name="modalidade"
            value={disciplinaData.modalidade}
            onChange={handleChange}
          >
            <option value="">Selecione a Modalidade</option>
            <option value="presencial">Presencial</option>
            <option value="online">Online</option>
            <option value="híbrido">Híbrido</option>
          </select>
          {errors.modalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.modalidade._errors?.[0]}
            </p>
          )}
        </div>

        <button className="aluno-btn" type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditDisciplina;
