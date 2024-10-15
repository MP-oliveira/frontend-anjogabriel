import React, { useState } from "react";
import api from "../services/api"; // Importando o serviço de API

const AddDisciplina = () => {
  const [nome, setNome] = useState("");
  const [carga_horaria_semestral, setCarga_horaria_semestral] = useState("");
  const [estagio, setEstagio] = useState("");



  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Criar um FormData para enviar os arquivos junto com os dados
    const newDisciplina = {
      nome,
      carga_horaria_semestral,
      estagio,
    }

    console.log(newDisciplina)

    try {
      // Enviar os dados para a API
      await api.post("/disciplinas/create", newDisciplina);
      alert("Disciplina adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar disciplina", error);
    }
  };



  return (
    <form onSubmit={handleSubmit}>
      <h2>Adicionar Disciplina</h2>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome"
      />
      <input
        type="text"
        value={carga_horaria_semestral}
        onChange={(e) => setCarga_horaria_semestral(e.target.value)}
        placeholder="Carga Horaria"
      />
      <label for='estagio'>Estágio</label>
      <select id='estagio'
        onChange={(e) => setEstagio(e.target.value)}
      >
        <option value="Sim">Sim</option>
        <option value="Nao">Não</option>
      </select>

      <button type="submit">Adicionar Disciplina</button>
    </form>
  );
};

export default AddDisciplina;
