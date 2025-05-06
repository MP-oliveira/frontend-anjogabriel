import "./AddDisciplina.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import VoltarButton from "../VoltarButton/VoltarButton";

const disciplinaSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  modulo: z.string().min(1, { message: "Selecione um módulo" }),
  carga_horaria: z
    .number()
    .min(1, { message: "A carga horária precisa ser maior que 0" }),
  carga_horaria_estagio: z
    .number()
    .min(0)
    .superRefine((val, ctx) => {
      // Verificamos se há um objeto pai 'data' antes de acessá-lo
      if (ctx.path && ctx.path.length > 0) {
        const parentData = ctx.parent;
        // Se tem estágio supervisionado, a carga horária deve ser maior que 0
        if (
          parentData &&
          parentData.estagio_supervisionado === "Sim" &&
          val <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "A carga horária de estágio precisa ser maior que 0 quando há estágio supervisionado",
          });
        }
      }
    }),
  estagio_supervisionado: z
    .string()
    .min(1, { message: "Selecione se tem estágio supervisionado" }),
  duracao: z.number(),
  curso_id: z.number().min(1, { message: "Selecione um curso" }),
  professor_id: z.number().min(1, { message: "Selecione um professor" }),
  horario_inicio: z.string().min(1, { message: "Defina um horário de início" }),
  horario_fim: z.string().min(1, { message: "Defina um horário de término" }),
  dias_semana: z
    .array(z.string())
    .min(1, { message: "Selecione pelo menos um dia da semana" }),
});

