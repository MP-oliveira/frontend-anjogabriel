import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../services/api";
import Delete from '../../assets/trash.svg';
import Edit from '../../assets/pencil.svg';
import '../Alunos/Alunos.css'; // Importando o CSS da tabela de alunos

const RegistroAcademicoAluno = () => {
  const [registros, setRegistros] = useState([]);
  const [filteredRegistros, setFilteredRegistros] = useState([]);
  const [search, setSearch] = useState('');
  const [cursoSelecionado, setCursoSelecionado] = useState('');

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const response = await api.get('/registroacademico/');
        const registrosUnicos = response.data.reduce((acc, registro) => {
          const key = registro.id;
          if (!acc[key]) {
            acc[key] = {
              id: registro.id,
              aluno: registro.aluno,
              curso: registro.curso || 'Não definido',
              disciplina: registro.disciplina,
              faltaMotivo: registro.faltaMotivo || [],
              faltaData: registro.faltaData || [],
              faltaQuantidade: registro.faltaQuantidade || [],
              totalAulas: registro.totalAulas || 0,
            };
          }
          return acc;
        }, {});

        const registrosFormatados = Object.values(registrosUnicos).map(reg => ({
          ...reg,
          faltaMotivo: Array.isArray(reg.faltaMotivo) ? reg.faltaMotivo : [],
          faltaData: Array.isArray(reg.faltaData) ? reg.faltaData : [],
          faltaQuantidade: Array.isArray(reg.faltaQuantidade) ? reg.faltaQuantidade : [],
        }));

        setRegistros(registrosUnicos);
        setFilteredRegistros(registrosFormatados);
      } catch (error) {
        console.error('Erro ao buscar registros acadêmicos:', error);
      }
    };
    fetchRegistros();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    
    const filtered = Object.values(registros).filter(registro => 
      registro.aluno.toLowerCase().includes(value) ||
      registro.curso.toLowerCase().includes(value) ||
      registro.disciplina.toLowerCase().includes(value)
    );
    setFilteredRegistros(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await api.delete(`/registroacademico/${id}`);
        setRegistros(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        setFilteredRegistros(filteredRegistros.filter(registro => registro.id !== id));
        alert('Registro excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar registro:', error);
        alert('Erro ao excluir registro');
      }
    }
  };

  // Função para formatar nomes longos
  const formatarNome = (nomeCompleto) => {
    if (!nomeCompleto) return '';
    const partesNome = nomeCompleto.split(' ');
    if (partesNome.length <= 2) {
      return nomeCompleto;
    } else if (partesNome.length === 3) {
      return `${partesNome[0]} ${partesNome[1]} ${partesNome[2]}`;
    } else {
      return `${partesNome[0]} ${partesNome[1]}...`;
    }
  };

  return (
    <div className="addaluno-container registro-academico-container">
      <div className="form-addaluno">
        <div className="registro_top">
          <h1 className="registro_h1">Registros Acadêmicos</h1>
          <Link className="aluno-btn" to="/registroacademico/create">
            Adicionar Registro
          </Link>
        </div>

        <div className="registro_filters">
          <select 
            className="registro_select"
            value={cursoSelecionado}
            onChange={(e) => setCursoSelecionado(e.target.value)}
          >
            <option value="">Todos os Cursos</option>
            <option value="enfermagem">Técnico de Enfermagem</option>
            <option value="enfermagem_trabalho">Técnico de Enfermagem do Trabalho</option>
          </select>

          <input
            className="registro_lista_input"
            type="text"
            placeholder="Buscar por aluno, curso ou disciplina"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <table className="tabela-form-lista">
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Curso</th>
              <th>Disciplina</th>
              <th>Motivos das Faltas</th>
              <th>Datas das Faltas</th>
              <th>Total de Faltas</th>
              <th>Total de Aulas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistros.length > 0 ? (
              filteredRegistros.map((registro) => (
                <tr key={registro.id}>
                  <td>
                    <Link 
                      to={`/registroacademico/${registro.id}`} 
                      className="aluno-link"
                      title={registro.aluno}
                    >
                      {formatarNome(registro.aluno)}
                    </Link>
                  </td>
                  <td>{registro.curso}</td>
                  <td>{registro.disciplina}</td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {registro.faltaMotivo.length > 0 ? (
                        registro.faltaMotivo.map((motivo, idx) => (
                          <li key={idx}>{motivo}</li>
                        ))
                      ) : (
                        <li>Nenhum motivo registrado</li>
                      )}
                    </ul>
                  </td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {registro.faltaData.length > 0 ? (
                        registro.faltaData.map((data, idx) => (
                          <li key={idx}>{data ? new Date(data).toLocaleDateString() : ''}</li>
                        ))
                      ) : (
                        <li>Nenhuma data registrada</li>
                      )}
                    </ul>
                  </td>
                  <td>
                    {registro.faltaQuantidade.reduce((acc, val) => acc + (parseInt(val) || 0), 0)}
                  </td>
                  <td>{registro.totalAulas}</td>
                  <td className="for-list-acoes">
                    <Link to={`/registroacademico/edit/${registro.id}`}>
                      <img src={Edit} alt="Editar" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(registro.id)}
                      className="delete-btn"
                    >
                      <img src={Delete} alt="Deletar" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Nenhum registro encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistroAcademicoAluno;