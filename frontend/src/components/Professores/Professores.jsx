import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../services/api";
import Delete from '../../assets/trash.svg';
import Edit from '../../assets/pencil.svg';
import '../Alunos/Alunos.css';

const Professores = () => {
  const [professores, setProfessores] = useState([]);
  const [filteredProfessores, setFilteredProfessores] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const response = await api.get('/professores');
        setProfessores(response.data);
        setFilteredProfessores(response.data);
      } catch (error) {
        console.error('Erro ao buscar professores:', error);
      }
    };
    fetchProfessores();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = professores.filter(professor =>
      professor.nome.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProfessores(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/professores/${id}`);
      setProfessores(professores.filter((professor) => professor.id !== id));
      setFilteredProfessores(filteredProfessores.filter((professor) => professor.id !== id));
    } catch (error) {
      console.error('Erro ao deletar professor:', error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-list-content">
        <div className="form-list-top">
          <h1 className="form-list-top-h1">Gerenciamento de Professores</h1>
          <Link className="form-criar" to="/professores/add">Add Professor</Link>
        </div>
        <div className="form-list-input">
          <input
            className='form-list-input-input'
            type="text"
            placeholder="Buscar por nome do professor"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela-form-lista">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Especialidade</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfessores.length > 0 ? (
              filteredProfessores.map((professor) => (
                <tr key={professor.id}>
                  <td>{professor.nome}</td>
                  <td>{professor.especialidade}</td>
                  <td>{professor.email}</td>
                  <td>{professor.telefone}</td>
                  <td>{professor.status}</td>
                  <td className="for-list-acoes">
                    <Link to={`/professores/edit/${professor.id}`}>
                      <img src={Edit} alt="Editar" />
                    </Link>
                    <Link onClick={() => handleDelete(professor.id)}>
                      <img src={Delete} alt="Deletar" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Nenhum professor encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Professores;
