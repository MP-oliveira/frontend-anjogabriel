import React, { useState } from "react";
import api from "../services/api"; // Importando o serviço de API

const AddAluno = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [data_nascimento, setData_nascimento] = useState("");
  const [estado_civil, setEstado_civil] = useState("");
  const [grupo_sanguineo, setGrupo_sanguineo] = useState("");
  const [naturalidade, setNaturalidade] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  const [pai, setPai] = useState("");
  const [mae, setMae] = useState("");
  const [rg, setRg] = useState("");
  const [orgao_expedidor_rg, setOrgao_expedidor_rg] = useState("");
  const [data_expedicao_rg, setData_expedicao_rg] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [n_casa, setN_casa] = useState("");
  const [bairro, setBairro] = useState("");
  const [tel_res, setTel_res] = useState("");
  const [celular, setCelular] = useState("");
  const [tel_trabalho, setTel_trabalho] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [curso, setCurso] = useState("");
  const [turno, setTurno] = useState("");
  const [data_matricula, setData_matricula] = useState("");
  const [data_termino_curso, setData_termino_curso] = useState("");



  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Criar um FormData para enviar os arquivos junto com os dados
    const newAluno = {
      nome,
      email,
      data_nascimento,
      estado_civil,
      grupo_sanguineo,
      naturalidade,
      nacionalidade,
      pai,
      mae,
      rg,
      orgao_expedidor_rg,
      data_expedicao_rg,
      cpf,
      endereco,
      n_casa,
      bairro,
      tel_res,
      celular,
      tel_trabalho,
      cep,
      cidade,
      estado,
      curso,
      turno,
      data_matricula,
      data_termino_curso,
    }


    try {
      // Enviar os dados para a API
      await api.post("/alunos/create", newAluno);
      alert("Usuário adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar usuário", error);
    }
  };



  return (
    <>
      <h2>Adicionar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="text"
          value={data_nascimento}
          onChange={(e) => setData_nascimento(e.target.value)}
          placeholder="Data de nascimento"
        />
        <input
          type="text"
          value={estado_civil}
          onChange={(e) => setEstado_civil(e.target.value)}
          placeholder="Estado Civil"
        />
        <input
          type="text"
          value={grupo_sanguineo}
          onChange={(e) => setGrupo_sanguineo(e.target.value)}
          placeholder="Grupo Sanguíneo"
        />
        <input
          type="text"
          value={naturalidade}
          onChange={(e) => setNaturalidade(e.target.value)}
          placeholder="Naturalidade"
        />
        <input
          type="text"
          value={nacionalidade}
          onChange={(e) => setNacionalidade(e.target.value)}
          placeholder="Nacionalidade"
        />
        <input
          type="text"
          value={pai}
          onChange={(e) => setPai(e.target.value)}
          placeholder="Nome do Pai"
        />
        <input
          type="text"
          value={mae}
          onChange={(e) => setMae(e.target.value)}
          placeholder="Nome da Mãe"
        />
        <input
          type="text"
          value={rg}
          onChange={(e) => setRg(e.target.value)}
          placeholder="RG"
        />
        <input
          type="text"
          value={orgao_expedidor_rg}
          onChange={(e) => setOrgao_expedidor_rg(e.target.value)}
          placeholder="Orgão Expedidor do RG"
        />
        <input
          type="text"
          value={data_expedicao_rg}
          onChange={(e) => setData_expedicao_rg(e.target.value)}
          placeholder="Data de Expedição do RG"
        />
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="CPF"
        />
        <input
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Endereço"
        />
        <input
          type="text"
          value={n_casa}
          onChange={(e) => setN_casa(e.target.value)}
          placeholder="Número da Casa"
        />
        <input
          type="text"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          placeholder="Bairro"
        />
        <input
          type="text"
          value={tel_res}
          onChange={(e) => setTel_res(e.target.value)}
          placeholder="Telefone Residencial"
        />
        <input
          type="text"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
          placeholder="Celular"
        />
        <input
          type="text"
          value={tel_trabalho}
          onChange={(e) => setTel_trabalho(e.target.value)}
          placeholder="Telefone do Trabalho"
        />
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="CEP"
        />
        <input
          type="text"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          placeholder="Cidade"
        />
        <input
          type="text"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          placeholder="Estado"
        />
        <input
          type="text"
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          placeholder="Curso"
        />
        <input
          type="text"
          value={turno}
          onChange={(e) => setTurno(e.target.value)}
          placeholder="Turno"
        />
         <input
          type="text"
          value={data_matricula}
          onChange={(e) => setData_matricula(e.target.value)}
          placeholder="Data da Matricula"
        />
         <input
          type="text"
          value={data_termino_curso}
          onChange={(e) => setData_termino_curso(e.target.value)}
          placeholder="Data de Término do Curso"
        />

        <button type="submit">Adicionar Usuário</button>
      </form>
    </>
  );
};

export default AddAluno;
