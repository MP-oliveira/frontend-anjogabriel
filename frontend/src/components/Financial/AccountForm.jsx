import { useState } from 'react';
import api from '../../services/api';

const AccountForm = () => {
  const [name, setName] = useState('');
  const [account_number, setAccountNumber] = useState('');
  const [current_balance, setCurrentBalance] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/financial/accounts', {
        name,
        account_number,
        current_balance,
      });
      alert('Conta criada com sucesso!');
      // Resetar os campos
      setName('');
      setAccountNumber('');
      setCurrentBalance('');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      alert('Erro ao criar conta');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Adicionar Conta</h2>
      <input
        type="text"
        placeholder="Nome da Conta"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Número da Conta"
        value={account_number}
        onChange={(e) => setAccountNumber(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Saldo Atual"
        value={current_balance}
        onChange={(e) => setCurrentBalance(e.target.value)}
        required
      />
      <button type="submit">Adicionar Conta</button>
    </form>
  );
};

export default AccountForm; 