import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../services/api";
import Delete from '../../assets/trash.svg';
import Edit from '../../assets/pencil.svg';

const MaterialEUtensilio = () => {
  const [materiais, setMateriais] = useState([]);
  const [filteredMateriais, setFilteredMateriais] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMateriais = async () => {
      try {
        const response = await api.get('/materialeutensilios');
        setMateriais(response.data);
        setFilteredMateriais(response.data);
      } catch (error) {
        console.error('Erro ao buscar materiais e utensílios:', error);
      }
    };
    fetchMateriais();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = materiais.filter(material =>
      material.nome.toLowerCase().includes(value.toLowerCase()) ||
      material.categoria.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMateriais(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/materialeutensilios/${id}`);
      setMateriais(materiais.filter((material) => material.id !== id));
      setFilteredMateriais(filteredMateriais.filter((material) => material.id !== id));
    } catch (error) {
      console.error('Erro ao deletar material:', error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-list-content">
        <div className="form-list-top">
          <h1 className="form-list-top-h1">Gerenciamento de Materiais e Utensílios</h1>
          <Link className="form-criar" to="/materialeutensilios/add">Adicionar Material</Link>
        </div>
        <div className="form-list-input">
          <input
            className='form-list-input-input'
            type="text"
            placeholder="Buscar por nome ou categoria"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela-form-lista">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredMateriais.length > 0 ? (
              filteredMateriais.map((material) => (
                <tr key={material.id}>
                  <td>{material.nome}</td>
                  <td>{material.categoria}</td>
                  <td>{material.quantidade}</td>
                  <td className="for-list-acoes">
                    <Link to={`/materialeutensilios/edit/${material.id}`}>
                      <img src={Edit} alt="Editar" />
                    </Link>
                    <Link onClick={() => handleDelete(material.id)}>
                      <img src={Delete} alt="Deletar" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Nenhum material encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialEUtensilio; 