import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../services/api";
import Delete from '../../assets/trash.svg';
import Edit from '../../assets/pencil.svg';
import '../Alunos/Alunos.css';


const Disciplinas = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {

        const response = await api.get('/disciplinas');
        setDisciplinas(response.data);
        setFilteredDisciplinas(response.data);
      } catch (error) {
        console.error('Erro ao buscar disciplinas:', error);
      }
    };
    fetchDisciplinas();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = disciplinas.filter(disciplina =>
      disciplina.nome.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDisciplinas(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/disciplinas/${id}`);
      setDisciplinas(disciplinas.filter((disciplina) => disciplina.id !== id));
      setFilteredDisciplinas(filteredDisciplinas.filter((disciplina) => disciplina.id !== id));
    } catch (error) {
      console.error('Erro ao deletar disciplina:', error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-list-content">
        <div className="form-list-top">
          <h1 className="form-list-top-h1">Gerenciamento de Disciplinas</h1>
          <Link className="form-criar" to="/disciplinas/add">Add Disciplina</Link>
        </div>
        <div className="form-list-input">
          <input
            className='form-list-input-input'
            type="text"
            placeholder="Buscar por nome do disciplina"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela-form-lista">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Carga Horária</th>
              <th>Horário de Início</th>
              <th>Dias da Semana</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredDisciplinas.length > 0 ? (
              filteredDisciplinas.map((disciplina) => (
                <tr key={disciplina.id}>
                  <td>{disciplina.nome}</td>
                  <td>{disciplina.carga_horaria}</td>
                  <td>{disciplina.horario_inicio}</td>
                  <td>{Array.isArray(disciplina.dias_semana) ? disciplina.dias_semana.join(', ') : disciplina.dias_semana}</td>
                  <td className="for-list-acoes">
                    <Link to={`/disciplinas/edit/${disciplina.id}`}>
                      <img src={Edit} alt="Editar" />
                    </Link>
                    <Link onClick={() => handleDelete(disciplina.id)}>
                      <img src={Delete} alt="Deletar" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14">Nenhuma disciplina encontrada</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Disciplinas;
