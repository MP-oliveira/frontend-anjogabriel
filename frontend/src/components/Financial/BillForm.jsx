import { useState } from 'react';
import api from '../../services/api';

const BillForm = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [due_date, setDueDate] = useState('');
  const [payment_status, setPaymentStatus] = useState('a vencer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/financial/bills', {
        description,
        amount,
        due_date,
        payment_status,
      });
      alert('Boleto criado com sucesso!');
      // Resetar os campos
      setDescription('');
      setAmount('');
      setDueDate('');
      setPaymentStatus('a vencer');
    } catch (error) {
      console.error('Erro ao criar boleto:', error);
      alert('Erro ao criar boleto');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Adicionar Boleto</h2>
      <input
        type="text"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="date"
        value={due_date}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <select value={payment_status} onChange={(e) => setPaymentStatus(e.target.value)}>
        <option value="avencer">A Vencer</option>
        <option value="pago">Pago</option>
        <option value="atrasado">Atrasado</option>
      </select>
      <button type="submit">Adicionar Boleto</button>
    </form>
  );
};

export default BillForm; 