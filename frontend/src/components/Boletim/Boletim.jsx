import './Boletim.css';
import LogoAnjo from '../../assets/logoAnjo.png';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const Boletim = () => {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Buscando os dados do aluno
        const alunoResponse = await api.get(`/alunos/${id}`);
        if (!alunoResponse.data) {
          throw new Error('Nenhum dado retornado pela API.');
        }
        setAluno(alunoResponse.data);

        // Buscando as disciplinas do aluno
        const disciplinasResponse = await api.get(`/disciplinas?alunoId=${id}`); // Ajuste a rota conforme necessário
        if (!disciplinasResponse.data) {
          throw new Error('Nenhum dado de disciplinas retornado pela API.');
        }
        setDisciplinas(disciplinasResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados do aluno ou disciplinas:', error);
        setError('Erro ao carregar os dados do aluno ou disciplinas.');
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [id]);

  const handlePrint = () => {
    const printContent = document.querySelector('.boletim_impressao').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className='print-btn'>
        <button onClick={handlePrint} className="aluno-btn">
          Imprimir Boletim
        </button>
      </div>
      
      <div className='boletim_container'>
        <div className="boletim_impressao">
          <div className='boletim_cabecalho'>
            <div className="logo_escola">
              <img src={LogoAnjo} alt="Logo da Escola" />
            </div>
            <div className="escola_info">
              <h1>ESCOLA DE ENFERMAGEM ANJO GABRIEL LTDA.</h1>
              <h2>CURSO TÉCNICO DE ENFERMAGEM</h2>
              <p>Avenida Altamirando de Araújo Ramos, nº 278, Centro, Simões Filho – Bahia.</p>
              <p>Tel. 3396 1776 / 3396 2484</p>
            </div>
          </div>
          
          <div className="boletim_info_disciplina">
            {disciplinas.map((disciplina, index) => (
              <div key={index} className="disciplina_linha">
                <div className="disciplina_campo">
                  <span className="campo_label">Disciplina:</span>
                  <span className="campo_valor">{disciplina.nome}</span>
                </div>
                <div className="disciplina_campo">
                  <span className="campo_label">Carga Horária:</span>
                  <span className="campo_valor">{disciplina.carga_horaria} horas</span>
                </div>
                <div className="disciplina_campo">
                  <span className="campo_label">Professor(a):</span>
                  <span className="campo_valor">{disciplina.professor_id}</span> {/* Ajuste conforme necessário para obter o nome do professor */}
                </div>
                <div className="disciplina_campo">
                  <span className="campo_label">Turno:</span>
                  <span className="campo_valor">{disciplina.turno}</span>
                </div>
              </div>
            ))}
          </div>

          {aluno && (
            <div className="boletim_aluno_info">
              <p><strong>Aluno:</strong> {aluno.nome}</p>
              <p><strong>Matrícula:</strong> {aluno.id}</p>
              <p><strong>Curso:</strong> {aluno.curso}</p>
              <p><strong>Turno:</strong> {aluno.turno}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Boletim;