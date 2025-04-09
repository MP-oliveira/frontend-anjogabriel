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
    <div className="form-container">
      <div className="form-list-content">
        <div className="form-list-top">
          <h1 className="form-list-top-h1">Gerenciamento de Admins</h1>
          <Link className="form-criar" to="/admins/create">Adicionar Admin</Link>
        </div>
        <div className="form-list-input">
          <input
            className='form-list-input-input'
            type="text"
            placeholder="Buscar por nome do admin"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela-form-lista">
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
                  <td className="for-list-acoes">
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
