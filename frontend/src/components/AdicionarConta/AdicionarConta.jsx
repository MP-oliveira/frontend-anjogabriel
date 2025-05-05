import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './AdicionarConta.css'; 
import VoltarButton from '../VoltarButton/VoltarButton';

function AdicionarConta() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    numero_conta: '',
    saldo_atual: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/financeiro/contas', formData);
      navigate('/transacoes'); // Redireciona para a página de transações após adicionar a conta
    } catch (err) {
      console.error('Erro ao adicionar conta:', err);
      setError('Erro ao adicionar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adicionar-conta-container">
      <VoltarButton url='/dashboard' />
      <h1 className='adicionar-conta-h1'>Adicionar Conta</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome da Conta</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Número da Conta</label>
          <input
            type="text"
            name="numero_conta"
            value={formData.numero_conta}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Saldo Atual</label>
          <input
            type="number"
            name="saldo_atual"
            value={formData.saldo_atual}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <button className='edit-btn' type="submit" disabled={loading}>
          {loading ? 'Adicionando...' : 'Adicionar Conta'}
        </button>
      </form>
    </div>
  );
}

export default AdicionarConta; 