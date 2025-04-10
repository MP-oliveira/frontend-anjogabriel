import { useEffect, useState } from 'react';
import axios from 'axios';
import './Transacoes.css'; // Certifique-se de que o CSS está correto
import { Link } from 'react-router-dom';
import VoltarButton from '../VoltarButton/VoltarButton';

function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroData, setFiltroData] = useState({
    dataInicio: '',
    dataFim: ''
  });

  useEffect(() => {
    const fetchTransacoes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/transacoes');
        setTransacoes(response.data);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
        setError('Erro ao buscar transações.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransacoes();
  }, []);

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

          {transacoes.length === 0 ? (
            <p>Nenhuma transação encontrada.</p>
          ) : (
            <ul className="transacoes-list">
              {transacoes.map(transacao => (
                <li key={transacao.id} className="transacao-item">
                  <span className="transacao-descricao">{transacao.descricao}</span>
                  <span className="transacao-data">{new Date(transacao.data).toLocaleDateString('pt-BR')}</span>
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