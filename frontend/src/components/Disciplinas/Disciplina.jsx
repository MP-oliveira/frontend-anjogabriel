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
        const response = await api.get('/disciplina');
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
      await api.delete(`/disciplina/${id}`);
      setDisciplinas(disciplinas.filter((disciplina) => disciplina.id !== id));
      setFilteredDisciplinas(filteredDisciplinas.filter((disciplina) => disciplina.id !== id));
    } catch (error) {
      console.error('Erro ao deletar disciplina:', error);
    }
  };

  return (
    <div className="aluno_container">
      <div className="aluno_content">
        <div className="aluno_top">
          <h1 className="aluno_h1">Gerenciamento de Disciplinas</h1>
          <Link className="criar_aluno" to="/disciplinas/add">Adicionar Disciplina</Link>
        </div>
        <div className="aluno_input">
          <input
            className='aluno_lista_input'
            type="text"
            placeholder="Buscar por nome do disciplina"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela_aluno_lista">
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
                  <td>{disciplina.dias_semana}</td>
                  <td className="aluno_acoes">
                    <Link to={`/disciplina/edit/${disciplina.id}`}>
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
