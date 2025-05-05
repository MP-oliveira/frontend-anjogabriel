import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../context/UseContext";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Delete from "../../assets/trash.svg";
import Edit from "../../assets/pencil.svg";

const Alunos = () => {
  const { user } = useContext(UserContext); // Obter o estado do usuário
  const role = user;
  const [alunos, setAlunos] = useState([]);
  const [filteredAlunos, setFilteredAlunos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await api.get("/alunos");
        setAlunos(response.data);
        setFilteredAlunos(response.data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };
    fetchAlunos();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = alunos.filter(
      (aluno) =>
        aluno.nome.toLowerCase().includes(value.toLowerCase()) ||
        aluno.cpf.includes(value)
    );
    setFilteredAlunos(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/alunos/${id}`);
      setAlunos(alunos.filter((aluno) => aluno.id !== id));
      setFilteredAlunos(filteredAlunos.filter((aluno) => aluno.id !== id));
    } catch (error) {
      console.error("Erro ao deletar aluno:", error);
    }
  };

  // Função para formatar nomes longos
  const formatarNome = (nomeCompleto) => {
    const partesNome = nomeCompleto.split(" ");
    if (partesNome.length <= 2) {
      return nomeCompleto;
    } else if (partesNome.length === 3) {
      return `${partesNome[0]} ${partesNome[1]} ${partesNome[2]}`;
    } else {
      return `${partesNome[0]} ${partesNome[1]}...`;
    }
  };

  return (
    <div className="form-container">
      <div className="form-list-content">
        <div className="form-list-top">
          <h1 className="form-list-top-h1">Gerenciamento de Alunos</h1>
          <Link className="form-criar" to="/alunos/add">
            Adicionar Aluno
          </Link>
        </div>
        <div className="form-list-input">
          <input
            className="form-list-input-input"
            type="text"
            placeholder="Buscar por nome ou CPF"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela-form-lista-aluno">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlunos.length > 0 ? (
              filteredAlunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td title={aluno.nome}>{formatarNome(aluno.nome)}</td>
                  <td>{aluno.email}</td>
                  <td>{aluno.cpf}</td>
                  <td className="for-list-acoes-aluno">
                    <div className="for-list-acoes-aluno-icons">
                      <Link to={`/alunos/edit/${aluno.id}`}>
                        <img src={Edit} alt="Editar" />
                      </Link>
                      <Link onClick={() => handleDelete(aluno.id)}>
                        <img src={Delete} alt="Deletar" />
                      </Link>
                    </div>
                    <div className="for-list-acoes-aluno-buttons">
                      <Link
                        className="edit-btn-aluno"
                        to={`/registroacademico/${aluno.id}`}
                      >
                        <button>Reg Aca</button>
                      </Link>

                      {user && role.role === "admin" ? (
                        <>
                          <Link
                            className={user.role === "admin" ? "edit-btn-aluno": "disable"}
                            to={`/mensalidade/${aluno.id}`}
                          >
                            <button>Mensalidade</button>
                          </Link>
                          <Link
                            className={user.role === "admin" ? "edit-btn-aluno": "disable"}
                            to={`/boletim/${aluno.id}`}
                          >
                            <button>Boletim</button>
                          </Link>
                          <Link
                            className={user.role === "admin" ? "edit-btn-aluno": "disable"}
                            to={`/diplomas/${aluno.id}`}
                          >
                            <button>Diploma</button>
                          </Link>{" "}
                        </>
                      ) : (
                        <>
                          <Link
                            className={user.role === "admin" ? "edit-btn-aluno": "disable"}
                            to={`/mensalidade/${aluno.id}`}
                          >
                            <button disabled>Mensalidade</button>
                          </Link>
                          <Link
                            className={user.role === "admin" ? "edit-btn-aluno": "disable"}
                            to={`/boletim/${aluno.id}`}
                          >
                            <button disabled>Boletim</button>
                          </Link>
                          <Link
                            className={user.role === "admin" ? "edit-btn-aluno": "disable"}
                            to={`/diplomas/${aluno.id}`}
                          >
                            <button disabled>Diploma</button>
                          </Link>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Nenhum aluno encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alunos;
