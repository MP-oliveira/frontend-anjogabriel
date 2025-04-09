import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Transacoes.css'; // Certifique-se de que o CSS está correto
import { Link } from 'react-router-dom';

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
  };

  if (loading) {
    return <div>Carregando transações...</div>;
  }

  return (
    <div className="transacoes-container">
      <h1>Transações Financeiras</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleFilterSubmit}>
        <input type="date" value={filtroData.dataInicio} onChange={(e) => setFiltroData({...filtroData, dataInicio: e.target.value})} />
        <input type="date" value={filtroData.dataFim} onChange={(e) => setFiltroData({...filtroData, dataFim: e.target.value})} />
        <button type="submit">Filtrar</button>
      </form>
      {transacoes.length === 0 ? (
        <p>Nenhuma transação encontrada.</p>
      ) : (
        <table className="transacoes-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map(transacao => (
              <tr key={transacao.id}>
                <td>{new Date(transacao.data).toLocaleDateString('pt-BR')}</td>
                <td>{transacao.descricao}</td>
                <td>{transacao.categoria}</td>
                <td>{transacao.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="action-buttons">
        <Link to="/adicionar-transacao" className="btn-action">Adicionar Transação</Link>
      </div>
    </div>
  );
}

export default Transacoes; 