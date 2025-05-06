import "./AddCurso.css";
import { useState } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import VoltarButton from "../VoltarButton/VoltarButton";

const cursoSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),

  carga_horaria: z
    .number()
    .min(1, { message: "A carga horária precisa ser maior que 0" }),
  duracao: z.number().min(1, { message: "A duração precisa ser maior que 0" }),
  valor_total: z
    .number()
    .min(0, { message: "O valor total não pode ser negativo" }),
  valor_mensal: z
    .number()
    .min(0, { message: "O valor mensal não pode ser negativo" }),
  status: z.string({ message: "Selecione um status válido" }),
  modalidade: z.string({ message: "Selecione uma modalidade válida" }),
});

const AddCurso = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [carga_horaria, setCarga_horaria] = useState("");
  const [duracao, setDuracao] = useState("");
  const [valor_total, setValor_total] = useState("");
  const [valor_mensal, setValor_mensal] = useState("");
  const [status, setStatus] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loading

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cursoFormValues = {
      nome,
      carga_horaria: Number(carga_horaria),
      duracao: Number(duracao),
      valor_total: Number(valor_total),
      valor_mensal: Number(valor_mensal),
      status,
      modalidade,
    };

    const cursoresult = cursoSchema.safeParse(cursoFormValues);

    if (!cursoresult.success) {
      const fieldErrors = cursoresult.error.format();
      setErrors({
        nome: fieldErrors.nome?._errors[0],
        carga_horaria: fieldErrors.carga_horaria?._errors[0],
        duracao: fieldErrors.duracao?._errors[0],
        valor_total: fieldErrors.valor_total?._errors[0],
        valor_mensal: fieldErrors.valor_mensal?._errors[0],
        status: fieldErrors.status?._errors[0],
        modalidade: fieldErrors.modalidade?._errors[0],
      });
    } else {
      setIsLoading(true); // Ativa o estado de loading antes da requisição
      try {
        const response = await api.post("/cursos/create", cursoresult.data);
        console.log("Curso adicionado com sucesso!", response.data);

        // Limpar os campos após o sucesso
        setNome("");
        setCarga_horaria("");
        setDuracao("");
        setValor_total("");
        setValor_mensal("");
        setStatus("");
        setModalidade("");

        navigate("/cursos");
      } catch (error) {
        console.error("Erro ao adicionar curso", error);
      } finally {
        setIsLoading(false); // Desativa o estado de loading após a requisição (sucesso ou erro)
      }
      setErrors({});
    }
  };

  return (
    <div className="form-container">
      <form className="form-add" onSubmit={handleSubmit}>
        <VoltarButton url="/cursos" />

        <h2>Adicionar Curso</h2>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do Curso"
        />
        {errors.nome && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.nome}
          </p>
        )}
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
          <input
            type="number"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            placeholder="Duração meses"
          />
          {errors.duracao_meses && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.duracao_meses}
            </p>
          )}
          <input
            type="number"
            value={valor_total}
            onChange={(e) => setValor_total(e.target.value)}
            placeholder="Valor Total"
          />
          {errors.valor_total && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.valor_total}
            </p>
          )}
          <input
            type="number"
            value={valor_mensal}
            onChange={(e) => setValor_mensal(e.target.value)}
            placeholder="Valor Mensal"
          />
          {errors.valor_mensal && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.valor_mensal}
            </p>
          )}
        </div>
        <div className="input-three-columns">
          <div className="custom-select-wrapper">
            <select
              value={status}
              className="custom-select-wrapper"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Selecione o Status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          {errors.status && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.status}
            </p>
          )}
          <div className="custom-select-wrapper">
            <select
              value={modalidade}
              onChange={(e) => setModalidade(e.target.value)}
            >
              <option value="">Selecione a Modalidade</option>
              <option value="presencial">Presencial</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </div>
          {errors.modalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.modalidade}
            </p>
          )}
        </div>
        <div className="form-btn-container">
          <button
            className="form-btn"
            type="submit"
            disabled={isLoading} // Desabilita o botão quando estiver carregando
          >
            {isLoading ? "Adicionando..." : "Adicionar Curso"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCurso;
