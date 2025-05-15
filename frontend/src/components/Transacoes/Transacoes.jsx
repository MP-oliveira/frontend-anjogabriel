import { useEffect, useState } from 'react';
import api from '../../services/api';
import './Transacoes.css'; // Certifique-se de que o CSS está correto
import { Link } from 'react-router-dom';
import VoltarButton from '../VoltarButton/VoltarButton';
import { CircularProgress } from '@mui/material';

// Função utilitária para formatar data yyyy-mm-dd para dd/mm/yyyy
const formatarData = (dataStr) => {
  if (!dataStr) return '';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
};

function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [transacoesFiltradas, setTransacoesFiltradas] = useState([]);
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroData, setFiltroData] = useState({
    dataInicio: '',
    dataFim: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Buscar transações
      const transacoesResponse = await api.get('/financeiro');
      
      // Ordenar transações por data
      const transacoesOrdenadas = [...transacoesResponse.data].sort((a, b) => 
        new Date(b.data) - new Date(a.data)
      );
      
      setTransacoes(transacoesOrdenadas);
      setTransacoesFiltradas(transacoesOrdenadas);
      
      // Buscar contas
      const contasResponse = await api.get('/financeiro/contas');

      setContas(contasResponse.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Erro ao buscar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    
    if (!filtroData.dataInicio || !filtroData.dataFim) {
      setTransacoesFiltradas(transacoes);
      return;
    }

    const dataInicio = new Date(filtroData.dataInicio);
    const dataFim = new Date(filtroData.dataFim);
    
    // Ajusta a data fim para incluir todo o dia
    dataFim.setHours(23, 59, 59, 999);

    const transacoesFiltradas = transacoes.filter(transacao => {
      const dataTransacao = new Date(transacao.data);
      return dataTransacao >= dataInicio && dataTransacao <= dataFim;
    });

    setTransacoesFiltradas(transacoesFiltradas);
  };

  const handleLimparFiltro = () => {
    setFiltroData({
      dataInicio: '',
      dataFim: ''
    });
    setTransacoesFiltradas(transacoes);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress sx={{ color: '#fff' }} />
        <p>Carregando transações...</p>
      </div>
    );
  }

  return (
    <>
      <div className="form-container">
        <div className="form-add">
          <VoltarButton url='/dashboard' />
          <h1 className='transaction-h1'>Transações Financeiras</h1>
          {error && <div className="error-message">{error}</div>}

          {/* Formulário de filtro */}
          <form onSubmit={handleFilterSubmit} className="filter-form">
            <div className="filter-inputs">
              <div className="input-group">
                <label>Data Inicial</label>
                <input
                  type="date"
                  value={filtroData.dataInicio}
                  onChange={(e) => setFiltroData({ ...filtroData, dataInicio: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Data Final</label>
                <input
                  type="date"
                  value={filtroData.dataFim}
                  onChange={(e) => setFiltroData({ ...filtroData, dataFim: e.target.value })}
                />
              </div>
            </div>
            <div className="filter-buttons">
              <button className='filter' type="submit">Filtrar</button>
              <button className='limpar' type="button" onClick={handleLimparFiltro}>Limpar Filtro</button>
            </div>
          </form>

          {/* Exibir contas e seus saldos */}
          <div className="contas-container">
            <h2>Contas Bancárias</h2>
            <div className="contas-grid">
              {contas.map(conta => (
                <div key={conta.id} className="conta-card">
                  <h3>{conta.nome}</h3>
                  <p className={`saldo ${parseFloat(conta.saldo_atual) >= 0 ? 'positivo' : 'negativo'}`}>
                    Saldo: R$ {parseFloat(conta.saldo_atual).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {transacoesFiltradas.length === 0 ? (
            <p>Nenhuma transação encontrada.</p>
          ) : (
            <>
              <p className="total-transacoes">Total de transações: {transacoesFiltradas.length}</p>
              <ul className="transacoes-list">
                {transacoesFiltradas.map(transacao => (
                  <li key={transacao.id} className="transacao-item">
                    <span className="transacao-descricao">{transacao.descricao}</span>
                    <span className="transacao-data">{formatarData(transacao.data)}</span>
                    <span className={`transacao-valor ${transacao.tipo === 'receita' ? 'positivo' : 'negativo'}`}>
                      R$ {parseFloat(transacao.valor).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="action-buttons">
            <Link to="/adicionar-transacao" className="btn-action">Adicionar Transação</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Transacoes; 