import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";

import '../EditAluno/Edit.css';

const cursoSchema = z.object({
  nome: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  descricao: z.string().min(10, { message: "A descrição precisa ter no mínimo 10 caracteres." }),
  carga_horaria: z.number().min(1, { message: "A carga horária deve ser um número positivo." }),
  duracao: z.number().min(1, { message: "A duração não pode estar vazia." }),
  valor_total: z.number().min(0, { message: "O valor total deve ser um número positivo." }),
  valor_mensal: z.number().min(0, { message: "O valor mensal deve ser um número positivo." }),
  status: z.enum(['Ativo', 'Inativo'], { message: "Status inválido. Escolha entre 'Ativo' ou 'Inativo'." }),
  modalidade: z.enum(['Presencial', 'Online', 'Híbrido'], { message: "Modalidade inválida. Escolha entre 'Presencial', 'Online' ou 'Híbrido'." }),
});

const EditCurso = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cursoData, setCursoData] = useState({
    nome: "",
    descricao: "",
    carga_horaria: 0,
    duracao: 0,
    valor_total: 0,
    valor_mensal: 0,
    status: "Ativo",
    modalidade: "",
    estagio_supervisionado: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const response = await api.get(`/cursos/${id}`);
        const curso = response.data;
        console.log(curso)
        setCursoData({
          nome: curso.nome,
          descricao: curso.descricao,
          carga_horaria: Number(curso.carga_horaria),
          duracao: Number(curso.duracao),
          valor_total: Number(curso.valor_total),
          valor_mensal: Number(curso.valor_mensal),
          status: curso.status,
          modalidade: curso.modalidade,
          estagio_supervisionado: curso.estagioSupervisionado
        });
      } catch (error) {
        console.error("Erro ao carregar os dados do curso", error);
        setApiError(
          error.response?.data?.message ||
          'Erro ao carregar os dados do curso. Por favor, tente novamente'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCurso();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cursoResult = cursoSchema.safeParse({
      ...cursoData,
      duracao: cursoData.duracao,
    });

    if (!cursoResult.success) {
      setErrors(cursoResult.error.format());
    } else {
      try {
        console.log(cursoData)
        await api.put(`/cursos/edit/${id}`, cursoData);
        navigate("/cursos");
      } catch (error) {
        console.error("Erro ao atualizar curso front", error);
        setApiError('Erro ao atualizar curso. Por favor, tente novamente.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCursoData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
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

  if (apiError) {
    return <div className="error">{apiError}</div>;
  }

  return (
    <div className="addaluno-container">
      <form className="form-addaluno" onSubmit={handleSubmit}>
        <h2>Editar Curso</h2>
        <input
          type='text'
          name="nome"
          value={cursoData.nome}
          onChange={handleChange}
          placeholder="Nome"
        />
        {errors.nome && <p className="error_message">{errors.nome._errors[0]}</p>}


        <textarea
          name='descricao'
          value={cursoData.descricao}
          onChange={handleChange}
          placeholder="Descrição do Curso"
          rows={4}
        ></textarea>
        {errors.descricao && <p className="error_message">{errors.descricao._errors[0]}</p>}

        <input
          type='number'
          name="carga_horaria"
          value={cursoData.carga_horaria}
          onChange={handleChange}
          placeholder="Carga Horária"
        />
        {errors.carga_horaria && <p className="error_message">{errors.carga_horaria._errors[0]}</p>}

        <input
          name="duracao"
          value={cursoData.duracao}
          onChange={handleChange}
          type="number"
          placeholder="Duração"
        />
        {errors.duracao && <p className="error_message">{errors.duracao._errors[0]}</p>}

        <input
          name="valor_total"
          value={cursoData.valor_total}
          onChange={handleChange}
          type="number"
          placeholder="Valor Total"
        />
        {errors.valor_total && <p className="error_message">{errors.valor_total._errors[0]}</p>}

        <input
          name="valor_mensal"
          value={cursoData.valor_mensal}
          onChange={handleChange}
          type="number"
          placeholder="Valor Mensal"
        />
        {errors.valor_mensal && <p className="error_message">{errors.valor_mensal._errors[0]}</p>}

        <div className="status_selector">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            onChange={handleChange}
          >
            <option value={cursoData.status}>{cursoData.status}</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Em breve">Em breve</option>
          </select>
          {errors.status && <p className="error_message">{errors.status._errors[0]}</p>}
        </div>

        <div className="modalidade_selector">
          <label htmlFor="modalidade">Modalidade:</label>
          <select
            id="modalidade"
            name="modalidade"
            value={cursoData.modalidade || "presencial"}
            onChange={handleChange}
          >
            <option value={cursoData.modalidade}>{cursoData.modalidade}</option>
            <option value="Presencial">Presencial</option>
            <option value="Híbrido">Híbrido</option>
            <option value="EAD">EAD</option>
          </select>
          {errors.modalidade && <p className="error_message">{errors.modalidade._errors[0]}</p>}
        </div>

        <div className="estagio_supervisionado">
          <label htmlFor="estagio_supervisionado">
            <input
              type="checkbox"
              id="estagio_supervisionado"
              name="estagio_supervisionado"
              checked={cursoData.estagio_supervisionado}
              onChange={handleChange}
            />
            Estágio Supervisionado
          </label>
        </div>

        <button className="curso-btn" type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditCurso;
