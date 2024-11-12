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
    <div className="aluno_container">
      <div className="aluno_content">
        <div className="aluno_top">
          <h1 className="aluno_h1">Gerenciamento de Professores</h1>
          <Link className="criar_aluno" to="/professores/add">Adicionar Professor</Link>
        </div>
        <div className="aluno_input">
          <input
            className='aluno_lista_input'
            type="text"
            placeholder="Buscar por nome do professor"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela_aluno_lista">
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
                  <td className="aluno_acoes">
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
