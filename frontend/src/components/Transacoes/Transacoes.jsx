import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Transacoes.css'; // Certifique-se de que o CSS está correto

function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransacoes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/transacoes');
        setTransacoes(response.data);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransacoes();
  }, []);

  if (loading) {
    return <div>Carregando transações...</div>;
  }

  return (
    <div className="transacoes-container">
      <h1>Transações</h1>
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
    </div>
  );
}

export default Transacoes; 