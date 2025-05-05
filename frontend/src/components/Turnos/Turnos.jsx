import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../services/api"; // Certifique-se de que o caminho está correto

const Turnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [filteredTurnos, setFilteredTurnos] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await api.get('/turnos'); // Verifique se a rota está correta
        setTurnos(response.data);
        setFilteredTurnos(response.data);
      } catch (error) {
        console.error('Erro ao buscar turnos:', error);
      }
    };
    fetchTurnos();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = turnos.filter(turno =>
      turno.nome.toLowerCase().includes(value.toLowerCase()) // Supondo que cada turno tem um campo 'nome'
    );
    setFilteredTurnos(filtered);
  };

  return (
    <div className="form-container">
      <div className="form-list-content">
        <div className="form-list-top">
          <h1 className="form-list-top-h1">Gerenciamento de Turnos</h1>
          <Link className="form-criar" to="/turnos/add">Adicionar Turno</Link>
        </div>
        <div className="form-list-input">
          <input
            className='form-list-input-input'
            type="text"
            placeholder="Buscar por nome do turno"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela-form-lista">
          <thead>
            <tr>
              <th>Nome do Turno</th>
            </tr>
          </thead>
          <tbody>
            {filteredTurnos.length > 0 ? (
              filteredTurnos.map((turno) => (
                <tr key={turno.id}>
                  <td>{turno.nome}</td> 
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">Nenhum turno encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Turnos; 