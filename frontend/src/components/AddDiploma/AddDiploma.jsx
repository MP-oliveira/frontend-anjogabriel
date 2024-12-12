import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api"; // Importando o serviço de API
import { useParams } from "react-router-dom";
import { useReactToPrint } from 'react-to-print';
import "./AddDiploma.css";

const AddDiploma = () => {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);
  const printRef = useRef();

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

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `,
  });

  if (!aluno) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <div className="diploma-container" ref={printRef}>
        <div className="diploma-front">
          <h2>Diploma de {aluno.nome}</h2>
          <p className="info nome">Nome: {aluno.nome}</p>
          <p className="info rg">RG: {aluno.rg}</p>
          <p className="info pai">Nome do Pai: {aluno.pai}</p>
          <p className="info mae">Nome da Mãe: {aluno.mae}</p>
          <p className="info nascimento">Data de Nascimento: {new Date(aluno.data_nascimento).toLocaleDateString()}</p>
          <p className="info nacionalidade">Nacionalidade: {aluno.nacionalidade}</p>
        </div>
        <div className="diploma-back">
          <h2>Dados Acadêmicos</h2>
          {aluno.materias && aluno.materias.length > 0 ? (
            <table className="materias-table">
              <thead>
                <tr>
                  <th>Matéria</th>
                  <th>Teórica/Prática</th>
                  <th>Estágio</th>
                  <th>Nota</th>
                </tr>
              </thead>
              <tbody>
                {aluno.materias.map((materia, index) => (
                  <tr key={index}>
                    <td>{materia.nome}</td>
                    <td>{materia.teoricaPratica}</td>
                    <td>{materia.estagio}</td>
                    <td>{materia.nota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhuma matéria encontrada.</p>
          )}
        </div>
      </div>
      <button onClick={handlePrint}>Imprimir Diploma</button>
    </div>
  );
};

export default AddDiploma;
