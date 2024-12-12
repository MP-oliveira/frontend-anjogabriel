import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Importando o serviço de API
import { useParams } from "react-router-dom";
import '../AddAluno/AddAluno.css';

const AddDiploma = () => {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const response = await api.get(`/alunos/${id}`);
        setAluno(response.data);
      } catch (error) {
        console.error('Erro ao buscar aluno:', error);
      }
    };
    fetchAluno();
  }, [id]);

  if (!aluno) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <h2>Diploma de {aluno.nome}</h2>
      <p>Nome: {aluno.nome}</p>
      <p>RG: {aluno.rg}</p>
      <p>Nome do Pai: {aluno.pai}</p>
      <p>Nome da Mãe: {aluno.mae}</p>
      <p>Data de Nascimento: {new Date(aluno.data_nascimento).toLocaleDateString()}</p>
      <p>Nacionalidade: {aluno.nacionalidade}</p>
    </>
  );
};

export default AddDiploma;