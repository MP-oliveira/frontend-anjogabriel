import "../EditAluno/Edit.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";

const cursoSchema = z.object({
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
  valor_total: z
    .number()
    .min(0, { message: "O valor total não pode ser negativo" }),
  valor_mensal: z
    .number()
    .min(0, { message: "O valor mensal não pode ser negativo" }),
  status: z.string({ message: "Selecione um status válido" }),
  modalidade: z.string({ message: "Selecione uma modalidade válida" }),
  estagio_supervisionado: z.boolean({ message: "Selecione se há estágio supervisionado" })
});

const EditCurso = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cursoData, setCursoData] = useState({
    nome: "",
    descricao: "",
    carga_horaria: 0,
    duracao: 0,
    valor_total: 0,
    valor_mensal: 0,
    status: "",
    modalidade: "",
    estagio_supervisionado: false
  });

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const response = await api.get(`/cursos/${id}`);
        const curso = response.data;
        
        // Garantir que os valores numéricos sejam do tipo number
        setCursoData({
          ...curso,
          carga_horaria: Number(curso.carga_horaria),
          duracao: Number(curso.duracao),
          valor_total: Number(curso.valor_total),
          valor_mensal: Number(curso.valor_mensal),
          estagio_supervisionado: Boolean(curso.estagio_supervisionado)
        });
      } catch (error) {
        console.error("Erro ao carregar os dados do curso", error);
        setApiError(
          error.response?.data?.message ||
          'Erro ao carregar os dados do curso. Por favor, tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCurso();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Converter valores para os tipos corretos antes da validação
    const dataToValidate = {
      ...cursoData,
      carga_horaria: Number(cursoData.carga_horaria),
      duracao: Number(cursoData.duracao),
      valor_total: Number(cursoData.valor_total),
      valor_mensal: Number(cursoData.valor_mensal),
      estagio_supervisionado: Boolean(cursoData.estagio_supervisionado)
    };

    const cursoResult = cursoSchema.safeParse(dataToValidate);

    if (!cursoResult.success) {
      setErrors(cursoResult.error.format());
      return;
    }

    try {
      await api.put(`/cursos/edit/${id}`, dataToValidate);
      navigate("/cursos");
    } catch (error) {
      console.error("Erro ao atualizar curso", error);
      setApiError("Erro ao atualizar curso. Por favor, tente novamente.");
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    
    // Tratar diferentes tipos de input
    let processedValue;
    if (type === 'checkbox') {
      processedValue = checked;
    } else if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    } else {
      processedValue = value;
    }

    setCursoData(prev => ({
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
    <div className="addcurso-container">
      <form className="form-addcurso" onSubmit={handleSubmit}>
        <h2>Editar Curso</h2>

        <input
          type="text"
          name="nome"
          value={cursoData.nome}
          onChange={handleChange}
          placeholder="Nome do Curso"
        />
        {errors.nome && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.nome._errors?.[0]}
          </p>
        )}

        <textarea
          name="descricao"
          value={cursoData.descricao}
          onChange={handleChange}
          placeholder="Descrição do Curso"
          rows={4}
        />
        {errors.descricao && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.descricao._errors?.[0]}
          </p>
        )}

        <div className="curso-info">
          <input
            name="carga_horaria"
            type="number"
            value={cursoData.carga_horaria}
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
            value={cursoData.duracao}
            onChange={handleChange}
            placeholder="Duração (meses)"
          />
          {errors.duracao && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.duracao._errors?.[0]}
            </p>
          )}
        </div>

        <div className="curso-valores">
          <input
            name="valor_total"
            type="number"
            value={cursoData.valor_total}
            onChange={handleChange}
            placeholder="Valor Total"
          />
          {errors.valor_total && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.valor_total._errors?.[0]}
            </p>
          )}

          <input
            name="valor_mensal"
            type="number"
            value={cursoData.valor_mensal}
            onChange={handleChange}
            placeholder="Valor Mensal"
          />
          {errors.valor_mensal && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.valor_mensal._errors?.[0]}
            </p>
          )}
        </div>

        <div className="curso-status-modalidade">
          <select
            name="status"
            value={cursoData.status}
            onChange={handleChange}
          >
            <option value="">Selecione um status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="em_breve">Em Breve</option>
          </select>
          {errors.status && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.status._errors?.[0]}
            </p>
          )}

          <select
            name="modalidade"
            value={cursoData.modalidade}
            onChange={handleChange}
          >
            <option value="">Selecione uma modalidade</option>
            <option value="presencial">Presencial</option>
            <option value="ead">EAD</option>
            <option value="hibrido">Híbrido</option>
          </select>
          {errors.modalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.modalidade._errors?.[0]}
            </p>
          )}
        </div>

        <div className="curso-estagio">
          <label>
            Estágio Supervisionado:
            <input
              name="estagio_supervisionado"
              type="checkbox"
              checked={cursoData.estagio_supervisionado}
              onChange={handleChange}
            />
          </label>
          {errors.estagio_supervisionado && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.estagio_supervisionado._errors?.[0]}
            </p>
          )}
        </div>

        <div className="curso-btn-container">
          <button className="curso-btn" type="submit">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCurso;