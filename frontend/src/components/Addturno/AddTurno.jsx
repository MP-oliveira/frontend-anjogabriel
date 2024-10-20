import React, { useState } from "react";
import api from "../../services/api"; // Importando o serviço de API

const AddTurno = () => {
  const [nome, setNome] = useState("")
  const [inicio, setInicio] = useState("")
  const [termino, setTermino] = useState("")


  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Criar um FormData para enviar os arquivos junto com os dados
    const newTurno = {
      nome,
      inicio,
      termino
    }

    console.log(newTurno)

    try {
      // Enviar os dados para a API
      await api.post("/turnos/create", newTurno);
      alert("Turno adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar Turno", error);
    }
  };




  return (
    <>
      <h2>Adicionar Turno</h2>
      <form onSubmit={handleSubmit}>
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
    
        <button type="submit">Adicionar Turno</button>
      </form>
    </>
  );
};

export default AddTurno;
