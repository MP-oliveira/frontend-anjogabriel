import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../services/api";
import Delete from '../../assets/trash.svg';
import Edit from '../../assets/pencil.svg';
import './Cursos.css';

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await api.get('/cursos');
        setCursos(response.data);
        setFilteredCursos(response.data);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      }
    };
    fetchCursos();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = cursos.filter(curso =>
      curso.nome.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCursos(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/cursos/${id}`);
      setCursos(cursos.filter((curso) => curso.id !== id));
      setFilteredCursos(filteredCursos.filter((curso) => curso.id !== id));
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
    }
  };


  return (
    <div className="form-container">
      <div className="form-list-content">
        <div className="form-list-top">
          <h1 className="form-list-top-h1">Gerenciamento de Cursos</h1>
          <Link className="form-criar" to="/cursos/add">Adicionar Curso</Link>
        </div>
        <div className="form-list-input">
          <input
            className='form-list-input-input'
            type="text"
            placeholder="Buscar por nome do curso"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela-form-lista">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredCursos.length > 0 ? (
              filteredCursos.map((curso) => (
                <tr key={curso.id}>
                  <td>{curso.nome}</td>
                  <td className="for-list-acoes">
                    <Link to={`/cursos/edit/${curso.id}`}>
                      <img src={Edit} alt="" />
                    </Link>
                    <Link onClick={() => handleDelete(curso.id)}>
                      <img src={Delete} alt="" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Nenhum curso encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Cursos