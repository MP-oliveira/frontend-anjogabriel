import "./AddAluno.css";
import React, { useState } from "react";
import api from "../../services/api"; // Importando o serviço de API
import { z } from "zod";
import { useNavigate } from "react-router-dom";

// Regex para CPF com ou sem pontuação
const cpfRegex = /^(\d{3}.?\d{3}.?\d{3}-?\d{2})$/;

// Regex para RG com ou sem pontuação
const rgRegex = /^(\d{1,2}.?\d{3}.?\d{3}-?[A-Za-z0-9]{1})$/;

// Regex para telefone celular e fixo com ou sem pontuação
const telefoneRegex = /^(\d{2})?\s?\d{4,5}-?\d{4}$/;
const celularRegex = /^(\d{2})?\s?\d{5}-?\d{4}$/;

// Regex para CEP com ou sem hífen
const cepRegex = /^\d{5}-?\d{3}$/;

const alunoSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome precisa ter no minimo 3 caracteres." }),
  email: z.coerce.string().email({ message: "Digite um email valido." }).min(5),
  data_nascimento: z
    .date()
    .max(new Date(), { message: "Digite uma data valida" }),
  estado_civil: z.string({ message: "Selecione uma opção" }),
  grupo_sanguineo: z.string({ message: "Selecione uma opção" }),
  naturalidade: z
    .string()
    .min(3, { message: "Digite uma naturalizade valida" }),
  nacionalidade: z
    .string()
    .min(3, { message: "Digite uma nacionalidade valida" }),
  pai: z.string(),
  mae: z.string(),
  rg: z.string().refine((value) => rgRegex.test(value), {
    message: "RG inválido",
  }),
  orgao_expedidor_rg: z.string(),
  data_expedicao_rg: z
    .date()
    .max(new Date(), { message: "Digite uma data expedição valida" }),
  cpf: z.string().refine((value) => cpfRegex.test(value), {
    message: "CPF inválido",
  }),
  endereco: z.string(),
  n_casa: z.string(),
  bairro: z.string(),
  tel_res: z.string().refine((value) => telefoneRegex.test(value), {
    message: "Telefone inválido",
  }),
  celular: z.string().refine((value) => celularRegex.test(value), {
    message: "Celular inválido",
  }),
  tel_trabalho: z.string().refine((value) => celularRegex.test(value), {
    message: "Telefone de trabalho inválido",
  }),
  cep: z.string().refine((value) => cepRegex.test(value), {
    message: "CEP inválido",
  }),
  cidade: z.string(),
  estado: z.string(),
  curso: z.string(),
  turno: z.string(),
  data_matricula: z
    .date()
    .max(new Date(), { message: "Digite uma data matricula valida" }),
  data_termino_curso: z
    .date()
    .max(new Date(), { message: "Digite uma data termino valida" }),
});

