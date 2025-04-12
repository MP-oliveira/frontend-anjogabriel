import './Mensalidade.css';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const Mensalidade = () => {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
  const [mesesPage1, setMesesPage1] = useState([]);
  const [mesesPage2, setMesesPage2] = useState([]);
  const mensalidadePage1Ref = useRef(null);
  const mensalidadePage2Ref = useRef(null);

  const mesesNomes = [
    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
  ];

  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Buscando os dados do aluno
        const alunoResponse = await api.get(`/alunos/${id}`);
        if (!alunoResponse.data) {
          throw new Error('Nenhum dado retornado pela API.');
        }
        setAluno(alunoResponse.data);
        
        // Determinar o ano de início com base na data de inscrição do aluno
        if (alunoResponse.data.data_matricula) {
          const dataMatricula_ = new Date(alunoResponse.data.data_matricula);
          setAnoAtual(dataMatricula_.getFullYear());

          // Gerar os meses para as duas páginas usando a data de matrícula
          gerarMeses(alunoResponse.data.data_matricula);
        } else {
          throw new Error('Data de matrícula não encontrada.');
        }

      } catch (error) {
        console.error('Erro ao buscar dados do aluno:', error);
        setError('Erro ao carregar os dados do aluno: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [id]);

  const gerarMeses = (dataInscricao) => {
    const mesInicio = dataInscricao ? new Date(dataInscricao).getMonth() : 0;
    const anoInicio = dataInscricao ? new Date(dataInscricao).getFullYear() : new Date().getFullYear();
    
    let mesesPrimeiraPagina = [];
    let mesesSegundaPagina = [];
    
    for (let i = 0; i < 24; i++) {
      const mesIndex = (mesInicio + i) % 12;
      const ano = anoInicio + Math.floor((mesInicio + i) / 12);
      
      // Define o dia de vencimento como o dia 5
      const diaVencimento = 5;
      const mes = {
        nome: mesesNomes[mesIndex],
        ano: ano,
        vencimento: `${diaVencimento}/` + String(mesIndex + 1).padStart(2, '0') + `/${ano}`,
        valor: 280.00,
        desconto: 20.00,
        valorComDesconto: 260.00
      };
      
      if (i < 12) {
        mesesPrimeiraPagina.push(mes);
      } else {
        mesesSegundaPagina.push(mes);
      }
    }
    
    setMesesPage1(mesesPrimeiraPagina);
    setMesesPage2(mesesSegundaPagina);
  };

  const handlePrint = () => {
    window.print();
  };


  const handlePrintPage1 = () => handlePrint(mensalidadePage1Ref);
  const handlePrintPage2 = () => handlePrint(mensalidadePage2Ref);
  const handlePrintAll = () => window.print();

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
    <div className="mensalidade-page-container">
      <h2 className= 'no-print'>MENSALIDADES DO ALUNO - ANO {anoAtual}</h2>
      <div className='print-btn no-print'>
        <button onClick={handlePrintAll} className="mensalidade-btn">
          Imprimir Todas Mensalidades
        </button>
        <button onClick={handlePrintPage1} className="mensalidade-btn">
          Imprimir Primeiro Ano
        </button>
        <button onClick={handlePrintPage2} className="mensalidade-btn">
          Imprimir Segundo Ano
        </button>
      </div>
      
      {/* Página 1 - Primeiros 12 meses */}
      <div className='mensalidade-carnets print-content page-break' ref={mensalidadePage1Ref}>
        <div className="carnets-grid">
          {mesesPage1.map((mes, index) => (
            <div key={index} className="carnet-card">
              <table className="carnet-table">
                <tbody>
                  <tr>
                    <td className="left-col">
                      Local de Pagamento<br />
                      <strong>PAGÁVEL NA SECRETARIA DA ESCOLA</strong>
                    </td>
                    <td className="right-col">
                      Vencimento<br />
                      <strong>{mes.vencimento}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="left-col">
                      Cedente<br />
                      <strong>Escola de Enfermagem Anjo Gabriel <br />
                        <em>Vespertino</em></strong>
                    </td>
                    <td className="right-col">
                      Valor da Cota<br />
                      <strong>{mes.valor.toFixed(2).replace('.', ',')}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="left-col multi-line">
                      <div><strong>Mensalidade ref. {mes.nome}</strong></div>
                      <div className="obs-text"><strong>OBS: PAGAMENTO ATÉ O DIA {mes.vencimento.substring(0, 2)} DESCONTO DE {mes.desconto.toFixed(2).replace('.', ',')}</strong></div>
                      <div className="small-text">Após vencimento: Multa 2,00% = R$ 5,20 Juros 0,033% a.d = R$ 0,08 / dia</div>
                    </td>
                    <td className="right-col">JUROS / MULTA</td>
                  </tr>
                  <tr>
                    <td className="left-col">
                      Nome do Aluno<br />
                      <strong>{aluno?.nome || ''}</strong>
                    </td>
                    <td className="right-col">
                      Total Cobrado<br />
                      <strong></strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* Página 2 - Últimos 12 meses */}
      <div className='mensalidade-carnets print-content' ref={mensalidadePage2Ref}>
        <div className="carnets-grid">
          {mesesPage2.map((mes, index) => (
            <div key={index} className="carnet-card">
              <table className="carnet-table">
                <tbody>
                  <tr>
                    <td className="left-col">
                      Local de Pagamento<br />
                      <strong>PAGÁVEL NA SECRETARIA DA ESCOLA</strong>
                    </td>
                    <td className="right-col">
                      Vencimento<br />
                      <strong>{mes.vencimento}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="left-col">
                      Cedente<br />
                      <strong>Escola de Enfermagem Anjo Gabriel 
                      <em>Vespertino</em></strong> <br />
                    </td>
                    <td className="right-col">
                      Valor da Cota<br />
                      <strong>{mes.valor.toFixed(2).replace('.', ',')}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="left-col multi-line">
                      <div><strong>Mensalidade ref. {mes.nome}</strong></div>
                      <div className="obs-text"><strong>OBS: PAGAMENTO ATÉ O DIA {mes.vencimento.substring(0, 2)} DESCONTO DE {mes.desconto.toFixed(2).replace('.', ',')}</strong></div>
                      <div className="small-text">Após vencimento: Multa 2,00% = R$ 5,20 Juros 0,033% a.d = R$ 0,08 / dia</div>
                    </td>
                    <td className="right-col">JUROS / MULTA</td>
                  </tr>
                  <tr>
                    <td className="left-col">
                      Nome do Aluno<br />
                      <strong>{aluno?.nome || ''}</strong>
                    </td>
                    <td className="right-col">
                      Total Cobrado<br />
                      <strong></strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mensalidade;