import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import "./DetalhesAlunos.css";

import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";

const DetalhesAluno = () => {
  const { id } = useParams();
  const [registroAluno, setRegistroAluno] = useState([]);

  useEffect(() => {
    const fetchDetalhesAluno = async () => {
      try {
        const response = await api.get(`/registroacademico/${id}`);
        // console.log('Dados recebidos:', response.data); // chegou aqui ok

        if (response.data) {
          const registro = response.data;
          // console.log("Dados recebidos registro:", registro); // chegou aqui ok
          setRegistroAluno(registro);

          // console.log('Dados recebidos registro:', disciplina); // chegou aqui ok
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do aluno:", error);
      }
    };

    fetchDetalhesAluno();
  }, [id]);

  const calcularPresenca = (faltas, diasAula) => {
    const totalAulas = diasAula || 20; // Usando 20 como padrão se não houver diasAula
    if (totalAulas === 0) return 100;

    const totalFaltas = faltas;
    const presenca = ((totalAulas - totalFaltas) / totalAulas) * 100;
    if (presenca > 70) {
      return (<p>Presença: {presenca.toFixed(2)}%</p>)
    } else {
      return (<p className="alerta">Atenção: Presença abaixo do mínimo de 70%</p>)

    }
  };

  return (
    <div className="detalhes-container">
      <div className="detalhes-header">
        <Link to="/registroacademico" className="voltar-btn">
          Voltar para lista
        </Link>
        <div className="aluno-info">
          <h1>{registroAluno.aluno}</h1>
          <p className="curso-nome">{registroAluno.disciplina}</p>
        </div>
      </div>

      <div className="disciplinas-section">
        <h2>Disciplinas Cursadas</h2>
        <div className="disciplinas-grid">
          <div>
            <div className="disciplina-card-content">
              <div className="disciplina-icon">
                <h3>aluno: {registroAluno.aluno}</h3>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#FFC107",
                    width: "30px",
                    height: "23px",
                  }}
                >
                  <PersonIcon
                    sx={{
                      color: "white",
                      width: "30px",
                      height: "20px",
                    }}
                  />
                </Button>
              </div>
            </div>
            <div className="disciplina-card-content-p">
              <p>Média: {registroAluno.media}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="disciplina-detalhes">
        <h2>Detalhes: </h2>

        <div className="notas-section">
          <h3>Notas</h3>
          <div className="notas-grid">
            <div className="notas-card">
              <h4>Provas</h4>
              <p>{registroAluno.notaProva}</p>
            </div>

            <div className="notas-card">
              <h4>Testes</h4>
              <p>{registroAluno.notaTeste}</p>
            </div>

            <div className="notas-card">
              <h4>Trabalhos</h4>
              <p>{registroAluno.notaTrabalho}</p>
            </div>
          </div>
        </div>

        <div className="presenca-section">
          <h3>Presenças e Faltas</h3>
          <div className="presenca-info">
            <p>Total de Aulas: Precisa adicionar a quantidade de aulas e de faltas na tabela Registro Academico para tornar tudo dinamico</p>
            <p>Faltas: </p>
            {calcularPresenca(1,1)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesAluno;
