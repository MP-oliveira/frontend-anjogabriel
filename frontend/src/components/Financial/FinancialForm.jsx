import { useState } from 'react';
import api from '../../services/api';

const FinancialForm = () => {
  const [type, setType] = useState('entrada');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [account_id, setAccountId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/financial/transactions', {
        type,
        amount,
        description,
        category,
        date,
        account_id,
      });
      alert('Transação criada com sucesso!');
      // Resetar os campos
      setType('entrada');
      setAmount('');
      setDescription('');
      setCategory('');
      setDate('');
      setAccountId('');
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      alert('Erro ao criar transação');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Adicionar Transação Financeira</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>
      <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="ID da Conta"
        value={account_id}
        onChange={(e) => setAccountId(e.target.value)}
        required
      />
      <button type="submit">Adicionar Transação</button>
    </form>
  );
};

export default FinancialForm; 