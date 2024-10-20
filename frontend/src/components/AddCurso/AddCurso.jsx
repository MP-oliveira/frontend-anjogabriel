import React, { useState } from "react";
import api from "../../services/api"; // Importando o serviço de API


const AddCurso = () => {
  const [nome, setNome] = useState("");
  const [duracao, setDuracao] = useState("");
  const [carga_horaria, setCarga_horaria] = useState("");
  const [estagio_supervisionado, setEstagio_supervisionado] = useState("");



  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Criar um FormData para enviar os arquivos junto com os dados
    const newCurso = {
      nome,
      duracao,
      carga_horaria,
      estagio_supervisionado,
    }

    console.log(newCurso)

    try {
      // Enviar os dados para a API
      await api.post("/cursos/create", newCurso);
      alert("Curso adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar Curso", error);
    }
  };



  return (
    <>
      <h2>Adicionar Curso</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
         <input
          type='text'
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
          placeholder="Duração"
        />
          <input
          type="text"
          value={carga_horaria}
          onChange={(e) => setCarga_horaria(e.target.value)}
          placeholder="Carga Horária"
        />
          <input
          type="text"
          value={estagio_supervisionado}
          onChange={(e) => setEstagio_supervisionado(e.target.value)}
          placeholder="Estágio  Supervisionado"
        />
        <button type="submit">Adicionar Curso</button>
      </form>
    </>
  );
};

export default AddCurso;
