import React, { useState } from "react";
import api from "../../services/api"; // Importando o serviço de API

const AddProfessor = () => {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [rg, setRg] = useState("")
  const [cpf, setCpf] = useState("")
  const [celular, setCelular] = useState("")


  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Criar um FormData para enviar os arquivos junto com os dados
    const newProfessor = {
      nome,
      email,
      rg,
      cpf,
      celular,
    }

    console.log(newProfessor)

    try {
      // Enviar os dados para a API
      await api.post("/professores/create", newProfessor);
      alert("Professor adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar professor", error);
    }
  };




  return (
    <>
      <h2>Adicionar Professor</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
         <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
         <input
          type="text"
          value={rg}
          onChange={(e) => setRg(e.target.value)}
          placeholder="RG"
        />
         <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="CPF"
        />
         <input
          type="text"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
          placeholder="Celular"
        />
        <button type="submit">Adicionar Professor</button>
      </form>
    </>
  );
};

export default AddProfessor;
