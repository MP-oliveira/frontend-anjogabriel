import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";

import './Edit.css'
import VoltarButton from '../VoltarButton/VoltarButton';


// Regex e validações
const cpfRegex = /^(\d{3}.?\d{3}.?\d{3}-?\d{2})$/;
const celularRegex = /^(\d{2})?\s?\d{5}-?\d{4}$/;
const cepRegex = /^\d{5}-?\d{3}$/;

const alunoSchema = z.object({
  nome: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Digite um email válido." }).min(5),
  data_nascimento: z.string().refine((value) => !isNaN(Date.parse(value)), { message: "Data inválida" }),
  estado_civil: z.string(),
  grupo_sanguineo: z.string(),
  naturalidade: z.string().min(3),
  nacionalidade: z.string().min(3),
  pai: z.string(),
  mae: z.string(),
  cpf: z.string().refine((value) => cpfRegex.test(value), { message: "CPF inválido" }),
  endereco: z.string(),
  n_casa: z.string(),
  bairro: z.string(),
  celular: z.string().refine((value) => celularRegex.test(value), { message: "Celular inválido" }),
  cep: z.string().refine((value) => cepRegex.test(value), { message: "CEP inválido" }),
  cidade: z.string(),
  estado: z.string(),
  curso_id: z.string(),
  turno_id: z.string(),
  data_matricula: z.string().refine((value) => !isNaN(Date.parse(value)), { message: "Data inválida" }),
  // data_termino_curso: z.string().refine((value) => !isNaN(Date.parse(value)), { message: "Data inválida" }),
});

