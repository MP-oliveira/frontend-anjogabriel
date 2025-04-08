import "../EditAluno/Edit.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";

const disciplinaSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),

  carga_horaria:
    z.number()
      .min(1, { message: "A carga horária precisa ser maior que 0" }),
  carga_horaria_estagio:
    z.number()
      .min(1, { message: "A carga horária do estágio precisa ser maior que 0" }),
  estagio_supervisionado: z.boolean(),
  duracao:
    z.number()
      .min(1, { message: "A duração precisa ser maior que 0" }),
  curso_id: z.string().min(1, { message: "Selecione um curso válido" }),
  professor_id: z.string().min(1, { message: "Selecione um professor válido" }),
  horario_inicio: z.string().min(1, { message: "Informe o horário de início" }),
  horario_fim: z.string().min(1, { message: "Informe o horário de fim" }),
  dias_semana: z
    .array(z.string())
    .min(1, { message: "Selecione pelo menos um dia da semana" }),
});

const EditDisciplina = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disciplinaData, setDisciplinaData] = useState({
    nome: "",
    carga_horaria: 0,
    carga_horaria_estagio: 0,
    duracao: 0,
    curso_id: "",
    professor_id: "",
    horario_inicio: "",
    horario_fim: "",
    dias_semana: "",
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
 console.log('dados da disciplina', disciplinaData)
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
        <div className="custom-select-wrapper">
          <select
            value={disciplinaData.curso_id}
            onChange={handleChange}
          >
            <option value="">Selecione o Curso</option>
            {disciplinaData.cursos.map(curso => (
              <option key={curso.curso_id} value={curso.curso_id}>
                {curso.nome}
              </option>
            ))}
          </select>
        </div>
        {errors.curso_id && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.curso_id}
          </p>
        )}

        <div className="custom-select-wrapper">
          <select
            value={disciplinaData.professor_id}
            onChange={handleChange}
          >
            <option value="">Selecione o Professor</option>
            {disciplinaData.professores.map(professor => (
              <option key={professor.id} value={professor.id}>
                {professor.nome}
              </option>
            ))}
          </select>
        </div>
        {errors.professor_id && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.professor_id}
          </p>
        )}

        <input
          name="duracao"
          type="number"
          value={disciplinaData.duracao}
          onChange={handleChange}
          placeholder="Duração da Disciplina em Meses"
        />
        {errors.duracao && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.duracao._errors?.[0]}
          </p>
        )}

        <div className="input-three-columns">
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
            name="carga_horaria_estagio"
            type="number"
            value={disciplinaData.carga_horaria_estagio}
            onChange={handleChange}
            placeholder="Carga Horária do Estágio (horas)"
          />
          {errors.carga_horaria && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.carga_horaria_estagio._errors?.[0]}
            </p>
          )}

          <div className="custom-select-wrapper">
            <select
              value={disciplinaData.estagio_supervisionado}
              onChange={handleChange}
            >
              <option value="">Tem Estágio</option>
              <option value="Sim">Sim</option>
              <option value="Nao">Não</option>
            </select>
          </div>
          {errors.estagio_supervisionado && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.carga_horaria}
            </p>
          )}


        </div>

        <div className="input-three-columns">
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

        <div className="input-three-columns label-margin">
          <label className='label-input'>
            <input
              type="checkbox"
              value="Segunda"
              onChange={handleChange}
            />
            Segunda-feira
          </label>
          <label  className='label-input' >
            <input
              type="checkbox"
              value="Terça"
              onChange={handleChange}
            />
            Terça-feira
          </label>
          <label className='label-input'>
            <input
              type="checkbox"
              value="Quarta"
              onChange={handleChange}
            />
            Quarta-feira
          </label>
          <label  className='label-input'>
            <input
              type="checkbox"
              value="Quinta"
              onChange={handleChange}
            />
            Quinta-feira
          </label>
          <label  className='label-input'>
            <input
              type="checkbox"
              value="Sexta"
              onChange={handleChange}
            />
            Sexta-feira
          </label>
          <label  className='label-input'>
            <input
              type="checkbox"
              value="Sabado"
              onChange={handleChange}
            />
            Sábado
          </label>
        </div>
        <button className="aluno-btn" type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditDisciplina;
