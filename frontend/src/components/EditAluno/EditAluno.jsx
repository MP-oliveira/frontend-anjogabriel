import "../AddAluno/AddAluno.css";
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";

// Regex e validações
const cpfRegex = /^(\d{3}.?\d{3}.?\d{3}-?\d{2})$/;
const rgRegex = /^(\d{1,2}.?\d{3}.?\d{3}-?[A-Za-z0-9]{1})$/;
const telefoneRegex = /^(\d{2})?\s?\d{4,5}-?\d{4}$/;
const celularRegex = /^(\d{2})?\s?\d{5}-?\d{4}$/;
const cepRegex = /^\d{5}-?\d{3}$/;

const alunoSchema = z.object({
  nome: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Digite um email válido." }).min(5),
  data_nascimento: z.date().max(new Date(), { message: "Data inválida" }),
  estado_civil: z.string(),
  grupo_sanguineo: z.string(),
  naturalidade: z.string().min(3),
  nacionalidade: z.string().min(3),
  pai: z.string(),
  mae: z.string(),
  rg: z.string().refine((value) => rgRegex.test(value), { message: "RG inválido" }),
  orgao_expedidor_rg: z.string(),
  data_expedicao_rg: z.date().max(new Date(), { message: "Data de expedição inválida" }),
  cpf: z.string().refine((value) => cpfRegex.test(value), { message: "CPF inválido" }),
  endereco: z.string(),
  n_casa: z.string(),
  bairro: z.string(),
  tel_res: z.string().refine((value) => telefoneRegex.test(value), { message: "Telefone inválido" }),
  celular: z.string().refine((value) => celularRegex.test(value), { message: "Celular inválido" }),
  tel_trabalho: z.string().refine((value) => celularRegex.test(value), { message: "Telefone de trabalho inválido" }),
  cep: z.string().refine((value) => cepRegex.test(value), { message: "CEP inválido" }),
  cidade: z.string(),
  estado: z.string(),
  curso: z.string(),
  turno: z.string(),
  data_matricula: z.date().max(new Date(), { message: "Data inválida" }),
  data_termino_curso: z.date().max(new Date(), { message: "Data inválida" }),
});

const EditAluno = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [alunoData, setAlunoData] = useState({
    nome: "", email: "", data_nascimento: "", estado_civil: "",
    grupo_sanguineo: "", naturalidade: "", nacionalidade: "", pai: "",
    mae: "", rg: "", orgao_expedidor_rg: "", data_expedicao_rg: "",
    cpf: "", endereco: "", n_casa: "", bairro: "", tel_res: "", celular: "",
    tel_trabalho: "", cep: "", cidade: "", estado: "", curso: "",
    turno: "", data_matricula: "", data_termino_curso: ""
  });

  const [errors, setErrors] = useState({});

  console.log(id)
  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const response = await api.get(`/alunos/${id}`);
        const aluno = response.data;
        setAlunoData({
          ...aluno,
          data_nascimento: aluno.data_nascimento.slice(0, 10),
          data_expedicao_rg: aluno.data_expedicao_rg.slice(0, 10),
          data_matricula: aluno.data_matricula.slice(0, 10),
          data_termino_curso: aluno.data_termino_curso.slice(0, 10),
        });
      } catch (error) {
        console.error("Erro ao carregar os dados do aluno", error);
      }
    };
    fetchAluno();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const alunoResult = alunoSchema.safeParse({
      ...alunoData,
      data_nascimento: new Date(alunoData.data_nascimento),
      data_expedicao_rg: new Date(alunoData.data_expedicao_rg),
      data_matricula: new Date(alunoData.data_matricula),
      data_termino_curso: new Date(alunoData.data_termino_curso),
    });

    if (!alunoResult.success) {
      setErrors(alunoResult.error.format());
    } else {
      try {
        await api.put(`/alunos/edit/${id}`, alunoData);
        navigate("/alunos");
      } catch (error) {
        console.error("Erro ao atualizar aluno front", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlunoData({ ...alunoData, [name]: value });
  };

  return (
    <div className="addaluno-container">
      <form className="form-addaluno" onSubmit={handleSubmit}>
        <h2>Editar Aluno</h2>

        <input name="nome" value={alunoData.nome} onChange={handleChange} placeholder="Nome" />
        {errors.nome && <p className="error_message">{errors.nome._errors[0]}</p>}

        <input name="email" value={alunoData.email} onChange={handleChange} placeholder="Email" />
        {errors.email && <p className="error_message">{errors.email._errors[0]}</p>}

        <input type="date" name="data_nascimento" value={alunoData.data_nascimento} onChange={handleChange} />

        <input name="estado_civil" value={alunoData.estado_civil} onChange={handleChange} placeholder="Estado Civil" />

        <input name="grupo_sanguineo" value={alunoData.grupo_sanguineo} onChange={handleChange} placeholder="Grupo Sanguíneo" />

        <input name="naturalidade" value={alunoData.naturalidade} onChange={handleChange} placeholder="Naturalidade" />

        <input name="nacionalidade" value={alunoData.nacionalidade} onChange={handleChange} placeholder="Nacionalidade" />

        <input name="pai" value={alunoData.pai} onChange={handleChange} placeholder="Nome do Pai" />

        <input name="mae" value={alunoData.mae} onChange={handleChange} placeholder="Nome da Mãe" />

        <input name="rg" value={alunoData.rg} onChange={handleChange} placeholder="RG" />

        <input name="orgao_expedidor_rg" value={alunoData.orgao_expedidor_rg} onChange={handleChange} placeholder="Órgão Expedidor" />

        <input type="date" name="data_expedicao_rg" value={alunoData.data_expedicao_rg} onChange={handleChange} />

        <input name="cpf" value={alunoData.cpf} onChange={handleChange} placeholder="CPF" />

        <input name="endereco" value={alunoData.endereco} onChange={handleChange} placeholder="Endereço" />

        <input name="n_casa" value={alunoData.n_casa} onChange={handleChange} placeholder="Número da Casa" />

        <input name="bairro" value={alunoData.bairro} onChange={handleChange} placeholder="Bairro" />

        <input name="tel_res" value={alunoData.tel_res} onChange={handleChange} placeholder="Telefone Residencial" />

        <input name="celular" value={alunoData.celular} onChange={handleChange} placeholder="Celular" />

        <input name="tel_trabalho" value={alunoData.tel_trabalho} onChange={handleChange} placeholder="Telefone de Trabalho" />

        <input name="cep" value={alunoData.cep} onChange={handleChange} placeholder="CEP" />

        <input name="cidade" value={alunoData.cidade} onChange={handleChange} placeholder="Cidade" />

        <input name="estado" value={alunoData.estado} onChange={handleChange} placeholder="Estado" />

        <input name="curso" value={alunoData.curso} onChange={handleChange} placeholder="Curso" />

        <input name="turno" value={alunoData.turno} onChange={handleChange} placeholder="Turno" />

        <input type="date" name="data_matricula" value={alunoData.data_matricula} onChange={handleChange} />

        <input type="date" name="data_termino_curso" value={alunoData.data_termino_curso} onChange={handleChange} />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditAluno;
