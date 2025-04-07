
import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";

import './Edit.css'

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
  curso: z.string(),
  turno: z.string(),
  data_matricula: z.string().refine((value) => !isNaN(Date.parse(value)), { message: "Data inválida" }),
  data_termino_curso: z.string().refine((value) => !isNaN(Date.parse(value)), { message: "Data inválida" }),
});

const EditAluno = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
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
    curso: "",
    turno: "",
    data_matricula: "",
    data_termino_curso: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const response = await api.get(`/alunos/${id}`);
        const aluno = response.data;
        setAlunoData({
          ...aluno,
          data_nascimento: aluno.data_nascimento.slice(0, 10),
          data_matricula: aluno.data_matricula.slice(0, 10),
          data_termino_curso: aluno.data_termino_curso.slice(0, 10),
        });
      }  catch (error) {
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

    const alunoResult = alunoSchema.safeParse(alunoData);

    if (!alunoResult.success) {
      setErrors(alunoResult.error.format());
    } else {
      try {
        await api.put(`/alunos/edit/${id}`, alunoData);
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
    <div className="addaluno-container">
      <form className="form-addaluno" onSubmit={handleSubmit}>
        <h2>Editar Aluno</h2>

        <input name="nome" value={alunoData.nome} onChange={handleChange} placeholder="Nome" />
        {errors.nome && <p className="error_message">{errors.nome._errors[0]}</p>}
        <div className="email-dn">
          <input name="email" value={alunoData.email} onChange={handleChange} placeholder="Email" />
          {errors.email && <p className="error_message">{errors.email._errors[0]}</p>}

          <input type="date" name="data_nascimento" value={alunoData.data_nascimento} onChange={handleChange} />
          {errors.data_nascimento && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.data_nascimento}
            </p>
          )}
          <input name="estado_civil" value={alunoData.estado_civil} onChange={handleChange} placeholder="Estado Civil" />
          {errors.estado_civil && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.estado_civil}
            </p>
          )}
        </div>
        <div className="gs-n-n">
          <input name="grupo_sanguineo" value={alunoData.grupo_sanguineo} onChange={handleChange} placeholder="Grupo Sanguíneo" />

          <input name="naturalidade" value={alunoData.naturalidade} onChange={handleChange} placeholder="Naturalidade" />
          {errors.naturalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.naturalidade}
            </p>
          )}
          <input name="nacionalidade" value={alunoData.nacionalidade} onChange={handleChange} placeholder="Nacionalidade" />
          {errors.nacionalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.nacionalidade}
            </p>
          )}
        </div>
        <input name="pai" value={alunoData.pai} onChange={handleChange} placeholder="Nome do Pai" />

        <input name="mae" value={alunoData.mae} onChange={handleChange} placeholder="Nome da Mãe" />
          <input name="cpf" value={alunoData.cpf} onChange={handleChange} placeholder="CPF" />
          {errors.cpf && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cpf}
            </p>
          )}
        <input name="endereco" value={alunoData.endereco} onChange={handleChange} placeholder="Endereço" />
        <div className="nc-b">

          <input name="n_casa" value={alunoData.n_casa} onChange={handleChange} placeholder="Número da Casa" />

          <input name="bairro" value={alunoData.bairro} onChange={handleChange} placeholder="Bairro" />
        </div>
          <input name="celular" value={alunoData.celular} onChange={handleChange} placeholder="Celular" />
          {errors.celular && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.celular}
            </p>
          )}
        <div className="cep-ci-es">

          <input name="cep" value={alunoData.cep} onChange={handleChange} placeholder="CEP" />
          {errors.cep && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cep}
            </p>
          )}
          <input name="cidade" value={alunoData.cidade} onChange={handleChange} placeholder="Cidade" />
          {errors.cidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cidade}
            </p>
          )}
          <input name="estado" value={alunoData.estado} onChange={handleChange} placeholder="Estado" />
        </div>
        <div className="cur-tur-dai-dat">

          <input name="curso" value={alunoData.curso} onChange={handleChange} placeholder="Curso" />
          {errors.curso && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.curso}
            </p>
          )}
          <input name="turno" value={alunoData.turno} onChange={handleChange} placeholder="Turno" />

          <input type="date" name="data_matricula" value={alunoData.data_matricula} onChange={handleChange} />
          {errors.data_matricula && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.data_matricula}
            </p>
          )}
          <input type="date" name="data_termino_curso" value={alunoData.data_termino_curso} onChange={handleChange} />
          {errors.data_termino_curso && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.data_termino_curso}
            </p>
          )}
        </div>
        <button className="aluno-btn" type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditAluno;
