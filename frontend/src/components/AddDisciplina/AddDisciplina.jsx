import "./AddDisciplina.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const disciplinaSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  descricao: z
    .string()
    .min(10, { message: "A descrição precisa ter no mínimo 10 caracteres." }),
  carga_horaria: z
    .number()
    .min(1, { message: "A carga horária precisa ser maior que 0" }),
  carga_horaria_estagio: z
    .number()
    .min(1, { message: "A carga horária precisa ser maior que 0" }),
  estagio_supervisionado: z
    .string()
    .min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  duracao: z.number(),
  curso_id: z
    .number()
    .min(1, { message: "Selecione um curso" }),
  professor_id: z
    .number()
    .min(1, { message: "Selecione um professor" }),
  semestre: z
    .number()
    .min(1, { message: "O semestre precisa ser maior que 0" })
    .max(12, { message: "O semestre não pode ser maior que 12" }),
  status: z
    .string()
    .min(1, { message: "Selecione um status válido" }),
  horario_inicio: z
    .string()
    .min(1, { message: "Defina um horário de início" }),
  horario_fim: z
    .string()
    .min(1, { message: "Defina um horário de término" }),
  dias_semana: z
    .array(z.string())
    .min(1, { message: "Selecione pelo menos um dia da semana" }),
  pre_requisitos: z.string(),
  modalidade: z.enum(['Presencial', 'Online', 'Híbrido'],
    { message: "Modalidade inválida. Escolha entre 'Presencial', 'Online' ou 'Híbrido'." }),
});

