import React, { useState } from "react";
import api from "../../services/api"; // Importando o serviço de API
import '../AddAluno/AddAluno.css';

const AddDiploma = () => {
  const [nome, setNome] = useState("")



  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Criar um FormData para enviar os arquivos junto com os dados
    const newDiploma = {
      nome,
    }

    console.log(newDiploma)

    try {
      // Enviar os dados para a API
      await api.post("/diplomas/create", newDiploma);
      alert("Turno adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar Turno", error);
    }
  };




  return (
    <>
      <h2 className="addaluno-container">Adicionar Diploma</h2>
      <form
        className="form-addaluno"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />

        <button
          className="aluno-btn"
          type="submit">
          Adicionar Diploma
        </button>
      </form>
    </>
  );
};

export default AddDiploma;
