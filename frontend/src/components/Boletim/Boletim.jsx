import './Boletim.css';
import LogoAnjo from '../../assets/logoAnjo.png';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

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

        // Buscando as disciplinas do aluno
        const disciplinasResponse = await api.get(`/disciplinas?alunoId=${id}`);
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
  const getModuloDisciplinas = (modulo) => {
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
        <div className="boletim_impressao">
          <div className='boletim_cabecalho'>
            <div className="logo_escola">
              <img src={LogoAnjo} alt="Logo da Escola" />
            </div>
            <div className="escola_info">
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
            {/* {aluno && (
              <div className="info_modulo">
                <p>Aluno: {aluno.nome || ''} | Turno: {aluno.turno || ''} | Curso: {aluno.curso || 'TÉCNICO DE ENFERMAGEM'}</p>
              </div>
            )} */}
            <table className="modulo_tabela">
              <thead>
                <tr>
                  <th className="coluna_materia">MATÉRIA</th>
                  <th className="coluna_nota">TEÓRICA</th>
                  <th className="coluna_nota">PRÁTICA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ANATOMIA E FISIOLOGIA HUMANAS</td>
                  <td>{getModuloDisciplinas(1).find(d => d.nome === 'ANATOMIA E FISIOLOGIA HUMANAS')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(1).find(d => d.nome === 'ANATOMIA E FISIOLOGIA HUMANAS')?.nota_pratica || ''}</td>
                </tr>
                <tr>
                  <td>MICROBIOLOGIA E PARASITOLOGIA</td>
                  <td>{getModuloDisciplinas(1).find(d => d.nome === 'MICROBIOLOGIA E PARASITOLOGIA')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(1).find(d => d.nome === 'MICROBIOLOGIA E PARASITOLOGIA')?.nota_pratica || ''}</td>
                </tr>
                <tr>
                  <td>HIGIENE E PROFILAXIA</td>
                  <td>{getModuloDisciplinas(1).find(d => d.nome === 'HIGIENE E PROFILAXIA')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(1).find(d => d.nome === 'HIGIENE E PROFILAXIA')?.nota_pratica || ''}</td>
                </tr>
                <tr>
                  <td>NUTRIÇÃO E DIETÉTICA</td>
                  <td>{getModuloDisciplinas(1).find(d => d.nome === 'NUTRIÇÃO E DIETÉTICA')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(1).find(d => d.nome === 'NUTRIÇÃO E DIETÉTICA')?.nota_pratica || ''}</td>
                </tr>
                <tr>
                  <td>PSICOLOGIA APLICADA E ÉTICA PROFISSIONAL</td>
                  <td>{getModuloDisciplinas(1).find(d => d.nome === 'PSICOLOGIA APLICADA E ÉTICA PROFISSIONAL')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(1).find(d => d.nome === 'PSICOLOGIA APLICADA E ÉTICA PROFISSIONAL')?.nota_pratica || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* MÓDULO II */}
          <div className="modulo_container">
            <h3 className="modulo_titulo">MODULO II</h3>
            {/* {aluno && (
              <div className="info_modulo">
                <p>Aluno: {aluno.nome || ''} | Turno: {aluno.turno || ''} | Curso: {aluno.curso || 'TÉCNICO DE ENFERMAGEM'}</p>
              </div>
            )} */}
            <table className="modulo_tabela">
              <thead>
                <tr>
                  <th className="coluna_materia">MATÉRIA</th>
                  <th className="coluna_nota">TEÓRICA</th>
                  <th className="coluna_nota">PRÁTICA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>FARMACOLOGIA</td>
                  <td>{getModuloDisciplinas(2).find(d => d.nome === 'FARMACOLOGIA')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(2).find(d => d.nome === 'FARMACOLOGIA')?.nota_pratica || ''}</td>
                </tr>
                <tr>
                  <td>INTRODUÇÃO À ENFERMAGEM</td>
                  <td>{getModuloDisciplinas(2).find(d => d.nome === 'INTRODUÇÃO À ENFERMAGEM')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(2).find(d => d.nome === 'INTRODUÇÃO À ENFERMAGEM')?.nota_pratica || ''}</td>
                </tr>
                <tr>
                  <td>NOÇÕES DE ADMINISTRAÇÃO NA UNIDADE DE ENFERMAGEM</td>
                  <td>{getModuloDisciplinas(2).find(d => d.nome === 'NOÇÕES DE ADMINISTRAÇÃO NA UNIDADE DE ENFERMAGEM')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(2).find(d => d.nome === 'NOÇÕES DE ADMINISTRAÇÃO NA UNIDADE DE ENFERMAGEM')?.nota_pratica || ''}</td>
                </tr>
                <tr>
                  <td>BIOSSEGURANÇA</td>
                  <td>{getModuloDisciplinas(2).find(d => d.nome === 'BIOSSEGURANÇA')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(2).find(d => d.nome === 'BIOSSEGURANÇA')?.nota_pratica || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* MÓDULO III */}
          <div className="modulo_container">
            <h3 className="modulo_titulo">MODULO III</h3>
            {/* {aluno && (
              <div className="info_modulo">
                <p>Aluno: {aluno.nome || ''} | Turno: {aluno.turno || ''} | Curso: {aluno.curso || 'TÉCNICO DE ENFERMAGEM'}</p>
              </div>
            )} */}
            <table className="modulo_tabela">
              <thead>
                <tr>
                  <th className="coluna_materia">MATÉRIA</th>
                  <th className="coluna_nota">TEÓRICA</th>
                  <th className="coluna_nota">PRÁTICA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ENFERMAGEM NAS EMERGÊNCIAS</td>
                  <td>{getModuloDisciplinas(3).find(d => d.nome === 'ENFERMAGEM NAS EMERGÊNCIAS')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(3).find(d => d.nome === 'ENFERMAGEM NAS EMERGÊNCIAS')?.nota_pratica || ''}</td>
                </tr>
                <tr>
                  <td>ENFERMAGEM EM CLÍNICA MÉDICA</td>
                  <td>{getModuloDisciplinas(3).find(d => d.nome === 'ENFERMAGEM EM CLÍNICA MÉDICA')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(3).find(d => d.nome === 'ENFERMAGEM EM CLÍNICA MÉDICA')?.nota_pratica || ''}</td>
                </tr>
                <tr>
                  <td>ENFERMAGEM EM CLÍNICA CIRÚRGICA</td>
                  <td>{getModuloDisciplinas(3).find(d => d.nome === 'ENFERMAGEM EM CLÍNICA CIRÚRGICA')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(3).find(d => d.nome === 'ENFERMAGEM EM CLÍNICA CIRÚRGICA')?.nota_pratica || ''}</td>
                </tr>
                <tr>
                  <td>ENFERMAGEM MATERNO INFANTIL</td>
                  <td>{getModuloDisciplinas(3).find(d => d.nome === 'ENFERMAGEM MATERNO INFANTIL')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(3).find(d => d.nome === 'ENFERMAGEM MATERNO INFANTIL')?.nota_pratica || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* MÓDULO IV */}
          <div className="modulo_container">
            <h3 className="modulo_titulo">MODULO IV</h3>
            {/* {aluno && (
              <div className="info_modulo">
                <p>Aluno: {aluno.nome || ''} | Turno: {aluno.turno || ''} | Curso: {aluno.curso || 'TÉCNICO DE ENFERMAGEM'}</p>
              </div>
            )} */}
            <table className="modulo_tabela">
              <thead>
                <tr>
                  <th className="coluna_materia">MATÉRIA</th>
                  <th className="coluna_nota">TEÓRICA</th>
                  <th className="coluna_nota">PRÁTICA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ENFERMAGEM PEDIÁTRICA</td>
                  <td>{getModuloDisciplinas(4).find(d => d.nome === 'ENFERMAGEM PEDIÁTRICA')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(4).find(d => d.nome === 'ENFERMAGEM PEDIÁTRICA')?.nota_pratica || ''}</td>
                </tr>
                <tr>
                  <td>ENFERMAGEM EM SAÚDE PÚBLICA</td>
                  <td>{getModuloDisciplinas(4).find(d => d.nome === 'ENFERMAGEM EM SAÚDE PÚBLICA')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(4).find(d => d.nome === 'ENFERMAGEM EM SAÚDE PÚBLICA')?.nota_pratica || ''}</td>
                </tr>
                <tr>
                  <td>ENFERMAGEM EM SAÚDE MENTAL</td>
                  <td>{getModuloDisciplinas(4).find(d => d.nome === 'ENFERMAGEM EM SAÚDE MENTAL')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(4).find(d => d.nome === 'ENFERMAGEM EM SAÚDE MENTAL')?.nota_pratica || ''}</td>
                </tr>
                <tr>
                  <td>ENFERMAGEM EM GERIATRIA</td>
                  <td>{getModuloDisciplinas(4).find(d => d.nome === 'ENFERMAGEM EM GERIATRIA')?.nota_teorica || ''}</td>
                  <td>{getModuloDisciplinas(4).find(d => d.nome === 'ENFERMAGEM EM GERIATRIA')?.nota_pratica || ''}</td>
                </tr>
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