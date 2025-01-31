import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddRegistroAcademico = () => {
  const navigate = useNavigate();
  const [registroAcademicoData, setRegistroAcademicoData] = useState({
    alunoId: "",
    disciplinaId: "",
    faltaData: "",
    faltaMotivo: "",
    notaValor: "",
    provaData: "",
    provaDescricao: "",
    testeData: "",
    testeDescricao: "",
    trabalhoData: "",
    trabalhoDescricao: "",
  });
  const [errors, setErrors] = useState({});


  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistroAcademicoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!registroAcademicoData.alunoId) {
      newErrors.alunoId = "O ID do aluno é obrigatório.";
    }
    if (!registroAcademicoData.disciplinaId) {
      newErrors.disciplinaId = "O ID da disciplina é obrigatório.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Enviar os dados para o backend (substitua com chamada à API real)
    console.log("Dados do Registro Acadêmico:", registroAcademicoData);
    navigate("/registroacademico"); // Redirecionar após a submissão
  };

  return (
    <div className="addaluno-container">
      <form className="form-addaluno" onSubmit={handleSubmit}>
        <h2>Adicionar Registro Acadêmico</h2>

        <label>ID do Aluno</label>
        <input
          type="number"
          name="alunoId"
          value={registroAcademicoData.alunoId}
          onChange={handleInputChange}
          placeholder="ID do Aluno"
        />
        {errors.alunoId && <p className="error_message">{errors.alunoId}</p>}

        <label>ID da Disciplina</label>
        <input
          type="number"
          name="disciplinaId"
          value={registroAcademicoData.disciplinaId}
          onChange={handleInputChange}
          placeholder="ID da Disciplina"
        />
        {errors.disciplinaId && <p className="error_message">{errors.disciplinaId}</p>}

        <label>Data da Falta</label>
        <input
          type="date"
          name="faltaData"
          value={registroAcademicoData.faltaData}
          onChange={handleInputChange}
        />

        <label>Motivo da Falta</label>
        <input
          type="text"
          name="faltaMotivo"
          value={registroAcademicoData.faltaMotivo}
          onChange={handleInputChange}
          placeholder="Motivo da Falta"
        />

        <label>Valor da Nota</label>
        <input
          type="number"
          step="0.01"
          name="notaValor"
          value={registroAcademicoData.notaValor}
          onChange={handleInputChange}
          placeholder="Valor da Nota"
        />

        <label>Data da Prova</label>
        <input
          type="date"
          name="provaData"
          value={registroAcademicoData.provaData}
          onChange={handleInputChange}
        />

        <label>Descrição da Prova</label>
        <input
          type="text"
          name="provaDescricao"
          value={registroAcademicoData.provaDescricao}
          onChange={handleInputChange}
          placeholder="Descrição da Prova"
        />

        <label>Data do Teste</label>
        <input
          type="date"
          name="testeData"
          value={registroAcademicoData.testeData}
          onChange={handleInputChange}
        />

        <label>Descrição do Teste</label>
        <input
          type="text"
          name="testeDescricao"
          value={registroAcademicoData.testeDescricao}
          onChange={handleInputChange}
          placeholder="Descrição do Teste"
        />

        <label>Data do Trabalho</label>
        <input
          type="date"
          name="trabalhoData"
          value={registroAcademicoData.trabalhoData}
          onChange={handleInputChange}
        />

        <label>Descrição do Trabalho</label>
        <input
          type="text"
          name="trabalhoDescricao"
          value={registroAcademicoData.trabalhoDescricao}
          onChange={handleInputChange}
          placeholder="Descrição do Trabalho"
        />

        <button className='aluno-btn' type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default AddRegistroAcademico;
