import './Boletim.css';
import LogoAnjo from '../../assets/logoAnjo.png';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import VoltarButton from '../VoltarButton/VoltarButton';

const Boletim = () => {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const boletimRef = useRef(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Buscando os dados do aluno
        const alunoResponse = await api.get(`/alunos/${id}`);
        if (!alunoResponse.data) {
          throw new Error('Nenhum dado retornado pela API.');
        }
        setAluno(alunoResponse.data);

        // Buscando todas as disciplinas
        const disciplinasResponse = await api.get('/disciplinas');
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
    window.print();
  };

  // Organizar as disciplinas por módulo
  const getModuloDisciplinas = (moduloNumero) => {
    const modulo = `Modulo ${moduloNumero}`;
    return disciplinas.filter(disciplina => disciplina.modulo === modulo) || [];
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => window.location.reload()} className="retry-button">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className='print-btn no-print'>
        <button onClick={handlePrint} className="aluno-btn">
          Imprimir Boletim
        </button>
      </div>

      <div className='boletim_container print-content' ref={boletimRef}>
        <div className="no-print">
          <VoltarButton url='/alunos' />
        </div>
        <div className="boletim_impressao">
          <div className='boletim_cabecalho'>
            <div className="escola_info">
            <div className="logo_escola">
              <img src={LogoAnjo} alt="Logo da Escola" />
            </div>
              <h1>ESCOLA DE ENFERMAGEM ANJO GABRIEL LTDA.</h1>
              <h2>CURSO TÉCNICO DE ENFERMAGEM</h2>
              <p>Avenida Altamirando de Araújo Ramos, nº 278, 1º andar, Centro,</p>
              <p>Simões Filho - Bahia Tel. 3396 2484 / 3396 1776</p>
              <h2 className="boletim_titulo">BOLETIM DO ALUNO</h2>
            </div>
          </div>

          {aluno && (
            <div className="boletim_aluno_info">
              <p><strong>Aluno:</strong> {aluno.nome || ''}</p>
              <p><strong>Matrícula:</strong> {aluno.id || ''}</p>
              <p><strong>Curso:</strong> {aluno.curso || 'TÉCNICO DE ENFERMAGEM'}</p>
              <p><strong>Turno:</strong> {aluno.turno || ''}</p>
            </div>
          )}

          {/* MÓDULO I */}
          <div className="modulo_container">
            <h3 className="modulo_titulo">MODULO I</h3>
            <table className="modulo_tabela">
              <thead>
                <tr>
                  <th className="coluna_materia">MATÉRIA</th>
                  <th className="coluna_nota">TEÓRICA</th>
                  <th className="coluna_nota">PRÁTICA</th>
                </tr>
              </thead>
              <tbody>
                {getModuloDisciplinas(1).length > 0 ? (
                  getModuloDisciplinas(1).map((disciplina) => (
                    <tr key={disciplina.id}>
                      <td>{disciplina.nome}</td>
                      <td>{disciplina.nota_teorica || ''}</td>
                      <td>{disciplina.nota_pratica || ''}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr><td>Sem disciplinas cadastradas</td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* MÓDULO II */}
          <div className="modulo_container">
            <h3 className="modulo_titulo">MODULO II</h3>
            <table className="modulo_tabela">
              <thead>
                <tr>
                  <th className="coluna_materia">MATÉRIA</th>
                  <th className="coluna_nota">TEÓRICA</th>
                  <th className="coluna_nota">PRÁTICA</th>
                </tr>
              </thead>
              <tbody>
                {getModuloDisciplinas(2).length > 0 ? (
                  getModuloDisciplinas(2).map((disciplina) => (
                    <tr key={disciplina.id}>
                      <td>{disciplina.nome}</td>
                      <td>{disciplina.nota_teorica || ''}</td>
                      <td>{disciplina.nota_pratica || ''}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr><td>Sem disciplinas cadastradas</td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* MÓDULO III */}
          <div className="modulo_container">
            <h3 className="modulo_titulo">MODULO III</h3>
            <table className="modulo_tabela">
              <thead>
                <tr>
                  <th className="coluna_materia">MATÉRIA</th>
                  <th className="coluna_nota">TEÓRICA</th>
                  <th className="coluna_nota">PRÁTICA</th>
                </tr>
              </thead>
              <tbody>
                {getModuloDisciplinas(3).length > 0 ? (
                  getModuloDisciplinas(3).map((disciplina) => (
                    <tr key={disciplina.id}>
                      <td>{disciplina.nome}</td>
                      <td>{disciplina.nota_teorica || ''}</td>
                      <td>{disciplina.nota_pratica || ''}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr><td>Sem disciplinas cadastradas</td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* MÓDULO IV */}
          <div className="modulo_container">
            <h3 className="modulo_titulo">MODULO IV</h3>
            <table className="modulo_tabela">
              <thead>
                <tr>
                  <th className="coluna_materia">MATÉRIA</th>
                  <th className="coluna_nota">TEÓRICA</th>
                  <th className="coluna_nota">PRÁTICA</th>
                </tr>
              </thead>
              <tbody>
                {getModuloDisciplinas(4).length > 0 ? (
                  getModuloDisciplinas(4).map((disciplina) => (
                    <tr key={disciplina.id}>
                      <td>{disciplina.nome}</td>
                      <td>{disciplina.nota_teorica || ''}</td>
                      <td>{disciplina.nota_pratica || ''}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr><td>Sem disciplinas cadastradas</td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="observacoes_container">
            <p className="observacoes_titulo">Observações:</p>
            <div className="observacoes_conteudo"></div>
          </div>

          <div className="rodape_boletim">
            <div className="assinaturas">
              <div className="assinatura_campo">
                <div className="linha_assinatura"></div>
                <p>Secretário(a)</p>
              </div>
              <div className="assinatura_campo">
                <div className="linha_assinatura"></div>
                <p>Diretor(a)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boletim;