import React, { useState, useEffect } from "react"
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";

import './EditCurso.css'

import { z } from 'zod';

const nomeRegex = /^.{3,}$/; // O nome deve ter pelo menos 3 caracteres
const cargaHorariaRegex = /^\d+$/; // A carga horária deve ser um número inteiro
const duracaoRegex = /^\d+(\s*(horas|dias|meses))?$/; // Duração deve ser um número seguido de horas, dias ou meses
const valorRegex = /^\d+(\.\d{1,2})?$/; // O valor deve ser um número com até duas casas decimais
const descricaoRegex = /^.{0,255}$/; // Descrição pode ter até 255 caracter

const cursoSchema = z.object({
  nome: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  descricao: z.string().min(10, { message: "A descrição precisa ter no mínimo 10 caracteres." }),
  carga_horaria: z.number().min(1, { message: "A carga horária deve ser um número positivo." }),
  duracao: z.string().min(1, { message: "A duração não pode estar vazia." }),
  valor_total: z.number().min(0, { message: "O valor total deve ser um número positivo." }),
  valor_mensal: z.number().min(0, { message: "O valor mensal deve ser um número positivo." }),
  status: z.enum(['Ativo', 'Inativo'], { message: "Status inválido. Escolha entre 'Ativo' ou 'Inativo'." }),
  modalidade: z.enum(['Presencial', 'Online', 'Híbrido'], { message: "Modalidade inválida. Escolha entre 'Presencial', 'Online' ou 'Híbrido'." }),
  estagio_supervisionado
});


const EditCurso = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cursoData, setCursoData] = useState({
    nome: "", descricao: "", carga_horaria: "", duracao: "",
    valor_total: "", valor_mensal: "", status: "", modalidade: "",
    estagio_supervisionado: false
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const response = await api.get(`/cursos/${id}`);
        const curso = response.data;
        setCursoData({
          nome: curso.nome,
          descricao: curso.descricao,
          carga_horaria: curso.carga_horaria,
          duracao: curso.duracao,
          valorTotal: curso.valorTotal,
          valorMensal: curso.valorMensal,
          status: curso.status,
          modalidade: curso.modalidade,
        });
      } catch (error) {
        console.error("Erro ao carregar os dados do curso", error);
      }
    };
    fetchCurso();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cursoResult = cursoSchema.safeParse({
      ...cursoData,
      duracao: new Date(cursoData.duracao),
    });

    if (!cursoResult.success) {
      setErrors(cursoResult.error.format());
    } else {
      try {
        await api.put(`/cursos/edit/${id}`, cursoData);
        navigate("/cursos");
      } catch (error) {
        console.error("Erro ao atualizar curso front", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlunoData({ ...cursoData, [name]: value });
  };


  return (
    <div className="addcurso-container">
      <form className="form-addcurso" onSubmit={handleSubmit}>
        <h2>Editar Aluno</h2>

        <input name="nome" value={cursoData.nome} onChange={handleChange} placeholder="Nome" />
        {errors.nome && <p className="error_message">{errors.nome._errors[0]}</p>}
        
        <div className="gs-n-n">
          <input name="grupo_sanguineo" value={cursoData.grupo_sanguineo} onChange={handleChange} placeholder="Grupo Sanguíneo" />

          <input name="naturalidade" value={cursoData.naturalidade} onChange={handleChange} placeholder="Naturalidade" />
          {errors.naturalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.naturalidade}
            </p>
          )}
          <input name="nacionalidade" value={cursoData.nacionalidade} onChange={handleChange} placeholder="Nacionalidade" />
          {errors.nacionalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.nacionalidade}
            </p>
          )}
        </div>
        <input name="pai" value={cursoData.pai} onChange={handleChange} placeholder="Nome do Pai" />

        <input name="mae" value={cursoData.mae} onChange={handleChange} placeholder="Nome da Mãe" />
        <div className="rg-oe-de">

          <input name="rg" value={cursoData.rg} onChange={handleChange} placeholder="RG" />
          {errors.rg && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.rg}
            </p>
          )}
          <input name="orgao_expedidor_rg" value={cursoData.orgao_expedidor_rg} onChange={handleChange} placeholder="Órgão Expedidor" />
          {errors.orgao_expedidor_rg && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.orgao_expedidor_rg}
            </p>
          )}
          <input type="date" name="data_expedicao_rg" value={cursoData.data_expedicao_rg} onChange={handleChange} />
          {errors.data_expedicao_rg && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.data_expedicao_rg}
            </p>
          )}
          <input name="cpf" value={cursoData.cpf} onChange={handleChange} placeholder="CPF" />
          {errors.cpf && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cpf}
            </p>
          )}
        </div>
        <input name="endereco" value={cursoData.endereco} onChange={handleChange} placeholder="Endereço" />
        <div className="nc-b">

          <input name="n_casa" value={cursoData.n_casa} onChange={handleChange} placeholder="Número da Casa" />

          <input name="bairro" value={cursoData.bairro} onChange={handleChange} placeholder="Bairro" />
        </div>
        <div className="tel">
          <input name="tel_res" value={cursoData.tel_res} onChange={handleChange} placeholder="Telefone Residencial" />
          {errors.tel_res && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.tel_res}
            </p>
          )}
          <input name="celular" value={cursoData.celular} onChange={handleChange} placeholder="Celular" />
          {errors.celular && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.celular}
            </p>
          )}
          <input name="tel_trabalho" value={cursoData.tel_trabalho} onChange={handleChange} placeholder="Telefone de Trabalho" />
          {errors.tel_trabalho && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.tel_trabalho}
            </p>
          )}
        </div>
        <div className="cep-ci-es">

          <input name="cep" value={cursoData.cep} onChange={handleChange} placeholder="CEP" />
          {errors.cep && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cep}
            </p>
          )}
          <input name="cidade" value={cursoData.cidade} onChange={handleChange} placeholder="Cidade" />
          {errors.cidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cidade}
            </p>
          )}
          <input name="estado" value={cursoData.estado} onChange={handleChange} placeholder="Estado" />
        </div>
        <div className="cur-tur-dai-dat">

          <input name="curso" value={cursoData.curso} onChange={handleChange} placeholder="Curso" />
          {errors.curso && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.curso}
            </p>
          )}
          <input name="turno" value={cursoData.turno} onChange={handleChange} placeholder="Turno" />

          <input type="date" name="data_matricula" value={cursoData.data_matricula} onChange={handleChange} />
          {errors.data_matricula && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.data_matricula}
            </p>
          )}
          <input type="date" name="data_termino_curso" value={cursoData.data_termino_curso} onChange={handleChange} />
          {errors.data_termino_curso && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.data_termino_curso}
            </p>
          )}
        </div>
        <button className="curso-btn" type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default EditCurso