const AddAluno = () => {
  const navigate = useNavigate();

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
  const [file, setFile] = useState(null);
  const [historico, setHistorico] = useState(null);

  // Estado para armazenar os erros de validação
  const [errors, setErrors] = useState({});

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleHistoricoChange = (event) => {
    setHistorico(event.target.value[0]);
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const alunoFormValues = {
      nome,
      email,
      data_nascimento: new Date(data_nascimento),
      estado_civil,
      grupo_sanguineo,
      naturalidade,
      nacionalidade,
      pai,
      mae,
      rg,
      orgao_expedidor_rg,
      data_expedicao_rg: new Date(data_expedicao_rg),
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
      data_matricula: new Date(data_matricula),
      data_termino_curso: new Date(data_termino_curso),
    };

    // Validando os dados com o esquema do Zod
    const alunoresult = alunoSchema.safeParse(alunoFormValues);

    // Se houver erros, eles serão exibidos
    if (!alunoresult.success) {
      const fieldErrors = alunoresult.error.format();
      setErrors({
        nome: fieldErrors.nome?._errors[0],
        email: fieldErrors.email?._errors[0],
        data_nascimento: fieldErrors.email?._errors[0],
        estado_civil: fieldErrors.estado_civil?._errors[0],
        grupo_sanguineo: fieldErrors.grupo_sanguineo?._errors[0],
        naturalidade: fieldErrors.naturalidade?._errors[0],
        nacionalidade: fieldErrors.nacionalidade?._errors[0],
        pai: fieldErrors.pai?._errors[0],
        mae: fieldErrors.mae?._errors[0],
        rg: fieldErrors.rg?._errors[0],
        orgao_expedidor_rg: fieldErrors.orgao_expedidor_rg?._errors[0],
        data_expedicao_rg: fieldErrors.data_expedicao_rg?._errors[0],
        cpf: fieldErrors.cpf?._errors[0],
        endereco: fieldErrors.endereco?._errors[0],
        n_casa: fieldErrors.n_casa?._errors[0],
        bairro: fieldErrors.bairro?._errors[0],
        tel_res: fieldErrors.tel_res?._errors[0],
        celular: fieldErrors.celular?._errors[0],
        tel_trabalho: fieldErrors.tel_trabalho?._errors[0],
        cep: fieldErrors.cep?._errors[0],
        cidade: fieldErrors.cidade?._errors[0],
        estado: fieldErrors.estado?._errors[0],
        curso: fieldErrors.curso?._errors[0],
        turno: fieldErrors.turno?._errors[0],
        data_matricula: fieldErrors.data_matricula?._errors[0],
        data_termino_curso: fieldErrors.data_termino_curso?._errors[0],
      });
    } else {
      try {
        const formData = new FormData();
        formData.append("nome", alunoresult.data.nome);
        formData.append("email", alunoresult.data.email);
        formData.append("data_nascimento", alunoresult.data.data_nascimento);
        formData.append("estado_civil", alunoresult.data.estado_civil);
        formData.append("grupo_sanguineo", alunoresult.data.grupo_sanguineo);
        formData.append("naturalidade", alunoresult.data.naturalidade);
        formData.append("nacionalidade", alunoresult.data.nacionalidade);
        formData.append("pai", alunoresult.data.pai);
        formData.append("mae", alunoresult.data.mae);
        formData.append("rg", alunoresult.data.rg);
        formData.append(
          "orgao_expedidor_rg",
          alunoresult.data.orgao_expedidor_rg
        );
        formData.append(
          "data_expedicao_rg",
          alunoresult.data.data_expedicao_rg
        );
        formData.append("cpf", alunoresult.data.cpf);
        formData.append("endereco", alunoresult.data.endereco);
        formData.append("n_casa", alunoresult.data.n_casa);
        formData.append("bairro", alunoresult.data.bairro);
        formData.append("tel_res", alunoresult.data.tel_res);
        formData.append("celular", alunoresult.data.celular);
        formData.append("tel_trabalho", alunoresult.data.tel_trabalho);
        formData.append("cep", alunoresult.data.cep);
        formData.append("cidade", alunoresult.data.cidade);
        formData.append("estado", alunoresult.data.estado);
        formData.append("curso", alunoresult.data.curso);
        formData.append("turno", alunoresult.data.turno);
        formData.append("data_matricula", alunoresult.data.data_matricula);
        formData.append(
          "data_termino_curso",
          alunoresult.data.data_termino_curso
        );
        formData.append("file", file);
        formData.append("historico", historico);

        console.log(formData, " form Data");
        // Enviar os dados para a API
        // const response = await api.post("/alunos/create", alunoFormValues);
        const response = await api.post("/alunos/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // .then((res) => console.log(res))
        // .catch((err) => console.log(err));

        alert(`Upload bem-sucedido: ${response.data.fileUrl}`);
        console.log("Usuário adicionado com sucesso!", response.data);

        // zerar os inputs
        setNome(""),
          setEmail(""),
          setData_nascimento(""),
          setEstado_civil("Estado Civil"),
          setGrupo_sanguineo("Grupo Sanguineo"),
          setNaturalidade(""),
          setNacionalidade(""),
          setPai(""),
          setMae(""),
          setRg(""),
          setOrgao_expedidor_rg(""),
          setData_expedicao_rg(""),
          setCpf(""),
          setEndereco(""),
          setN_casa(""),
          setBairro(""),
          setTel_res(""),
          setCelular(""),
          setTel_trabalho(""),
          setCep(""),
          setCidade(""),
          setEstado("Selecione o estado"),
          setCurso("Curso"),
          setTurno("Turno"),
          setData_matricula(""),
          setData_termino_curso("");
        navigate("/alunos");
      } catch (error) {
        console.error("Erro ao adicionar usuário", error);
      }
      // Se passar na validação, pode enviar os dados ou executar outras ações
      // console.log("Dados válidos", alunoresult.data);
      setErrors({}); // Limpa os erros se a validação for bem-sucedida
    }
  };

  return (
    <div className="addaluno-container">
      <form className="form-addaluno" onSubmit={handleSubmit}>
        <h2>Adicionar Aluno</h2>
        <input
          id="nome"
          type="text"
          name="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        {/* Exibe a mensagem de erro do campo nome, se houver */}
        {errors.nome && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.nome}
          </p>
        )}
        <div className="email-dn">
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          {/* Exibe a mensagem de erro do campo email, se houver */}
          {errors.email && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.email}
            </p>
          )}
          <input
            type="date"
            value={data_nascimento}
            onChange={(e) => setData_nascimento(e.target.value)}
            placeholder="Data de nascimento"
          />
          {errors.data_nascimento && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.data_nascimento}
            </p>
          )}
          <select onChange={(e) => setEstado_civil(e.target.value)}>
            <option value="">Estado civil</option>
            <option value="solteiro">Solteiro(a)</option>
            <option value="casado">Casado(a)</option>
            <option value="viuvo">Viuvo(a)</option>
          </select>
          {errors.estado_civil && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.estado_civil}
            </p>
          )}
        </div>
        <div className="gs-n-n">
          <select onChange={(e) => setGrupo_sanguineo(e.target.value)}>
            <option value="">Grupo Sanguineo</option>
            <option value="A-">A-</option>
            <option value="A+">A+</option>
            <option value="B-">B-</option>
            <option value="B+">B+</option>
            <option value="AB-">AB-</option>
            <option value="AB+">AB+</option>
            <option value="O-">O-</option>
            <option value="O+">O+</option>
          </select>
          <input
            type="text"
            value={naturalidade}
            onChange={(e) => setNaturalidade(e.target.value)}
            placeholder="Naturalidade"
          />
          {errors.naturalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.naturalidade}
            </p>
          )}
          <input
            type="text"
            value={nacionalidade}
            onChange={(e) => setNacionalidade(e.target.value)}
            placeholder="Nacionalidade"
          />
          {errors.nacionalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.nacionalidade}
            </p>
          )}
        </div>
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
        <div className="rg-oe-de">
          <input
            type="text"
            value={rg}
            onChange={(e) => setRg(e.target.value)}
            placeholder="RG"
          />
          {errors.rg && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.rg}
            </p>
          )}
          <input
            type="text"
            value={orgao_expedidor_rg}
            onChange={(e) => setOrgao_expedidor_rg(e.target.value)}
            placeholder="Orgão Expedidor"
          />
          {errors.orgao_expedidor_rg && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.orgao_expedidor_rg}
            </p>
          )}
          <input
            type="date"
            value={data_expedicao_rg}
            onChange={(e) => setData_expedicao_rg(e.target.value)}
            placeholder="Data de Expedição "
          />
          {errors.data_expedicao_rg && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.data_expedicao_rg}
            </p>
          )}
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="CPF"
          />
          {errors.cpf && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cpf}
            </p>
          )}
        </div>
        <input
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Endereço"
        />
        <div className="nc-b">
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
        </div>
        <div className="tel">
          <input
            type="text"
            value={tel_res}
            onChange={(e) => setTel_res(e.target.value)}
            placeholder="Telefone Residencial"
          />
          {errors.tel_res && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.tel_res}
            </p>
          )}
          <input
            type="text"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            placeholder="Celular"
          />
          {errors.celular && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.celular}
            </p>
          )}
          <input
            type="text"
            value={tel_trabalho}
            onChange={(e) => setTel_trabalho(e.target.value)}
            placeholder="Telefone do Trabalho"
          />
          {errors.tel_trabalho && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.tel_trabalho}
            </p>
          )}
        </div>
        <div className="cep-ci-es">
          <input
            type="text"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="CEP"
          />
          {errors.cep && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cep}
            </p>
          )}
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade"
          />
          {errors.cidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cidade}
            </p>
          )}
          <select
            id="estado"
            name="estado"
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="">Selecione o estado</option>
            <option value="AC">Acre (AC)</option>
            <option value="AL">Alagoas (AL)</option>
            <option value="AP">Amapá (AP)</option>
            <option value="AM">Amazonas (AM)</option>
            <option value="BA">Bahia (BA)</option>
            <option value="CE">Ceará (CE)</option>
            <option value="DF">Distrito Federal (DF)</option>
            <option value="ES">Espírito Santo (ES)</option>
            <option value="GO">Goiás (GO)</option>
            <option value="MA">Maranhão (MA)</option>
            <option value="MT">Mato Grosso (MT)</option>
            <option value="MS">Mato Grosso do Sul (MS)</option>
            <option value="MG">Minas Gerais (MG)</option>
            <option value="PA">Pará (PA)</option>
            <option value="PB">Paraíba (PB)</option>
            <option value="PR">Paraná (PR)</option>
            <option value="PE">Pernambuco (PE)</option>
            <option value="PI">Piauí (PI)</option>
            <option value="RJ">Rio de Janeiro (RJ)</option>
            <option value="RN">Rio Grande do Norte (RN)</option>
            <option value="RS">Rio Grande do Sul (RS)</option>
            <option value="RO">Rondônia (RO)</option>
            <option value="RR">Roraima (RR)</option>
            <option value="SC">Santa Catarina (SC)</option>
            <option value="SP">São Paulo (SP)</option>
            <option value="SE">Sergipe (SE)</option>
            <option value="TO">Tocantins (TO)</option>
          </select>
        </div>
        <div className="cur-tur-dai-dat">
          <select
            name="curso"
            id="curso"
            onChange={(e) => setCurso(e.target.value)}
          >
            <option value="">Curso</option>
            <option value="tecnico em enfermagem">Tecnico em enfermagem</option>
            <option value="tecnico em enfermagem do trabalho">
              Tecnico em enfermagem do trabalho
            </option>
          </select>
          {errors.curso && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.curso}
            </p>
          )}
          <select
            name="turno"
            id="turno"
            onChange={(e) => setTurno(e.target.value)}
          >
            <option value="">Turno</option>
            <option value="Matutino">Matutino</option>
            <option value="Vespertino">Vespertino</option>
            <option value="Noturno">Noturno</option>
            <option value="Sabado">Sabado</option>
          </select>

          <input
            type="date"
            value={data_matricula}
            onChange={(e) => setData_matricula(e.target.value)}
          />
          {errors.data_matricula && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.data_matricula}
            </p>
          )}
          <input
            type="date"
            value={data_termino_curso}
            onChange={(e) => setData_termino_curso(e.target.value)}
          />
          {errors.data_termino_curso && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.data_termino_curso}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="file">Selecione um arquivo:</label>
          <input type="file" id="file" onChange={handleFileChange} required />
        </div>
        <div>
          <label htmlFor="historico">Selecione um arquivo:</label>
          <input type="file" id="historico" onChange={handleHistoricoChange} required />
        </div>
        <div className="aluno-btn-container">
          <button className="aluno-btn" type="submit">
            Adicionar Usuário
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAluno;
