import { useState } from "react";
import api from "../../services/api"; // Importando o serviço de API
import '../AddAluno/AddAluno.css';
import { useNavigate } from "react-router-dom";
import VoltarButton from "../VoltarButton/VoltarButton";

const AddTurnos = () => {
  const [nome, setNome] = useState("");
  const [inicio, setInicio] = useState("");
  const [termino, setTermino] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loading
  const navigate = useNavigate();

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Criar o objeto com os dados do turno
    const newTurno = {
      nome,
      inicio,
      termino
    };

    // Ativar o estado de loading antes da requisição
    setIsLoading(true);

    try {
      // Enviar os dados para a API
      await api.post("/turnos/create", newTurno);
      alert("Turno adicionado com sucesso!");

      // Resetar campos
      setNome("");
      setInicio("");
      setTermino("");
      
      // Redirecionar para a página de turnos
      navigate("/turnos");
    } catch (error) {
      console.error("Erro ao adicionar Turno", error);
    } finally {
      // Desativar o estado de loading após a requisição (sucesso ou erro)
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="form-container">
        <form
          className="form-add"
          onSubmit={handleSubmit}
        >
          <VoltarButton url="/turnos" />
          <h2>Adicionar Turno</h2>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
          />
          <input
            type="text"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            placeholder="Inicio"
          />
          <input
            type="text"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            placeholder="Termino"
          />
          <button
            className="aluno-btn"
            type="submit"
            disabled={isLoading} // Desabilita o botão quando estiver carregando
          >
            {isLoading ? "Adicionando..." : "Adicionar Turno"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddTurnos;
