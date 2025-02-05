import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from "../../services/api";
import "./DetalhesAlunos.css"

import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';

const DetalhesAluno = () => {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);
  const [disciplinas, setDisciplinas] = useState({ cursadas: [], atuais: [] });
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null);

  useEffect(() => {
    const fetchDetalhesAluno = async () => {
      try {
        const response = await api.get(`/registroacademico/${id}`);
        // console.log('Dados recebidos:', response.data); // Para debug
        
        if (response.data) {
          const registro = response.data;
          // console.log('Dados recebidos registro:', registro); // Para debug

          // Configura o aluno
          setAluno({
            nome: registro.aluno,
            curso: registro.disciplina
          });

          // Configura a disciplina
          const disciplina = {
            id: registro.id,
            aluno: registro.aluno,
            nome: registro.disciplina,
            notas: {
              provas: registro.provaData ? [{
                descricao: registro.provaDescricao,
                valor: registro.notaValor
              }] : [],
              testes: registro.testeData ? [{
                descricao: registro.testeDescricao,
                valor: registro.notaValor
              }] : [],
              trabalhos: registro.trabalhoData ? [{
                descricao: registro.trabalhoDescricao,
                valor: registro.notaValor
              }] : []
            },
            faltas: registro.faltaData ? [registro.faltaData] : [],
            diasAula: [], // Você pode ajustar isso conforme necessário
            status: 'em_andamento'
          };

          console.log('Dados recebidos registro:', disciplina, aluno); // Para debug

          // Atualiza as disciplinas
          setDisciplinas({
            atuais: [disciplina],
            cursadas: []
          });

          // Seleciona a disciplina automaticamente
          setDisciplinaSelecionada(disciplina);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do aluno:', error);
      }
    };

    fetchDetalhesAluno();
  }, [id]);

  const calcularMedia = (notas) => {
    const todasNotas = [
      ...notas.provas.map(p => p.valor),
      ...notas.testes.map(t => t.valor),
      ...notas.trabalhos.map(t => t.valor)
    ];

    if (todasNotas.length === 0) return 0;

    const soma = todasNotas.reduce((acc, nota) => acc + nota, 0);
    return (soma / todasNotas.length).toFixed(2);
  };

  const calcularPresenca = (faltas, diasAula) => {
    const totalAulas = diasAula.length || 20; // Usando 20 como padrão se não houver diasAula
    if (totalAulas === 0) return 100;

    const totalFaltas = faltas.length;
    const presenca = ((totalAulas - totalFaltas) / totalAulas) * 100;
    return presenca.toFixed(2);
  };

  // if (!aluno) return <div>Carregando...</div>;
  console.log("disciplina selecionada", disciplinaSelecionada)

  return (
    <div className="detalhes-container">
      <div className="detalhes-header">
        <Link to="/registroacademico" className="voltar-btn">
          Voltar para lista
        </Link>
        <div className="aluno-info">
          <h1>{aluno.nome}</h1>
          <p className="curso-nome">{aluno.curso}</p>
        </div>
      </div>

      <div className="disciplinas-section">
        <h2>Disciplinas Cursadas</h2>
        <div className="disciplinas-grid">
          {disciplinas.atuais.map(disciplina => (
            <div
              key={disciplina.id}
              className={`disciplina-card ${disciplinaSelecionada?.id === disciplina.id ? 'selected' : ''}`}
              onClick={() => setDisciplinaSelecionada(disciplina)}
            >
              <div className="disciplina-card-content">
                <div className="disciplina-icon">
                  <h3>{disciplina.nome}</h3>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#FFC107',
                      width: '30px',
                      height: '23px',
                    }}
                  >
                    <PersonIcon sx={{
                      color: 'white',
                      width: '30px',
                      height: '20px',
                    }}
                    />
                  </Button>
                </div>
              </div>
              <div className="disciplina-card-content-p">
                <p>Média: {calcularMedia(disciplina.notas)}</p>
                <p>Presença: {calcularPresenca(disciplina.faltas, disciplina.diasAula)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {disciplinaSelecionada && (
        <div className="disciplina-detalhes">
          <h2>Detalhes: {disciplinaSelecionada.nome}</h2>

          <div className="notas-section">
            <h3>Notas</h3>
            <div className="notas-grid">
              {disciplinaSelecionada.notas.provas.length > 0 && (
                <div className="notas-card">
                  <h4>Provas</h4>
                  {disciplinaSelecionada.notas.provas.map((prova, index) => (
                    <p key={index}>
                      {prova.descricao}: {prova.valor}
                    </p>
                  ))}
                </div>
              )}

              {disciplinaSelecionada.notas.testes.length > 0 && (
                <div className="notas-card">
                  <h4>Testes</h4>
                  {disciplinaSelecionada.notas.testes.map((teste, index) => (
                    <p key={index}>
                      {teste.descricao}: {teste.valor}
                    </p>
                  ))}
                </div>
              )}

              {disciplinaSelecionada.notas.trabalhos.length > 0 && (
                <div className="notas-card">
                  <h4>Trabalhos</h4>
                  {disciplinaSelecionada.notas.trabalhos.map((trabalho, index) => (
                    <p key={index}>
                      {trabalho.descricao}: {trabalho.valor}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="presenca-section">
            <h3>Presenças e Faltas</h3>
            <div className="presenca-info">
              <p>Total de Aulas: {disciplinaSelecionada.diasAula.length || 20}</p>
              <p>Faltas: {disciplinaSelecionada.faltas.length}</p>
              <p>Presença: {calcularPresenca(disciplinaSelecionada.faltas, disciplinaSelecionada.diasAula)}%</p>
              {calcularPresenca(disciplinaSelecionada.faltas, disciplinaSelecionada.diasAula) < 70 && (
                <p className="alerta">
                  Atenção: Presença abaixo do mínimo necessário (70%)
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalhesAluno;