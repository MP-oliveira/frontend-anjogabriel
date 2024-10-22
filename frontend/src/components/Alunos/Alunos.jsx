import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Caso esteja usando react-router
import api from "../../services/api"; // Importando o serviço de API

const Alunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [search, setSearch] = useState('');

  // Função para buscar todos os alunos
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await fetch('https://localhost:3000/api/alunos'); // API para buscar todos os alunos
        console.log(response)
        const data = await response.json();
        setAlunos(data);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
      }
    };
    fetchAlunos();
  }, []);

  // Função para realizar a busca de aluno por CPF ou nome
  const handleSearch = async () => {
    try {
      const response = await fetch(`/aluno/search?nome=${search}`); // Busca pelo nome
      const data = await response.json();
      setAlunos([data]); // Atualiza a lista de alunos com o resultado da busca
    } catch (error) {
      console.error('Erro ao buscar aluno:', error);
    }
  };

  // Função para deletar um aluno
  const handleDelete = async (id) => {
    try {
      await fetch(`/aluno/${id}`, { method: 'DELETE' });
      setAlunos(alunos.filter((aluno) => aluno.id !== id)); // Remove o aluno da lista
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
    }
  };

  return (
    <div>
      <h1>Lista de Alunos</h1>

      {/* Barra de Pesquisa */}
      <input
        type="text"
        placeholder="Buscar por nome ou CPF"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>

      <Link to="/alunos/add">Criar Aluno</Link>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.length > 0 ? (
            alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td>{aluno.nome}</td>
                <td>{aluno.email}</td>
                <td>{aluno.cpf}</td>
                <td>
                  <Link to={`/alunos/edit/${aluno.id}`}>Editar</Link>
                  <button onClick={() => handleDelete(aluno.id)}>Deletar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhum aluno encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Alunos;
