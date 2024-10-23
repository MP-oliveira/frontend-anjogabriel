import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../services/api";

import './Alunos.css'

const Alunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await api.get('/alunos');
        setAlunos(response.data);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
      }
    };
    fetchAlunos();
  }, []);

  const handleSearch = async () => {

    try {
      const response = await api.get(`/alunos/search?nome=${search}`); // Chama a nova rota
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao buscar aluno: front', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/alunos/${id}`);
      setAlunos(alunos.filter((aluno) => aluno.id !== id));
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
    }
  };

  return (
    <div className="aluno_container">
      <div className="aluno_content">
        <h1 className="aluno_h1">Gerenciamento de Alunos</h1>
        <div className="aluno_input">
          <input
            className='aluno_lista_input'
            type="text"
            placeholder="Buscar por nome ou CPF"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="aluno_content_btn" onClick={handleSearch}>Buscar</button>
        </div>
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
            <Link to="/alunos/add">Criar Aluno</Link>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alunos;