const AddDisciplina = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [carga_horaria, setCarga_horaria] = useState("");
  const [carga_horaria_estagio, setCarga_horaria_estagio] = useState("");
  const [estagio_supervisionado, setEstagio_supervisionado] = useState("");
  const [duracao, setDuracao] = useState("");
  const [curso_id, setCurso_id] = useState("");
  const [professor_id, setProfessor_id] = useState("");
  const [horario_inicio, setHorario_inicio] = useState("");
  const [horario_fim, setHorario_fim] = useState("");
  const [dias_semana, setDias_semana] = useState([]);
  const [errors, setErrors] = useState({});
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [modulo, setModulo] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cursosResponse, professoresResponse] = await Promise.all([
          api.get("/cursos"),
          api.get("/professores"),
        ]);
        setCursos(cursosResponse.data);
        setProfessores(professoresResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleDiasSemanaChange = (e) => {
    const dia = e.target.value;
    setDias_semana((prev) => {
      if (e.target.checked) {
        return [...prev, dia];
      } else {
        return prev.filter((d) => d !== dia);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const disciplinaFormValues = {
      nome,
      modulo,
      carga_horaria: Number(carga_horaria),
      carga_horaria_estagio:
        estagio_supervisionado === "Sim" ? Number(carga_horaria_estagio) : 0,
      estagio_supervisionado,
      duracao: Number(duracao),
      curso_id: Number(curso_id),
      professor_id: Number(professor_id),
      horario_inicio,
      horario_fim,
      dias_semana,
    };

    const disciplinaresult = disciplinaSchema.safeParse(disciplinaFormValues);

    if (!disciplinaresult.success) {
      const fieldErrors = disciplinaresult.error.format();
      setErrors({
        nome: fieldErrors.nome?._errors[0],
        modulo: fieldErrors.modulo?._errors[0],
        carga_horaria: fieldErrors.carga_horaria?._errors[0],
        carga_horaria_estagio: fieldErrors.carga_horaria_estagio?._errors[0],
        estagio_supervisionado: fieldErrors.estagio_supervisionado?._errors[0],
        duracao: fieldErrors.duracao?._errors[0],
        curso_id: fieldErrors.curso_id?._errors[0],
        professor_id: fieldErrors.professor_id?._errors[0],
        horario_inicio: fieldErrors.horario_inicio?._errors[0],
        horario_fim: fieldErrors.horario_fim?._errors[0],
        dias_semana: fieldErrors.dias_semana?._errors[0],
      });
    } else {
      setIsLoading(true); // Ativa o estado de loading antes da requisição

      try {
        const response = await api.post(
          "/disciplinas/create",
          disciplinaresult.data
        );
        console.log("Disciplina adicionada com sucesso!", response.data);
        alert("Disciplina adicionada com sucesso!");

        // Limpar os campos após o sucesso
        setNome("");
        setModulo("");
        setCarga_horaria("");
        setCarga_horaria_estagio("");
        setEstagio_supervisionado("");
        setDuracao("");
        setCurso_id("");
        setProfessor_id("");
        setHorario_inicio("");
        setHorario_fim("");
        setDias_semana([]);

        navigate("/disciplinas");
      } catch (error) {
        console.error("Erro ao adicionar disciplina", error);
        alert("Erro ao adicionar disciplina. Por favor, tente novamente.");
      } finally {
        setIsLoading(false); // Desativa o estado de loading após a requisição (sucesso ou erro)
      }
      setErrors({});
    }
  };

  return (
    <div className="form-container">
      <form className="form-add" onSubmit={handleSubmit}>
        <VoltarButton url="/disciplinas" />

        <h2>Adicionar Disciplina</h2>

        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da Disciplina"
        />
        {errors.nome && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.nome}
          </p>
        )}
        <div className="input-three-columns">
          <div className="custom-select-wrapper">
            <select
              value={curso_id}
              onChange={(e) => setCurso_id(e.target.value)}
            >
              <option value="">Selecione o Curso</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
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
              value={professor_id}
              onChange={(e) => setProfessor_id(e.target.value)}
            >
              <option value="">Selecione o Professor</option>
              {professores.map((professor) => (
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
        </div>

        <div className="input-three-columns">
          <input
            type="number"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            placeholder="Duração do Disciplina em Meses"
          />
          {errors.duracao && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.duracao}
            </p>
          )}

          <div className="custom-select-wrapper">
            <select value={modulo} onChange={(e) => setModulo(e.target.value)}>
              <option value="">Módulo</option>
              <option value="Modulo 1">Modulo 1</option>
              <option value="Modulo 2">Modulo 2</option>
              <option value="Modulo 3">Modulo 3</option>
              <option value="Modulo 4">Modulo 4</option>
            </select>
          </div>
          {errors.modulo && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.modulo}
            </p>
          )}
        </div>
        <div className="input-three-columns">
          <input
            type="number"
            value={carga_horaria}
            onChange={(e) => setCarga_horaria(e.target.value)}
            placeholder="Carga Horária (horas)"
          />
          {errors.carga_horaria && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.carga_horaria}
            </p>
          )}
          <div className="custom-select-wrapper">
            <select
              value={estagio_supervisionado}
              onChange={(e) => setEstagio_supervisionado(e.target.value)}
            >
              <option value="">Tem Estágio</option>
              <option value="Sim">Sim</option>
              <option value="Nao">Não</option>
            </select>
          </div>
          {errors.estagio_supervisionado && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.estagio_supervisionado}
            </p>
          )}
          <input
            type="number"
            value={carga_horaria_estagio}
            onChange={(e) => setCarga_horaria_estagio(e.target.value)}
            placeholder="Carga Horária do Estágio (horas)"
            disabled={estagio_supervisionado !== "Sim"}
          />
          {errors.carga_horaria_estagio && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.carga_horaria_estagio}
            </p>
          )}
        </div>

        <div className="input-three-columns">
          <input
            type="time"
            value={horario_inicio}
            onChange={(e) => setHorario_inicio(e.target.value)}
            placeholder="Horário de Início"
          />
          {errors.horario_inicio && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.horario_inicio}
            </p>
          )}

          <input
            type="time"
            value={horario_fim}
            onChange={(e) => setHorario_fim(e.target.value)}
            placeholder="Horário de Fim"
          />
          {errors.horario_fim && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.horario_fim}
            </p>
          )}
        </div>

        <div className="input-three-columns label-margin">
          <label className="label-input">
            <input
              type="checkbox"
              value="Segunda"
              onChange={handleDiasSemanaChange}
            />
            Segunda-feira
          </label>
          <label className="label-input">
            <input
              type="checkbox"
              value="Terça"
              onChange={handleDiasSemanaChange}
            />
            Terça-feira
          </label>
          <label className="label-input">
            <input
              type="checkbox"
              value="Quarta"
              onChange={handleDiasSemanaChange}
            />
            Quarta-feira
          </label>
          <label className="label-input">
            <input
              type="checkbox"
              value="Quinta"
              onChange={handleDiasSemanaChange}
            />
            Quinta-feira
          </label>
          <label className="label-input">
            <input
              type="checkbox"
              value="Sexta"
              onChange={handleDiasSemanaChange}
            />
            Sexta-feira
          </label>
          <label className="label-input">
            <input
              type="checkbox"
              value="Sábado"
              onChange={handleDiasSemanaChange}
            />
            Sábado
          </label>
        </div>
        <div className="form-btn-container">
          <button
            className="form-btn"
            type="submit"
            disabled={isLoading} // Desabilita o botão quando estiver carregando
          >
            {isLoading ? "Adicionando..." : "Adicionar Disciplina"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDisciplina;
