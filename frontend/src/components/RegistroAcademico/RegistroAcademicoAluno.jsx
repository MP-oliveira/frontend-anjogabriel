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
        // console.log("response registro academico", response.data)  // chegou aqui ok
        const registrosUnicos = response.data.reduce((acc, registro) => {
          const key = registro.id;
          if (!acc[key]) {
            acc[key] = {
              id: registro.id,
              aluno: registro.aluno,
              // para aparecer o curso, precisa fazer o relacionamento de curso com o registro academico e fazer o include no fetch do controller
              curso: registro.curso?.nome || 'Não definido',  
              disciplinas: registro.disciplina
            };
          } else {
            acc[key].disciplinas.add(registro.disciplina);
          }
          return acc;
        }, {});
        // console.log("Registros unicos", registrosUnicos)  // chegou aqui ok

        const registrosFormatados = Object.values(registrosUnicos).map(reg => ({
          ...reg,
          disciplinas: Array.from(reg.disciplinas)
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
    
    const filtered = registros.filter(registro => 
      registro.aluno.toLowerCase().includes(value) ||
      registro.curso.toLowerCase().includes(value)
    );
    setFilteredRegistros(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await api.delete(`/registroacademico/${id}`);
        setRegistros(registros.filter(registro => registro.id !== id));
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
            placeholder="Buscar por aluno ou curso"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <table className="tabela-form-lista">
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Curso</th>
              <th>Disciplinas</th>
              <th>Motivos das Faltas</th>
              <th>Datas das Faltas</th>
              <th>Total de Faltas</th>
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
                  <td>{registro.disciplinas}</td>
                  <td>
                    <ul style={{margin: 0, paddingLeft: 16}}>
                      {(registro.faltaMotivo || []).map((motivo, idx) => (
                        <li key={idx}>{motivo}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul style={{margin: 0, paddingLeft: 16}}>
                      {(registro.faltaData || []).map((data, idx) => (
                        <li key={idx}>{data ? new Date(data).toLocaleDateString() : ''}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {(registro.faltaQuantidade || []).reduce((acc, val) => acc + (parseInt(val) || 0), 0)}
                  </td>
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
                <td colSpan="7">Nenhum registro encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RegistroAcademicoAluno;