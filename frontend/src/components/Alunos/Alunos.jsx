import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../services/api";
import Delete from '../../assets/trash.svg';
import Edit from '../../assets/pencil.svg';
import './Alunos.css';

const Alunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [filteredAlunos, setFilteredAlunos] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await api.get('/alunos');
        setAlunos(response.data);
        setFilteredAlunos(response.data);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
      }
    };
    fetchAlunos();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = alunos.filter(aluno =>
      aluno.nome.toLowerCase().includes(value.toLowerCase()) ||
      aluno.cpf.includes(value)
    );
    setFilteredAlunos(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/alunos/${id}`);
      setAlunos(alunos.filter((aluno) => aluno.id !== id));
      setFilteredAlunos(filteredAlunos.filter((aluno) => aluno.id !== id));
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
    }
  };

  return (
    <div className="form_container">
      <div className="aluno_content">
        <div className="aluno_top">
          <h1 className="aluno_h1">Gerenciamento de Alunos</h1>
          <Link className="criar_aluno" to="/alunos/add">Adicionar Aluno</Link>
        </div>
        <div className="aluno_input">
          <input
            className='aluno_lista_input'
            type="text"
            placeholder="Buscar por nome ou CPF"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela_aluno_lista">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlunos.length > 0 ? (
              filteredAlunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                  <td>{aluno.cpf}</td>
                  <td className="aluno_acoes">
                    <Link to={`/alunos/edit/${aluno.id}`}>
                      <img src={Edit} alt="" />
                    </Link>
                    <Link onClick={() => handleDelete(aluno.id)}>
                      <img src={Delete} alt="" />
                    </Link>
                    <Link to={`/diplomas/${aluno.id}`}>
                      <button>Diploma</button>
                    </Link>
                    <Link to={`/boletim/${aluno.id}`}>
                      <button>Boletim</button>
                    </Link>
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
    </div>
  );
};

export default Alunos;
