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
  const [foto_url, setFoto_url] = useState("");
  const [historico_url, setHistorico_url] = useState("");

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      foto_url,
      historico_url,
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto_url(reader.result);
      };
      reader.readAsDataURL(file);
    };

    const handleHistoricoChange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setHistorico_url(reader.result);
      };
      reader.readAsDataURL(file);
    };

    try {
      await api.post("/create", { newAluno }); // Envia uma requisição POST
      alert("Usuário adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar usuário", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Adicionar Usuário</h2>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome"
        // required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        // required
      />
      <input
        type="text"
        value={data_nascimento}
        onChange={(e) => setData_nascimento(e.target.value)}
        placeholder="Data de nascimento"
        // required
      />
      <input
        type="text"
        value={estado_civil}
        onChange={(e) => setEstado_civil(e.target.value)}
        placeholder="Estado"
        // required
      />
      <input
        type="text"
        value={grupo_sanguineo}
        onChange={(e) => setGrupo_sanguineo(e.target.value)}
        placeholder="Grupo sanguineo"
        // required
      />
      <input
        type="text"
        value={naturalidade}
        onChange={(e) => setNaturalidade(e.target.value)}
        placeholder="Naturalidade"
        // required
      />
      <input
        type="text"
        value={nacionalidade}
        onChange={(e) => setNacionalidade(e.target.value)}
        placeholder="Nacionalidade"
        // required
      />
      <input
        type="text"
        value={pai}
        onChange={(e) => setPai(e.target.value)}
        placeholder="Nome do Pai"
        // required
      />
      <input
        type="text"
        value={mae}
        onChange={(e) => setMae(e.target.value)}
        placeholder="Nome da mae"
        // required
      />
      <input
        type="text"
        value={rg}
        onChange={(e) => setRg(e.target.value)}
        placeholder="Numero do RG"
        // required
      />
      <input
        type="text"
        value={orgao_expedidor_rg}
        onChange={(e) => setOrgao_expedidor_rg(e.target.value)}
        placeholder="Orgão expedidor"
        // required
      />
      <input
        type="text"
        value={data_expedicao_rg}
        onChange={(e) => setData_expedicao_rg(e.target.value)}
        placeholder="Data de expedição"
        // required
      />
      <input
        type="text"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        placeholder="CPF"
        // required
      />
      <input
        type="text"
        value={endereco}
        onChange={(e) => setEndereco(e.target.value)}
        placeholder="Endereço"
        // required
      />
      <input
        type="text"
        value={n_casa}
        onChange={(e) => setN_casa(e.target.value)}
        placeholder="Numero"
        // required
      />
      <input
        type="text"
        value={bairro}
        onChange={(e) => setBairro(e.target.value)}
        placeholder="Bairro"
        // required
      />
      <input
        type="text"
        value={tel_res}
        onChange={(e) => setTel_res(e.target.value)}
        placeholder="Telefone residencial"
        // required
      />
      <input
        type="text"
        value={celular}
        onChange={(e) => setCelular(e.target.value)}
        placeholder="Celular"
        // required
      />
      <input
        type="text"
        value={tel_trabalho}
        onChange={(e) => setTel_trabalho(e.target.value)}
        placeholder="Tel trabalho"
        // required
      />
      <input
        type="text"
        value={cep}
        onChange={(e) => setCep(e.target.value)}
        placeholder="CEP"
        // required
      />
      <input
        type="text"
        value={cidade}
        onChange={(e) => setCidade(e.target.value)}
        placeholder="Cidade"
        // required
      />
      <input
        type="text"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        placeholder="Estado"
        // required
      />
      <input
        type="text"
        value={curso}
        onChange={(e) => setCurso(e.target.value)}
        placeholder="Curso"
        // required
      />
      <input
        type="text"
        value={turno}
        onChange={(e) => setTurno(e.target.value)}
        placeholder="Turno"
        // required
      />
      <input type="file" onChange={(e) => handleImageChange}  placeholder="Foto"/>
      <input
        type="file"
        value={historico_url}
        onChange={(e) => {
          handleHistoricoChange;
        }}
        placeholder="Historico"
        // required
      />
      <button type="submit">Adicionar</button>
    </form>
  );
};

export default AddAluno;