const EditAluno = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [alunoData, setAlunoData] = useState({
    nome: "",
    email: "",
    data_nascimento: "",
    estado_civil: "",
    grupo_sanguineo: "",
    naturalidade: "",
    nacionalidade: "",
    pai: "",
    mae: "",
    cpf: "",
    endereco: "",
    n_casa: "",
    bairro: "",
    celular: "",
    cep: "",
    cidade: "",
    estado: "",
    curso_id: "",
    turno_id: "",
    data_matricula: "",
    // data_termino_curso: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const response = await api.get(`/alunos/${id}`);
        const aluno = response.data;
        
        console.log("Dados do aluno:", aluno);
        
        // Buscar cursos e turnos primeiro
        const cursosResponse = await api.get('/cursos');
        const turnosResponse = await api.get('/turnos');
        
        setCursos(cursosResponse.data);
        setTurnos(turnosResponse.data);
        
        // Se o aluno tem o nome do curso/turno em vez do ID, encontra o ID correspondente
        let curso_id = aluno.curso_id || "";
        let turno_id = aluno.turno_id || "";
        
        if (!curso_id && aluno.curso) {
          // Procura o curso pelo nome
          const cursoEncontrado = cursosResponse.data.find(c => c.nome === aluno.curso);
          if (cursoEncontrado) {
            curso_id = cursoEncontrado.id;
          }
        }
        
        if (!turno_id && aluno.turno) {
          // Procura o turno pelo nome
          const turnoEncontrado = turnosResponse.data.find(t => t.nome === aluno.turno);
          if (turnoEncontrado) {
            turno_id = turnoEncontrado.id;
          }
        }
        
        setAlunoData({
          ...aluno,
          data_nascimento: aluno.data_nascimento.slice(0, 10),
          data_matricula: aluno.data_matricula.slice(0, 10),
          curso_id: curso_id,
          turno_id: turno_id
        });

      } catch (error) {
        console.error("Erro ao carregar os dados do aluno", error);
        setApiError(
          error.response?.data?.message ||
          'Erro ao carregar os dados do aluno. Por favor, tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchAluno();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Dados a serem enviados:", alunoData);
    
    // Preparar dados para envio, incluindo curso e turno para compatibilidade
    const dadosParaEnvio = {
      ...alunoData
    };
    
    // Se temos curso_id e turno_id, adicionar também os nomes de curso e turno
    if (alunoData.curso_id) {
      const cursoSelecionado = cursos.find(c => c.id === alunoData.curso_id);
      if (cursoSelecionado) {
        dadosParaEnvio.curso = cursoSelecionado.nome;
      }
    }
    
    if (alunoData.turno_id) {
      const turnoSelecionado = turnos.find(t => t.id === alunoData.turno_id);
      if (turnoSelecionado) {
        dadosParaEnvio.turno = turnoSelecionado.nome;
      }
    }

    const alunoResult = alunoSchema.safeParse(alunoData);

    if (!alunoResult.success) {
      console.log("Erros de validação:", alunoResult.error.format());
      setErrors(alunoResult.error.format());
    } else {
      try {
        const response = await api.put(`/alunos/edit/${id}`, dadosParaEnvio);
        console.log("Resposta do servidor:", response.data);
        navigate("/alunos");
      } catch (error) {
        console.error("Erro ao atualizar alunos", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlunoData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpa o erro do campo quando ele é editado
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };


  if (loading) {
    return <div className="loading">Carregando...</div>;
  }



  return (
    <div className="form-container">
      <form className="form-add" onSubmit={handleSubmit}>

        <VoltarButton url='/alunos' />

        <h2>Editar Aluno</h2>
        <input
          name="nome"
          value={alunoData.nome}
          onChange={handleChange}
          placeholder="Nome" />
        {errors.nome && <p className="error_message">{errors.nome._errors[0]}</p>}
        <div className="input-three-columns">
          <input
            name="email"
            value={alunoData.email}
            onChange={handleChange}
            placeholder="Email" />
          {errors.email && <p className="error_message">{errors.email._errors[0]}</p>}

          <input
            type="date"
            name="data_nascimento"
            value={alunoData.data_nascimento}
            onChange={handleChange} />
          {errors.data_nascimento && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.data_nascimento}
            </p>
          )}
          <div className="custom-select-wrapper">
            <select 
              name="estado_civil"
              value={alunoData.estado_civil}
              onChange={handleChange}
            >
              <option value="">Estado civil</option>
              <option value="Solteiro">Solteiro(a)</option>
              <option value="Casado">Casado(a)</option>
              <option value="Viuvo">Viuvo(a)</option>
            </select>
          </div>
          {errors.estado_civil && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.estado_civil}
            </p>
          )}
        </div>
        <div className="input-three-columns">
          <div className="custom-select-wrapper">
            <select 
              name="grupo_sanguineo"
              value={alunoData.grupo_sanguineo}
              onChange={handleChange}
            >
              <option value="">Grupo Sanguineo</option>
              <option value="A-">A-</option>
              <option value="A+">A+</option>
              <option value="B-">B-</option>
              <option value="B+">B+</option>
              <option value="AB-">AB-</option>
              <option value="AB+">AB+</option>
              <option value="O-">O-</option>
              <option value="O+">O+</option>
            </select>
            {errors.grupo_sanguineo && (
              <p className="error_message" style={{ color: "red" }}>
                {errors.grupo_sanguineo._errors?.[0]}
              </p>
            )}
          </div>
          <input
            type="text"
            value={alunoData.naturalidade}
            onChange={handleChange}
            placeholder="Naturalidade"
          />
          {errors.naturalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.naturalidade}
            </p>
          )}
          <input
            name="nacionalidade"
            value={alunoData.nacionalidade}
            onChange={handleChange}
            placeholder="Nacionalidade" />
          {errors.nacionalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.nacionalidade}
            </p>
          )}
        </div>
        <input
          name="pai"
          value={alunoData.pai}
          onChange={handleChange}
          placeholder="Nome do Pai" />

        <input
          name="mae"
          value={alunoData.mae}
          onChange={handleChange}
          placeholder="Nome da Mãe" />
        <input
          name="cpf"
          value={alunoData.cpf}
          onChange={handleChange}
          placeholder="CPF" />
        {errors.cpf && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.cpf}
          </p>
        )}
        <input
          name="endereco"
          value={alunoData.endereco}
          onChange={handleChange}
          placeholder="Endereço" />
        <div className="input-three-columns">
          <input
            name="n_casa"
            value={alunoData.n_casa}
            onChange={handleChange}
            placeholder="Número da Casa" />
          <input
            name="bairro"
            value={alunoData.bairro}
            onChange={handleChange}
            placeholder="Bairro" />
        </div>
        <input
          name="celular"
          value={alunoData.celular}
          onChange={handleChange}
          placeholder="Celular" />
        {errors.celular && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.celular}
          </p>
        )}
        <div className="input-three-columns">
          <input
            name="cep"
            value={alunoData.cep}
            onChange={handleChange}
            placeholder="CEP" />
          {errors.cep && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cep}
            </p>
          )}
          <input
            name="cidade"
            value={alunoData.cidade}
            onChange={handleChange}
            placeholder="Cidade" />
          {errors.cidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cidade}
            </p>
          )}
          <input
            name="estado"
            value={alunoData.estado}
            onChange={handleChange}
            placeholder="Estado" />
        </div>
        <div className="input-three-columns">
          <div className="custom-select-wrapper">
            <select
              name="curso"
              value={alunoData.curso}
              onChange={handleChange}
            >
              <option value="curso">{alunoData.curso}</option>
              {cursos.map(curso => (
                <option key={curso.id} value={curso.nome}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>
          {errors.curso && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.curso._errors?.[0]}
            </p>
          )}
          <div className="custom-select-wrapper">
              <select 
              name="turno"
              value={alunoData.turno}
              onChange={handleChange}
            >
              <option value="turno">{alunoData.turno}</option>
              {turnos.map(turno => (
                <option key={turno.id} value={turno.nome}>
                  {turno.nome}
                </option>
              ))}
            </select>
          </div>
          {errors.turno_id && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.turno_id._errors?.[0]}
            </p>
          )}
          {/* <InputPassword /> */}
          <input
            type="password"
            value={alunoData.password}
            onChange={handleChange}
            placeholder="Digite a senha"
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

export default EditAluno;