const AddDisciplina = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [carga_horaria, setCarga_horaria] = useState("");
  const [carga_horaria_estagio, setCarga_horaria_estagio] = useState("");
  const [estagio_supervisionado, setEstagio_supervisionado] = useState("");
  const [duracao, setDuracao] = useState("");
  const [curso_id, setCurso_id] = useState("");
  const [professor_id, setProfessor_id] = useState("");
  const [semestre, setSemestre] = useState("");
  const [status, setStatus] = useState("");
  const [horario_inicio, setHorario_inicio] = useState("");
  const [horario_fim, setHorario_fim] = useState("");
  const [dias_semana, setDias_semana] = useState([]);
  const [pre_requisitos, setPre_requisitos] = useState([]);
  const [modalidade, setModalidade] = useState("");
  const [errors, setErrors] = useState({});

  // Estados para as listas de cursos e professores
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);

  // Carregar cursos e professores quando o componente montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cursosResponse, professoresResponse] = await Promise.all([
          api.get("/cursos"),
          api.get("/professores")
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
    setDias_semana(prev => {
      if (e.target.checked) {
        return [...prev, dia];
      } else {
        return prev.filter(d => d !== dia);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const disciplinaFormValues = {
      nome,
      descricao,
      carga_horaria: Number(carga_horaria),
      carga_horaria_estagio: Number(carga_horaria_estagio),
      estagio_supervisionado,
      duracao: Number(duracao),
      curso_id: Number(curso_id),
      professor_id: Number(professor_id),
      semestre: Number(semestre),
      status,
      horario_inicio,
      horario_fim,
      dias_semana,
      pre_requisitos,
      modalidade,
    };

    const disciplinaresult = disciplinaSchema.safeParse(disciplinaFormValues);

    if (!disciplinaresult.success) {
      const fieldErrors = disciplinaresult.error.format();
      setErrors({
        nome: fieldErrors.nome?._errors[0],
        descricao: fieldErrors.descricao?._errors[0],
        carga_horaria: fieldErrors.carga_horaria?._errors[0],
        carga_horaria_estagio: fieldErrors.carga_horaria_estagio?._errors[0],
        estagio_supervisionado: fieldErrors.estagio_supervisionado?._errors[0],
        duracao: fieldErrors.duracao?._errors[0],
        curso_id: fieldErrors.curso_id?._errors[0],
        professor_id: fieldErrors.professor_id?._errors[0],
        semestre: fieldErrors.semestre?._errors[0],
        status: fieldErrors.status?._errors[0],
        horario_inicio: fieldErrors.horario_inicio?._errors[0],
        horario_fim: fieldErrors.horario_fim?._errors[0],
        dias_semana: fieldErrors.dias_semana?._errors[0],
        pre_requisitos: fieldErrors.pre_requisitos?._errors[0],
        modalidade: fieldErrors.modalidade?._errors[0],
      });
    } else {
      try {
        const response = await api.post("/disciplinas/create", disciplinaresult.data);
        console.log("Disciplina adicionada com sucesso!", response.data);

        // Limpar os campos após o sucesso
        setNome("");
        setDescricao("");
        setCarga_horaria("");
        setCarga_horaria_estagio("");
        setEstagio_supervisionado("");
        setDuracao("");
        setCurso_id("");
        setProfessor_id("");
        setSemestre("");
        setStatus("");
        setHorario_inicio("");
        setHorario_fim("");
        setDias_semana([]);
        setPre_requisitos([]);
        setModalidade("");

        navigate("/disciplinas");
      } catch (error) {
        console.error("Erro ao adicionar disciplina", error);
      }
      setErrors({});
    }
  };

  return (
    <div className="adddisciplina-container">
      <form className="form-adddisciplina" onSubmit={handleSubmit}>
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

        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição da Disciplina"
          rows={4}
        />
        {errors.descricao && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.descricao}
          </p>
        )}

        <div className="disciplina-curso-prof">
          <select
            value={curso_id}
            onChange={(e) => setCurso_id(e.target.value)}
          >
            <option value="">Selecione o Curso</option>
            {cursos.map(curso => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
          {errors.curso_id && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.curso_id}
            </p>
          )}

          <select
            value={professor_id}
            onChange={(e) => setProfessor_id(e.target.value)}
          >
            <option value="">Selecione o Professor</option>
            {professores.map(professor => (
              <option key={professor.id} value={professor.id}>
                {professor.nome}
              </option>
            ))}
          </select>
          {errors.professor_id && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.professor_id}
            </p>
          )}
        </div>

        <input
          type="number"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
          placeholder="Duração do Curso"
        />
        {errors.duracao && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.duracao}
          </p>
        )}

        <div className="disciplina-info">
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

          <input
            type="number"
            value={carga_horaria_estagio}
            onChange={(e) => setCarga_horaria_estagio(e.target.value)}
            placeholder="Carga Horária do Estágio (horas)"
          />
          {errors.carga_horaria && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.carga_horaria}
            </p>
          )}

          <select
            value={estagio_supervisionado}
            onChange={(e) => setEstagio_supervisionado(e.target.value)}
          >
            <option value="">Tem Estágio</option>
            <option value="Sim">Sim</option>
            <option value="Nao">Não</option>
          </select>
          {errors.estagio_supervisionado && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.carga_horaria}
            </p>
          )}

          <input
            type="number"
            value={semestre}
            onChange={(e) => setSemestre(e.target.value)}
            placeholder="Semestre"
            min="1"
            max="12"
          />
          {errors.semestre && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.semestre}
            </p>
          )}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Selecione o Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
          {errors.status && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.status}
            </p>
          )}
        </div>

        <div className="disciplina-horario">
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

        <div className="dias-semana">
          <label>
            <input
              type="checkbox"
              value="Segunda"
              onChange={handleDiasSemanaChange}
            />
            Segunda-feira
          </label>
          <label>
            <input
              type="checkbox"
              value="Terça"
              onChange={handleDiasSemanaChange}
            />
            Terça-feira
          </label>
          <label>
            <input
              type="checkbox"
              value="Quarta"
              onChange={handleDiasSemanaChange}
            />
            Quarta-feira
          </label>
          <label>
            <input
              type="checkbox"
              value="Quinta"
              onChange={handleDiasSemanaChange}
            />
            Quinta-feira
          </label>
          <label>
            <input
              type="checkbox"
              value="Sexta"
              onChange={handleDiasSemanaChange}
            />
            Sexta-feira
          </label>
        </div>
        <div>
          <input type="text"
            value={pre_requisitos}
            onChange={(e) => setPre_requisitos(e.target.value)}
            placeholder='Pré requisitos'
          />
          {errors.pre_requisitos && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.pre_requisitos}
            </p>
          )}
        </div>

        <div className="disciplina-modalidade">
          <select
            value={modalidade}
            onChange={(e) => setModalidade(e.target.value)}
          >
            <option value="">Selecione a Modalidade</option>
            <option value="Presencial">Presencial</option>
            <option value="Online">Online</option>
            <option value="Híbrido">Híbrido</option>
          </select>
          {errors.modalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.modalidade}
            </p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit">Adicionar Disciplina</button>
        </div>
      </form>
    </div>
  );
};

export default AddDisciplina;
