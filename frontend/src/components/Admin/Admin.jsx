import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../services/api";
import Delete from '../../assets/trash.svg';
import Edit from '../../assets/pencil.svg';
import '../Alunos/Alunos.css';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await api.get('/admins');
        setAdmins(response.data);
        setFilteredAdmins(response.data);
      } catch (error) {
        console.error('Erro ao buscar admins:', error);
      }
    };
    fetchAdmins();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = admins.filter(admin =>
      admin.nome.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAdmins(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admins/${id}`);
      setAdmins(admins.filter((admin) => admin.id !== id));
      setFilteredAdmins(filteredAdmins.filter((admin) => admin.id !== id));
    } catch (error) {
      console.error('Erro ao deletar admin:', error);
    }
  };

  return (
    <div className="aluno_container">
      <div className="aluno_content">
        <div className="aluno_top">
          <h1 className="aluno_h1">Gerenciamento de Admins</h1>
          <Link className="criar_aluno" to="/admins/create">Adicionar Admin</Link>
        </div>
        <div className="aluno_input">
          <input
            className='aluno_lista_input'
            type="text"
            placeholder="Buscar por nome do admin"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela_aluno_lista">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.nome}</td>
                  <td>{admin.email}</td>
                  <td>{admin.telefone}</td>
                  <td>{admin.status}</td>
                  <td className="aluno_acoes">
                    <Link to={`/admins/edit/${admin.id}`}>
                      <img src={Edit} alt="Editar" />
                    </Link>
                    <Link onClick={() => handleDelete(admin.id)}>
                      <img src={Delete} alt="Deletar" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Nenhum admin encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admins;
