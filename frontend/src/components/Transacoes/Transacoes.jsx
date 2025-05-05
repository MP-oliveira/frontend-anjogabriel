import { useEffect, useState } from 'react';
import axios from 'axios';
import './Transacoes.css'; // Certifique-se de que o CSS está correto
import { Link } from 'react-router-dom';
import VoltarButton from '../VoltarButton/VoltarButton';

function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
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
      const transacoesResponse = await axios.get('http://localhost:3001/api/financeiro');
      setTransacoes(transacoesResponse.data);
      
      // Buscar contas
      const contasResponse = await axios.get('http://localhost:3001/api/financeiro/contas');
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
    // Lógica para filtrar transações com base nas datas
    // Você pode implementar a lógica de filtragem aqui
  };

  if (loading) {
    return <div>Carregando transações...</div>;
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
            <div className="input-three-columns">
              <input
                type="date"
                value={filtroData.dataInicio}
                onChange={(e) => setFiltroData({ ...filtroData, dataInicio: e.target.value })}
              />
              <input
                type="date"
                value={filtroData.dataFim}
                onChange={(e) => setFiltroData({ ...filtroData, dataFim: e.target.value })}
              />
              <button className='filter' type="submit">Filtrar</button>
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

          {transacoes.length === 0 ? (
            <p>Nenhuma transação encontrada.</p>
          ) : (
            <ul className="transacoes-list">
              {transacoes.map(transacao => (
                <li key={transacao.id} className="transacao-item">
                  <span className="transacao-descricao">{transacao.descricao}</span>
                  <span className="transacao-data">{new Date(transacao.data).toLocaleDateString('pt-BR')}</span>
                  <span className={`transacao-valor ${transacao.tipo === 'receita' ? 'positivo' : 'negativo'}`}>
                    R$ {parseFloat(transacao.valor).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
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