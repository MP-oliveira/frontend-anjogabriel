import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from "../../services/api";
import Delete from '../../assets/trash.svg';
import Edit from '../../assets/pencil.svg';
import './MaterialEUtensilio.css'; // Vamos criar este arquivo em seguida

const MaterialEUtensilio = () => {
  const [materiais, setMateriais] = useState([]);
  const [search, setSearch] = useState('');
  const [materiaisPorCategoria, setMateriaisPorCategoria] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const navigate = useNavigate();

  // Lista de categorias baseada no modelo
  const categorias = [
    'Material Hospitalar / Material Técnico',
    'Material Didático / Escolar',
    'Material de Escritório / Administrativo',
    'Material de Limpeza e Higiene',
    'Equipamentos de Manutenção'
  ];

  useEffect(() => {
    const fetchMateriais = async () => {
      try {
        const response = await api.get('/materialeutensilios');
        const data = response.data;
        setMateriais(data);
        
        // Agrupar materiais por categoria
        agruparPorCategoria(data);
        
        // Inicializar todas as categorias como expandidas
        const initialExpandedState = {};
        categorias.forEach(categoria => {
          initialExpandedState[categoria] = true;
        });
        setExpandedCategories(initialExpandedState);
      } catch (error) {
        console.error('Erro ao buscar materiais e utensílios:', error);
      }
    };
    
    fetchMateriais();
  }, []);

  // Função para agrupar os materiais por categoria
  const agruparPorCategoria = (materiaisData) => {
    const agrupados = {};
    
    categorias.forEach(categoria => {
      agrupados[categoria] = materiaisData.filter(
        material => material.categoria === categoria
      );
    });
    
    setMateriaisPorCategoria(agrupados);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    
    if (value) {
      const filtered = materiais.filter(material =>
        material.nome.toLowerCase().includes(value.toLowerCase()) ||
        material.categoria.toLowerCase().includes(value.toLowerCase())
      );
      agruparPorCategoria(filtered);
    } else {
      agruparPorCategoria(materiais);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/materialeutensilios/${id}`);
      const materiaisAtualizados = materiais.filter((material) => material.id !== id);
      setMateriais(materiaisAtualizados);
      agruparPorCategoria(materiaisAtualizados);
    } catch (error) {
      console.error('Erro ao deletar material:', error);
    }
  };

  const toggleCategory = (categoria) => {
    setExpandedCategories({
      ...expandedCategories,
      [categoria]: !expandedCategories[categoria]
    });
  };
  
  const handleAddMaterial = (categoria) => {
    // Codificar a categoria para passar pela URL de forma segura
    const categoriaEncoded = encodeURIComponent(categoria);
    navigate(`/materialeutensilios/add?categoria=${categoriaEncoded}`);
  };

  // Função para exibir o nome abreviado da categoria no título
  const abreviarNomeCategoria = (categoria) => {
    const partes = categoria.split(' / ');
    if (partes.length > 1) {
      return partes[0];
    }
    return categoria;
  };

  return (
    <div className="form-container">
      <div className="form-list-content">
        <div className="form-list-top">
          <h1 className="form-list-top-h1 form-list-top-h1-materialeutensilio">Materiais e Utensílios</h1>
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
        
        <div className="materiais-categorias-container">
          {categorias.map(categoria => {
            const materiaisDaCategoria = materiaisPorCategoria[categoria] || [];
            const categoriaNome = abreviarNomeCategoria(categoria);
            
            return (
              <div key={categoria} className="categoria-section">
                <div className="categoria-header">
                  <div 
                    className="categoria-title" 
                    onClick={() => toggleCategory(categoria)}
                  >
                    <h2>{categoriaNome} <span className="contador-itens">({materiaisDaCategoria.length})</span></h2>
                    <span className={`toggle-icon ${expandedCategories[categoria] ? 'expanded' : ''}`}>
                      {expandedCategories[categoria] ? '▼' : '►'}
                    </span>
                  </div>
                  <button 
                    className="add-material-btn" 
                    onClick={() => handleAddMaterial(categoria)}
                    title={`Adicionar novo item em ${categoria}`}
                  >
                    + Novo Item
                  </button>
                </div>
                
                {expandedCategories[categoria] && (
                  <div className="categoria-items">
                    {materiaisDaCategoria.length > 0 ? (
                      <table className="tabela-materiais">
                        <thead>
                          <tr>
                            <th>Nome</th>
                            <th>Quantidade</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {materiaisDaCategoria.map(material => (
                            <tr key={material.id} className="material-item">
                              <td>{material.nome}</td>
                              <td>{material.quantidade}</td>
                              <td>R$ {material.valor_unitario}</td>
                              <td>
                                <span className={`status-badge ${material.status_material.toLowerCase()}`}>
                                  {material.status_material}
                                </span>
                              </td>
                              <td className="material-acoes">
                                <Link to={`/materialeutensilios/edit/${material.id}`} className="action-link">
                                  <img src={Edit} alt="Editar" />
                                </Link>
                                <button 
                                  onClick={() => handleDelete(material.id)} 
                                  className="action-button"
                                >
                                  <img src={Delete} alt="Deletar" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="no-materials">Nenhum material encontrado nesta categoria</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MaterialEUtensilio; 