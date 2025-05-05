import './FundoDiploma.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const FundoDiploma = () => {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);
  const [registrosAcademicos, setRegistrosAcademicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Buscando os dados do aluno
        if (id) {
          const alunoResponse = await api.get(`/alunos/${id}`);
          if (!alunoResponse.data) {
            throw new Error('Nenhum dado de aluno retornado pela API.');
          }
          setAluno(alunoResponse.data);
          
          // Buscando registros acadêmicos do aluno
          await fetchRegistrosAcademicos(alunoResponse.data.id);
        }

        // Buscando todas as disciplinas
        const disciplinasResponse = await api.get('/disciplinas');
        if (!disciplinasResponse.data) {
          throw new Error('Nenhum dado de disciplinas retornado pela API.');
        }
        setDisciplinas(disciplinasResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados para o diploma:', error);
        setError('Erro ao carregar os dados necessários para o diploma.');
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [id]);
  
  // Função para buscar os registros acadêmicos do aluno
  const fetchRegistrosAcademicos = async (alunoId) => {
    try {
      // Tentativa 1: Buscar do endpoint específico de aluno (se existir)
      try {
        console.log("Buscando registros acadêmicos do aluno ID:", alunoId);
        const registrosResponse = await api.get(`/registroacademico/aluno/${alunoId}`);
        
        if (registrosResponse.data && Array.isArray(registrosResponse.data) && registrosResponse.data.length > 0) {
          console.log("Registros acadêmicos encontrados:", registrosResponse.data);
          setRegistrosAcademicos(registrosResponse.data);
          return;
        }
      } catch (endpointError) {
        console.warn("Endpoint específico de aluno falhou, tentando alternativa:", endpointError);
      }
      
      // Tentativa 2: Buscar da listagem completa e filtrar
      const registrosResponse = await api.get('/registroacademico');
      console.log("Todos os registros acadêmicos:", registrosResponse.data);
      
      if (registrosResponse.data && Array.isArray(registrosResponse.data)) {
        // Filtrar registros pelo ID do aluno
        const registrosDoAluno = registrosResponse.data.filter(reg => 
          reg.alunoId === alunoId || (reg.aluno && reg.aluno.toLowerCase().includes(aluno?.nome?.toLowerCase() || ''))
        );
        
        console.log("Registros filtrados para o aluno:", registrosDoAluno);
        setRegistrosAcademicos(registrosDoAluno);
      }
    } catch (error) {
      console.error("Erro ao buscar registros acadêmicos:", error);
    }
  };

  // Organizar as disciplinas por módulo e adicionar notas dos registros acadêmicos
  const getModuloDisciplinas = (moduloNumero) => {
    const modulo = `Modulo ${moduloNumero}`;
    const disciplinasModulo = disciplinas.filter(disciplina => disciplina.modulo === modulo) || [];
    
    // Adicionar notas dos registros acadêmicos às disciplinas
    return disciplinasModulo.map(disciplina => {
      // Procurar o registro acadêmico correspondente a esta disciplina
      const registro = registrosAcademicos.find(reg => 
        reg.disciplinaId === disciplina.id || 
        (reg.disciplina && reg.disciplina.toLowerCase() === disciplina.nome.toLowerCase())
      );
      
      // Se encontrou um registro acadêmico, adiciona as notas
      if (registro) {
        return {
          ...disciplina,
          nota_teorica: calcularNotaTeorica(registro),
          nota_pratica: registro.estagioNota !== undefined && registro.estagioNota !== null ? 
                        registro.estagioNota.toFixed(1) : ''
        };
      }
      
      return disciplina;
    });
  };
  
  // Função para calcular a nota teórica com base nas notas de prova, teste e trabalho
  const calcularNotaTeorica = (registro) => {
    if (!registro) return '';
    
    // Verificar se pelo menos uma das notas está disponível
    const temNotas = (
      (registro.notaProva !== undefined && registro.notaProva !== null) ||
      (registro.notaTeste !== undefined && registro.notaTeste !== null) ||
      (registro.notaTrabalho !== undefined && registro.notaTrabalho !== null)
    );
    
    if (!temNotas) return '';
    
    // Calcular a média das notas disponíveis
    let soma = 0;
    let quantidade = 0;
    
    if (registro.notaProva !== undefined && registro.notaProva !== null) {
      soma += registro.notaProva;
      quantidade++;
    }
    
    if (registro.notaTeste !== undefined && registro.notaTeste !== null) {
      soma += registro.notaTeste;
      quantidade++;
    }
    
    if (registro.notaTrabalho !== undefined && registro.notaTrabalho !== null) {
      soma += registro.notaTrabalho;
      quantidade++;
    }
    
    if (quantidade === 0) return '';
    
    return (soma / quantidade).toFixed(1);
  };

  // Função para obter a carga horária teórica de uma disciplina
  const getCargaHoraria = (disciplina) => {
    return disciplina?.carga_horaria || '';
  };

  // Função para obter a carga horária de estágio de uma disciplina
  const getCargaHorariaEstagio = (disciplina) => {
    return disciplina?.carga_horaria_estagio || '';
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="diploma-container">
      <div className="page-border"></div>

      <div className="diploma-content">
        {/* Seção Superior */}
        <section className="curso-info">
          <div className="info-row-top">
            <span className="label">CURSO ANTERIOR:</span>
            <span className="value">ENSINO MÉDIO</span>
            <span className="label">ANO DE CONCLUSÃO:</span>
            <span className="value"></span>
          </div>
          <div className="info-row-bottom">
            <span className="label">ESTABELECIMENTO:</span>
            <span className="value"></span>
            <span className="label-local">LOCAL:</span>
            <span className="value"></span>
          </div>
        </section>

        <section className="curso-atual">
          <div className="info-row">
            <span className="label">CURSO:</span>
            <span className="value">Educação Profissional Técnica de Nível Médio em Enfermagem</span>
          </div>
          <div className="info-row">
            <span className="label">Eixo Tecnológico:</span>
            <span className="value">Ambiente, Saúde e Segurança</span>
          </div>
          <div className="dates-row">
            <div className="info-row">
              <span className="label">INICIO DO CURSO:</span>
              <span className="value">{aluno?.data_matricula ? new Date(aluno.data_matricula).toLocaleDateString('pt-BR') : ''}</span>
            </div>
            <div className="info-row">
              <span className="label">TERMINO:</span>
              <span className="value"></span>
            </div>
          </div>
        </section>

        {/* Perfil e Competências */}
        <section className="perfil-section">
          <p className="section-title">PERFIL PROFISSIONAL DO TÉCNICO DE ENFERMAGEM: </p>
          <span className="section-text"> Prestar cuidados de enfermagem a individuo e população com a prerrogativa legal
            de assistir ao Enfermeiro nos diferentes níveis de atenção a saúde, em especial junto a pacientes graves e/ou
            com demandas especiais e no planejamento, programação orientação
            e supervisão das atividades de assistência, com integrante da equipe.</span>

        </section>
        <section className="competencia-section">
          <div className="section-title">COMPETÊNCIA ESPECÍFICA DO TÉCNICO DE ENFERMAGEM: </div>
          <p className="section-text"> Participar do planejamento, programação e orientação das atividades de assistência de enfermagem; Desempenhar ações de enfermagem inclusive a paciente em estado grave nos níveis de promoção,
            proteção, recuperação e de reabilitação da saúde do individuo e/ ou grupos sociais, excetuando-se aos cuidados requeridos por pacientes com risco de vida; Participar da prevenção e controle sistemático da infecção hospitalar; Atuar nos programas de higiene e
            segurança no trabalho; Participar da implementação de programa de vigilância a saúde; Desenvolver atividades de educação e comunicação em saúde; participar de programas / projetos de pesqu isa; Conhecer e aplicar princípios éticos profissionais, forma de
            conduta, noções básicas sobre o Código de Deontologia de Enfermagem, informações sobre o Órgão de Classe, ler e interpretar os dispositivos legais que orientam a formação do exercício profissional na enfermagem; Prestar assistência integral a binômia mãe
            filho durante o pré-natal, parto e puerpério e orientar quanto a importância do aleitamento materno. Conhecer as diversas fases do crescimento e desenvolvimento da criança, suas característica as reações da criança frente a hospitalização e atender para a
            amenização dos conflitos. Conhecer as ações do saneamento básico e sua importância na prevenção das doenças transmissíveis. Conhecer os transtornos mentais, formas de tratamento, cuidados e seguranças nas intercorrências psiquiátricas desfazendo
            preconceitos e favorecendo a integração social do doente.</p>
        </section>

        {/* Tabelas de Módulos */}
        <section className="modulos-section">
          <table className="modulo-table">
            <tbody>
              {/* Módulo I */}
              <tr className="header-row">
                <td >Módulo I</td>
                <td>Carga Horária / Semestral</td>
                <td className='no-border'>Autenticação da Escola</td>
              </tr>
              <tr>
                <td>
                  <table className="inner-table">
                    <thead>
                      <tr>
                        <th>Componentes Curriculares</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getModuloDisciplinas(1).length > 0 ? (
                        getModuloDisciplinas(1).map((disciplina) => (
                          <tr key={disciplina.id}><td>{disciplina.nome}</td></tr>
                        ))
                      ) : (
                        <>
                          <tr><td>Anatomia e Fisiologia Humanas</td></tr>
                          <tr><td>Microbiologia e Parasitologia</td></tr>
                          <tr><td>Higiene e Profilaxia</td></tr>
                          <tr><td>Nutrição e Dietética</td></tr>
                          <tr><td>Psicologia Aplicada e Ética Profissional</td></tr>
                        </>
                      )}
                      <tr><td className="subtotal-row">Sub - Total</td></tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="inner-table">
                    <thead className='thead-teoria'>
                      <tr>
                        <th>Teoria/ Prática</th>
                        <th>Notas</th>
                        <th>Estágio</th>
                        <th>Notas</th>
                      </tr>
                    </thead>
                    <tbody className='body-flex'>
                      {getModuloDisciplinas(1).length > 0 ? (
                        getModuloDisciplinas(1).map((disciplina) => (
                          <tr key={disciplina.id}>
                            <td>{getCargaHoraria(disciplina)}</td>
                            <td>{disciplina.nota_teorica || ''}</td>
                            <td>{getCargaHorariaEstagio(disciplina) > 0 ? getCargaHorariaEstagio(disciplina) : '-'}</td>
                            <td>{disciplina.nota_pratica || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr>
                            <td>100</td>
                            <td></td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>80</td>
                            <td></td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>50</td>
                            <td></td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>50</td>
                            <td></td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>50</td>
                            <td></td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                        </>
                      )}
                      <tr className="subtotal-row">
                        <td>{getModuloDisciplinas(1).reduce((total, disciplina) => total + (Number(getCargaHoraria(disciplina)) || 0), 0) || 330}</td>
                        <td></td>
                        <td>{getModuloDisciplinas(1).reduce((total, disciplina) => total + (Number(getCargaHorariaEstagio(disciplina)) || 0), 0) || '-'}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td rowSpan="8" className="autenticacao-cell">
                  <div className="autenticacao-content">
                    <div className="linha-assinatura"></div>
                    <p>Autenticação da Escola</p>
                    <p className="codigo">CM CS:58/2018BA</p>
                    <p>Campo Reservado ao COREN</p>
                  </div>
                </td>
              </tr>

              {/* Módulo II */}
              <tr>
                <th>Módulo II</th>
              </tr>
              <tr>
                <td>
                  <table className="inner-table">
                    <thead>
                      <tr>
                        <th>Componentes Curriculares</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getModuloDisciplinas(2).length > 0 ? (
                        getModuloDisciplinas(2).map((disciplina) => (
                          <tr key={disciplina.id}><td>{disciplina.nome}</td></tr>
                        ))
                      ) : (
                        <>
                          <tr><td>Farmacologia</td></tr>
                          <tr><td>Introdução a Enfermagem</td></tr>
                          <tr><td>Noções de Administração na Unidade de Enfermagem</td></tr>
                          <tr><td>Biossegurança</td></tr>
                        </>
                      )}
                      <tr><td className="subtotal-row">Sub - Total</td></tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="inner-table">
                    <thead className='thead-teoria'>
                      <tr>
                        <th>Teoria/ Prática</th>
                        <th>Notas</th>
                        <th>Estágio</th>
                        <th>Notas</th>
                      </tr>
                    </thead>
                    <tbody className='body-flex'>
                      {getModuloDisciplinas(2).length > 0 ? (
                        getModuloDisciplinas(2).map((disciplina) => (
                          <tr key={disciplina.id}>
                            <td>{getCargaHoraria(disciplina)}</td>
                            <td>{disciplina.nota_teorica || ''}</td>
                            <td>{getCargaHorariaEstagio(disciplina) > 0 ? getCargaHorariaEstagio(disciplina) : '-'}</td>
                            <td>{disciplina.nota_pratica || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr>
                            <td>60</td>
                            <td></td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>100</td>
                            <td></td>
                            <td>100</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>50</td>
                            <td></td>
                            <td>40</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>50</td>
                            <td></td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                        </>
                      )}
                      <tr className="subtotal-row">
                        <td>{getModuloDisciplinas(2).reduce((total, disciplina) => total + (Number(getCargaHoraria(disciplina)) || 0), 0) || 260}</td>
                        <td></td>
                        <td>{getModuloDisciplinas(2).reduce((total, disciplina) => total + (Number(getCargaHorariaEstagio(disciplina)) || 0), 0) || 140}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Módulo III */}
              <tr>
                <th>
                  Módulo III
                </th>
              </tr>
              <tr>
                <td>
                  <table className="inner-table">
                    <thead>
                      <tr>
                        <th>Componentes Curriculares</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getModuloDisciplinas(3).length > 0 ? (
                        getModuloDisciplinas(3).map((disciplina) => (
                          <tr key={disciplina.id}><td>{disciplina.nome}</td></tr>
                        ))
                      ) : (
                        <>
                          <tr><td>Enfermagem nas Emergências</td></tr>
                          <tr><td>Enfermagem em Clínica Médica</td></tr>
                          <tr><td>Enfermagem em Clínica Cirúrgica</td></tr>
                          <tr><td>Enfermagem Materno Infantil</td></tr>
                        </>
                      )}
                      <tr><td className="subtotal-row">Sub - Total</td></tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="inner-table">
                    <thead className='thead-teoria'>
                      <tr>
                        <th>Teoria/ Prática</th>
                        <th>Notas</th>
                        <th>Estágio</th>
                        <th>Notas</th>
                      </tr>
                    </thead>
                    <tbody className='body-flex'>
                      {getModuloDisciplinas(3).length > 0 ? (
                        getModuloDisciplinas(3).map((disciplina) => (
                          <tr key={disciplina.id}>
                            <td>{getCargaHoraria(disciplina)}</td>
                            <td>{disciplina.nota_teorica || ''}</td>
                            <td>{getCargaHorariaEstagio(disciplina) > 0 ? getCargaHorariaEstagio(disciplina) : '-'}</td>
                            <td>{disciplina.nota_pratica || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr>
                            <td>70</td>
                            <td></td>
                            <td>70</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>100</td>
                            <td></td>
                            <td>100</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>60</td>
                            <td></td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>70</td>
                            <td></td>
                            <td>50</td>
                            <td></td>
                          </tr>
                        </>
                      )}
                      <tr className="subtotal-row">
                        <td>{getModuloDisciplinas(3).reduce((total, disciplina) => total + (Number(getCargaHoraria(disciplina)) || 0), 0) || 300}</td>
                        <td></td>
                        <td>{getModuloDisciplinas(3).reduce((total, disciplina) => total + (Number(getCargaHorariaEstagio(disciplina)) || 0), 0) || 220}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Módulo IV */}
              <tr>
                <th>
                  Módulo IV
                </th>
              </tr>
              <tr>
                <td>
                  <table className="inner-table">
                    <thead>
                      <tr>
                        <th>Componentes Curriculares</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getModuloDisciplinas(4).length > 0 ? (
                        getModuloDisciplinas(4).map((disciplina) => (
                          <tr key={disciplina.id}><td>{disciplina.nome}</td></tr>
                        ))
                      ) : (
                        <>
                          <tr><td>Enfermagem Pediátrica</td></tr>
                          <tr><td>Enfermagem em Saúde Publica</td></tr>
                          <tr><td>Enfermagem em Saúde Mental</td></tr>
                          <tr><td>Enfermagem em Geriatria</td></tr>
                        </>
                      )}
                      <tr><td className="subtotal-row">Sub-Total</td></tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="inner-table">
                    <thead className='thead-teoria'>
                      <tr>
                        <th>Teoria/ Prática</th>
                        <th>Notas</th>
                        <th>Estágio</th>
                        <th>Notas</th>
                      </tr>
                    </thead>
                    <tbody className='body-flex'>
                      {getModuloDisciplinas(4).length > 0 ? (
                        getModuloDisciplinas(4).map((disciplina) => (
                          <tr key={disciplina.id}>
                            <td>{getCargaHoraria(disciplina)}</td>
                            <td>{disciplina.nota_teorica || ''}</td>
                            <td>{getCargaHorariaEstagio(disciplina) > 0 ? getCargaHorariaEstagio(disciplina) : '-'}</td>
                            <td>{disciplina.nota_pratica || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr>
                            <td>70</td>
                            <td></td>
                            <td>50</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>100</td>
                            <td></td>
                            <td>90</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>70</td>
                            <td></td>
                            <td>50</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>70</td>
                            <td></td>
                            <td>50</td>
                            <td></td>
                          </tr>
                        </>
                      )}
                      <tr className="subtotal-row">
                        <td>{getModuloDisciplinas(4).reduce((total, disciplina) => total + (Number(getCargaHoraria(disciplina)) || 0), 0) || 310}</td>
                        <td></td>
                        <td>{getModuloDisciplinas(4).reduce((total, disciplina) => total + (Number(getCargaHorariaEstagio(disciplina)) || 0), 0) || 240}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Total Geral */}
              <tr>
                <td>
                  <table className="inner-table">
                    <tbody className='tbody-footer'>
                      <tr>
                        <td className="total-row">Total Geral</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="inner-table">
                    <tbody className='tbody-total'>
                      <tr className="total-row">
                        <td>
                          {disciplinas.reduce((total, disciplina) => total + (Number(getCargaHoraria(disciplina)) || 0), 0) || 1200}
                        </td>
                        <td></td>
                        <td>
                          {disciplinas.reduce((total, disciplina) => total + (Number(getCargaHorariaEstagio(disciplina)) || 0), 0) || 600}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div >
  );
};

export default FundoDiploma;