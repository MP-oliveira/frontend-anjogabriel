import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddTransacao.css';

function AddTransacao() {
  const navigate = useNavigate();
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([
    'Salário professor', 'Salário funcionário', 'Darf','Mensalidade Aluno','Camisa', // Receitas
    'Aluguel', 'Alimentação', 'Transporte', 'Saúde', 'Serviços', 'Água', 'Luz', 'Internet', 'Outros'     // Despesas
  ]);
  const [formData, setFormData] = useState({
    tipo: 'despesa',
    valor: '',
    descricao: '',
    categoria: '',
    data: new Date().toISOString().split('T')[0],
    conta_id: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchContas();
  }, []);

  const fetchContas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/financeiro/contas');
      setContas(response.data);
      if (response.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          conta_id: response.data[0].id
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar contas bancárias:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpar erro quando o campo for preenchido
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'O valor deve ser maior que zero';
    }
    
    if (!formData.descricao || formData.descricao.trim() === '') {
      newErrors.descricao = 'A descrição é obrigatória';
    }
    
    if (!formData.data) {
      newErrors.data = 'A data é obrigatória';
    }
    
    if (!formData.conta_id) {
      newErrors.conta_id = 'Selecione uma conta bancária';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Criar a transação
      await axios.post('http://localhost:3001/api/financeiro/create', formData);
      
      // Buscar os dados atualizados da conta
      await fetchContas();
      
      setLoading(false);
      navigate('/transacoes');
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      setLoading(false);
      setErrors({
        submit: 'Erro ao criar transação. Por favor, tente novamente.'
      });
    }
  };

  const handleAddCategoria = () => {
    const novaCategoria = prompt('Digite o nome da nova categoria:');
    if (novaCategoria && novaCategoria.trim() !== '') {
      setCategorias([...categorias, novaCategoria.trim()]);
      setFormData({
        ...formData,
        categoria: novaCategoria.trim()
      });
    }
  };

  return (
    <div className="add-transacao-container">
      <div className="add-transacao-header">
        <h1>Nova Transação</h1>
        <button onClick={() => navigate('/transacoes')} className="btn-voltar">Voltar</button>
      </div>
      
      <div className="add-transacao-card">
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <form onSubmit={handleSubmit} className="transacao-form">
          <div className="tipo-selector">
            <button 
              type="button"
              className={`tipo-btn ${formData.tipo === 'receita' ? 'tipo-receita-selected' : ''}`}
              onClick={() => setFormData({...formData, tipo: 'receita'})}
            >
              Receita
            </button>
            <button 
              type="button"
              className={`tipo-btn ${formData.tipo === 'despesa' ? 'tipo-despesa-selected' : ''}`}
              onClick={() => setFormData({...formData, tipo: 'despesa'})}
            >
              Despesa
            </button>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Valor*</label>
              <div className="valor-input">
                <span className="currency-symbol">R$</span>
                <input
                  type="number"
                  step="0.01"
                  name="valor"
                  value={formData.valor}
                  onChange={handleChange}
                  placeholder="0,00"
                  className={errors.valor ? 'input-error' : ''}
                />
              </div>
              {errors.valor && <div className="error-text">{errors.valor}</div>}
            </div>
            
            <div className="form-group">
              <label>Data*</label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className={errors.data ? 'input-error' : ''}
              />
              {errors.data && <div className="error-text">{errors.data}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Descrição*</label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Ex: Pagamento de aluguel"
              className={errors.descricao ? 'input-error' : ''}
            />
            {errors.descricao && <div className="error-text">{errors.descricao}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group categoria-group">
              <label>Categoria</label>
              <div className="categoria-container">
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
                <button 
                  type="button" 
                  className="add-categoria-btn"
                  onClick={handleAddCategoria}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Conta Bancária*</label>
              <select
                name="conta_id"
                value={formData.conta_id}
                onChange={handleChange}
                className={errors.conta_id ? 'input-error' : ''}
              >
                <option value="">Selecione uma conta</option>
                {contas.map((conta) => (
                  <option key={conta.id} value={conta.id}>
                    {conta.nome} - Saldo: R$ {parseFloat(conta.saldo_atual).toFixed(2)}
                  </option>
                ))}
              </select>
              {errors.conta_id && <div className="error-text">{errors.conta_id}</div>}
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/transacoes')}
              className="btn-cancelar"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-salvar"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Transação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransacao;