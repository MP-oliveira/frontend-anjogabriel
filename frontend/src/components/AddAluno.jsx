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
<<<<<<< HEAD
  
=======
  const [foto_url, setFoto_url] = useState(null); // Estado para armazenar a foto
  const [historico_url, setHistorico_url] = useState(null); // Estado para armazenar o histórico
>>>>>>> 7b5768445a4bbd501d52bb79609e64703a5510e8

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD

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
        
    }


    try {
      // Enviar os dados para a API
      await api.post("/alunos/create", newAluno);
=======

    // Criar um FormData para enviar os arquivos junto com os dados
    const formData = new FormData();

    // Adicionar os campos de texto ao FormData
    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("data_nascimento", data_nascimento);
    formData.append("estado_civil", estado_civil);
    formData.append("grupo_sanguineo", grupo_sanguineo);
    formData.append("naturalidade", naturalidade);
    formData.append("nacionalidade", nacionalidade);
    formData.append("pai", pai);
    formData.append("mae", mae);
    formData.append("rg", rg);
    formData.append("orgao_expedidor_rg", orgao_expedidor_rg);
    formData.append("data_expedicao_rg", data_expedicao_rg);
    formData.append("cpf", cpf);
    formData.append("endereco", endereco);
    formData.append("n_casa", n_casa);
    formData.append("bairro", bairro);
    formData.append("tel_res", tel_res);
    formData.append("celular", celular);
    formData.append("tel_trabalho", tel_trabalho);
    formData.append("cep", cep);
    formData.append("cidade", cidade);
    formData.append("estado", estado);
    formData.append("curso", curso);
    formData.append("turno", turno);

    // Adicionar a foto ao FormData, se existir
    if (foto_url) formData.append("foto", foto_url);

    // Adicionar o histórico ao FormData, se existir
    if (historico_url) formData.append("historico", historico_url);

    try {
      // Enviar os dados para a API
      await api.post("/alunos/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Definir o cabeçalho adequado para envio de arquivos
        },
      });
>>>>>>> 7b5768445a4bbd501d52bb79609e64703a5510e8
      alert("Usuário adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar usuário", error);
    }
  };

<<<<<<< HEAD

=======
  // Função para manipular o arquivo de imagem selecionado
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Obter o arquivo selecionado
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto_url(file); // Definir o arquivo no estado
      };
      reader.readAsDataURL(file); // Ler o arquivo para exibição prévia, se necessário
    }
  };

  // Função para manipular o arquivo de histórico selecionado
  const handleHistoricoChange = (e) => {
    const file = e.target.files[0]; // Obter o arquivo selecionado
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHistorico_url(file); // Definir o arquivo no estado
      };
      reader.readAsDataURL(file); // Ler o arquivo para exibição prévia, se necessário
    }
  };
>>>>>>> 7b5768445a4bbd501d52bb79609e64703a5510e8

  return (
    <form onSubmit={handleSubmit}>
      <h2>Adicionar Usuário</h2>
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

<<<<<<< HEAD
=======
      {/* Input para foto */}
      <input type="file" accept="image/*" onChange={handleImageChange} />
      
      {/* Input para histórico */}
      <input type="file" accept=".pdf" onChange={handleHistoricoChange} />

>>>>>>> 7b5768445a4bbd501d52bb79609e64703a5510e8
      <button type="submit">Adicionar Usuário</button>
    </form>
  );
};

export default AddAluno;
