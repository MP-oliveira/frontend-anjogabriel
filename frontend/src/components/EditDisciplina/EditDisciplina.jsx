import "../EditAluno/Edit.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import VoltarButton from '../VoltarButton/VoltarButton';

const disciplinaSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  modulo: z
    .string()
    .min(1, { message: "Selecione um módulo" }),
  carga_horaria:
    z.number()
      .min(1, { message: "A carga horária precisa ser maior que 0" }),
  carga_horaria_estagio:
    z.number()
      .min(0, { message: "A carga horária do estágio não pode ser negativa" }),
  estagio_supervisionado: z.boolean(),
  duracao:
    z.number()
      .min(1, { message: "A duração precisa ser maior que 0" }),
  curso_id: z.union([z.string(), z.number()]).transform(val => String(val)),
  professor_id: z.union([z.string(), z.number()]).transform(val => String(val)),
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
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinaData, setDisciplinaData] = useState({
    nome: "",
    modulo: "",
    carga_horaria: 0,
    carga_horaria_estagio: 0,
    duracao: 0,
    curso_id: "",
    professor_id: "",
    horario_inicio: "",
    horario_fim: "",
    dias_semana: [],
    estagio_supervisionado: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar dados da disciplina
        const disciplinaResponse = await api.get(`/disciplinas/${id}`);
        const disciplina = disciplinaResponse.data;

        // Converter dias da semana para array se vier como string
        const diasSemana = Array.isArray(disciplina.dias_semana) ?
          disciplina.dias_semana :
          (disciplina.dias_semana ? disciplina.dias_semana.split(',') : []);

        setDisciplinaData({
          ...disciplina,
          carga_horaria: Number(disciplina.carga_horaria),
          carga_horaria_estagio: Number(disciplina.carga_horaria_estagio),
          duracao: Number(disciplina.duracao),
          // Converter IDs para string para garantir consistência
          curso_id: String(disciplina.curso_id),
          professor_id: String(disciplina.professor_id),
          dias_semana: diasSemana
        });

        // Carregar lista de cursos
        const cursosResponse = await api.get('/cursos');
        setCursos(cursosResponse.data);

        // Carregar lista de professores
        const professoresResponse = await api.get('/professores');
        setProfessores(professoresResponse.data);
      } catch (error) {
        console.error("Erro ao carregar os dados", error);
        setApiError(
          error.response?.data?.message ||
          'Erro ao carregar os dados. Por favor, tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar os dados
    const dataToValidate = {
      ...disciplinaData,
      carga_horaria: Number(disciplinaData.carga_horaria),
      carga_horaria_estagio: Number(disciplinaData.carga_horaria_estagio),
      duracao: Number(disciplinaData.duracao),
      curso_id: String(disciplinaData.curso_id),
      professor_id: String(disciplinaData.professor_id),
      estagio_supervisionado: disciplinaData.estagio_supervisionado === "Sim"
    };

    console.log("Dados para validação:", dataToValidate);

    const disciplinaResult = disciplinaSchema.safeParse(dataToValidate);

    if (!disciplinaResult.success) {
      console.log("Erros:", disciplinaResult.error.format());
      setErrors(disciplinaResult.error.format());
      return;
    }

    try {
      const dadosParaEnvio = {
        ...dataToValidate,
        // Converter IDs para número para o backend
        curso_id: Number(dataToValidate.curso_id),
        professor_id: Number(dataToValidate.professor_id)
      };
      
      await api.put(`/disciplinas/edit/${id}`, dadosParaEnvio);
      navigate("/disciplinas");
    } catch (error) {
      console.error("Erro ao atualizar disciplina", error);
      setApiError("Erro ao atualizar disciplina. Por favor, tente novamente.");
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    // Tratamento especial para checkboxes (dias da semana)
    if (type === 'checkbox') {
      const dia = value;
      let diasAtualizados = [...disciplinaData.dias_semana];

      if (checked) {
        // Adicionar dia se não existir
        if (!diasAtualizados.includes(dia)) {
          diasAtualizados.push(dia);
        }
      } else {
        // Remover dia
        diasAtualizados = diasAtualizados.filter(d => d !== dia);
      }

      setDisciplinaData(prev => ({
        ...prev,
        dias_semana: diasAtualizados
      }));
      return;
    }

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
    <div className="form-container">
      <form className="form-add" onSubmit={handleSubmit}>

        <VoltarButton url='/disciplinas' />

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

        <div className="input-three-columns">
          <div className="custom-select-wrapper">
            <select
              name="curso_id"
              value={disciplinaData.curso_id}
              onChange={handleChange}
            >
              <option value="">Selecione o Curso</option>
              {cursos.map(curso => (
                <option key={curso.id} value={String(curso.id)}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>
          {errors.curso_id && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.curso_id._errors?.[0]}
            </p>
          )}

          <div className="custom-select-wrapper">
            <select
              name="professor_id"
              value={disciplinaData.professor_id}
              onChange={handleChange}
            >
              <option value="">Selecione o Professor</option>
              {professores.map(professor => (
                <option key={professor.id} value={String(professor.id)}>
                  {professor.nome}
                </option>
              ))}
            </select>
          </div>
          {errors.professor_id && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.professor_id._errors?.[0]}
            </p>
          )}
        </div>
        <div className="input-three-columns">
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

          <div className="custom-select-wrapper">
            <select
              name="modulo"
              value={disciplinaData.modulo}
              onChange={handleChange}
            >
              <option value="">Módulo</option>
              <option value="Modulo 1">Modulo 1</option>
              <option value="Modulo 2">Modulo 2</option>
              <option value="Modulo 3">Modulo 3</option>
              <option value="Modulo 4">Modulo 4</option>
            </select>
          </div>
          {errors.modulo && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.modulo._errors?.[0]}
            </p>
          )}
        </div>
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
          {errors.carga_horaria_estagio && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.carga_horaria_estagio._errors?.[0]}
            </p>
          )}

          <div className="custom-select-wrapper">
            <select
              name="estagio_supervisionado"
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
              {errors.estagio_supervisionado._errors?.[0]}
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
              name="dias_semana"
              value="Segunda"
              checked={disciplinaData.dias_semana.includes("Segunda")}
              onChange={handleChange}
            />
            Segunda-feira
          </label>
          <label className='label-input' >
            <input
              type="checkbox"
              name="dias_semana"
              value="Terça"
              checked={disciplinaData.dias_semana.includes("Terça")}
              onChange={handleChange}
            />
            Terça-feira
          </label>
          <label className='label-input'>
            <input
              type="checkbox"
              name="dias_semana"
              value="Quarta"
              checked={disciplinaData.dias_semana.includes("Quarta")}
              onChange={handleChange}
            />
            Quarta-feira
          </label>
          <label className='label-input'>
            <input
              type="checkbox"
              name="dias_semana"
              value="Quinta"
              checked={disciplinaData.dias_semana.includes("Quinta")}
              onChange={handleChange}
            />
            Quinta-feira
          </label>
          <label className='label-input'>
            <input
              type="checkbox"
              name="dias_semana"
              value="Sexta"
              checked={disciplinaData.dias_semana.includes("Sexta")}
              onChange={handleChange}
            />
            Sexta-feira
          </label>
          <label className='label-input'>
            <input
              type="checkbox"
              name="dias_semana"
              value="Sábado"
              checked={disciplinaData.dias_semana.includes("Sábado") || disciplinaData.dias_semana.includes("Sabado")}
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