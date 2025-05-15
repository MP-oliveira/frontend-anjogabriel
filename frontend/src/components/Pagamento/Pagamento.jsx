import { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import './Pagamento.css';
import { useParams } from 'react-router-dom';
import VoltarButton from '../VoltarButton/VoltarButton';
import { UserContext } from '../../context/UseContext';

const Pagamento = () => {
  const { aluno_id } = useParams();
  const { user } = useContext(UserContext);
  const [aluno, setAluno] = useState(null);
  const [contas, setContas] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    conta_id: '',
    mes_referencia: '',
    valor: '',
    recebido_por: '',
    observacao: ''
  });

  useEffect(() => {
    if (!aluno_id) {
      setError('ID do aluno não encontrado');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const alunoResponse = await api.get(`/alunos/${aluno_id}`);
        setAluno(alunoResponse.data);

        const contasResponse = await api.get('/contas');
        setContas(contasResponse.data);

        const pagamentosResponse = await api.get(`/pagamentos/aluno/${aluno_id}`);
        setPagamentos(pagamentosResponse.data.pagamentos || []);

        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar dados');
        setLoading(false);
      }
    };

    fetchData();
  }, [aluno_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Obter a data atual no fuso horário brasileiro
      const dataAtual = new Date();
      const dataBrasil = new Date(dataAtual.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

      const dataToSend = {
        ...formData,
        data_pagamento: dataBrasil.toISOString(),
        aluno_id: aluno_id
      };

      await api.post('/pagamentos', dataToSend);
      
      // Atualizar a lista de pagamentos
      const pagamentosResponse = await api.get(`/pagamentos/aluno/${aluno_id}`);
      setPagamentos(pagamentosResponse.data.pagamentos || []);
      
      // Limpar o formulário
      setFormData({
        conta_id: '',
        mes_referencia: '',
        valor: '',
        recebido_por: '',
        observacao: ''
      });

      setSnackbar({
        open: true,
        message: 'Pagamento registrado com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao registrar pagamento',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <div className="payment-loading-container">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-error-container">
        <p className="payment-error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1 className="payment-title">Pagamentos - {aluno?.nome}</h1>
        <VoltarButton url={`/mensalidade/${aluno_id}`} />
      </div>

      <div className="payment-content">
        <div className="payment-form-container">
          <div className="payment-form">
            <h2>Registrar Novo Pagamento</h2>
            <form onSubmit={handleSubmit}>
              <div className="payment-form-group">
                <label>Conta</label>
                <select
                  value={formData.conta_id}
                  onChange={handleInputChange}
                  name="conta_id"
                  required
                >
                  <option value="">Selecione uma conta</option>
                  {contas.map(conta => (
                    <option key={conta.id} value={conta.id}>
                      {conta.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="payment-form-group">
                <label>Mês de Referência</label>
                <input
                  type="month"
                  name="mes_referencia"
                  value={formData.mes_referencia}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="payment-form-group">
                <label>Valor</label>
                <input
                  type="number"
                  name="valor"
                  value={formData.valor}
                  onChange={handleInputChange}
                  required
                  placeholder="R$"
                />
              </div>

              <div className="payment-form-group">
                <label>Observação</label>
                <textarea
                  name="observacao"
                  value={formData.observacao}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              <button type="submit" className="payment-submit-button">
                Registrar Pagamento
              </button>
            </form>
          </div>
        </div>

        <div className="payment-history-container">
          <div className="payment-history">
            <h2>Histórico de Pagamentos</h2>
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Mês Referência</th>
                  <th>Valor</th>
                  <th>Recebido Por</th>
                  <th>Observação</th>
                </tr>
              </thead>
              <tbody>
                {pagamentos.map(pagamento => {
                  // Converter a data para o fuso horário brasileiro
                  const dataPagamento = new Date(pagamento.data_pagamento);
                  const dataBrasil = new Date(dataPagamento.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

                  return (
                    <tr key={pagamento.id}>
                      <td>{dataBrasil.toLocaleDateString('pt-BR')} {dataBrasil.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>{new Date(pagamento.mes_referencia).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</td>
                      <td>R$ {parseFloat(pagamento.valor).toFixed(2)}</td>
                      <td>{pagamento.recebido_por}</td>
                      <td>{pagamento.observacao}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {snackbar.open && (
        <div className={`payment-snackbar ${snackbar.severity}`}>
          {snackbar.message}
          <button onClick={handleCloseSnackbar} className="payment-close-button">×</button>
        </div>
      )}
    </div>
  );
};

export default Pagamento; 