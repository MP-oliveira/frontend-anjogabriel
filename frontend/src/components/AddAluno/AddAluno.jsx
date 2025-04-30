import { useEffect, useState } from "react";
import api from "../../services/api"; // Importando o serviço de API
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import VoltarButton from "../VoltarButton/VoltarButton";



// Regex para CPF com ou sem pontuação
const cpfRegex = /^(\d{3}.?\d{3}.?\d{3}-?\d{2})$/;

// Regex para RG com ou sem pontuação

// Regex para telefone celular e fixo com ou sem pontuação
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
  cpf: z.string().refine((value) => cpfRegex.test(value), {
    message: "CPF inválido",
  }),
  endereco: z.string(),
  n_casa: z.string(),
  bairro: z.string(),
  celular: z.string().refine((value) => celularRegex.test(value), {
    message: "Celular inválido",
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
  // data_termino_curso: z
  //   .date()
  //   .max(new Date(), { message: "Digite uma data termino valida" }),
  password: z.string().min(6, {
    message: "Senha Invalida. A senha de ter pelo menos 6 caracteres. ",
  }),
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
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [n_casa, setN_casa] = useState("");
  const [bairro, setBairro] = useState("");
  const [celular, setCelular] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [curso, setCurso] = useState("");
  const [turno, setTurno] = useState("");
  const [data_matricula, setData_matricula] = useState("");
  // const [data_termino_curso, setData_termino_curso] = useState("");
  const [file, setFile] = useState(null);
  const [historico, setHistorico] = useState(null);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [cursos, setCursos] = useState([]);
  const [curso_id, setCurso_id] = useState(0);
  const [turno_id, setTurno_id] = useState("");
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cursosResponse, turnosResponse] = await Promise.all([
          api.get("/cursos"),
          api.get("/turnos"),
        ]);
        setCursos(cursosResponse.data);
        setTurnos(turnosResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleHistoricoChange = (event) => {
    setHistorico(event.target.files[0]);
  };

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
      cpf,
      endereco,
      n_casa,
      bairro,
      celular,
      cep,
      cidade,
      estado,
      curso,
      turno,
      data_matricula: new Date(data_matricula),
      // data_termino_curso: new Date(data_termino_curso),
      password,
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
        cpf: fieldErrors.cpf?._errors[0],
        endereco: fieldErrors.endereco?._errors[0],
        n_casa: fieldErrors.n_casa?._errors[0],
        bairro: fieldErrors.bairro?._errors[0],
        celular: fieldErrors.celular?._errors[0],
        cep: fieldErrors.cep?._errors[0],
        cidade: fieldErrors.cidade?._errors[0],
        estado: fieldErrors.estado?._errors[0],
        curso: fieldErrors.curso?._errors[0],
        turno: fieldErrors.turno?._errors[0],
        data_matricula: fieldErrors.data_matricula?._errors[0],
        // data_termino_curso: fieldErrors.data_termino_curso?._errors[0],
        password: fieldErrors.password?._errors[0],
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
        formData.append("cpf", alunoresult.data.cpf);
        formData.append("endereco", alunoresult.data.endereco);
        formData.append("n_casa", alunoresult.data.n_casa);
        formData.append("bairro", alunoresult.data.bairro);
        formData.append("celular", alunoresult.data.celular);
        formData.append("cep", alunoresult.data.cep);
        formData.append("cidade", alunoresult.data.cidade);
        formData.append("estado", alunoresult.data.estado);
        formData.append("curso", alunoresult.data.curso);
        formData.append("turno", alunoresult.data.turno);
        formData.append("data_matricula", alunoresult.data.data_matricula);
        // formData.append(
        //   "data_termino_curso",
        //   alunoresult.data.data_termino_curso
        // );
        formData.append("file", file);
        formData.append("historico", historico);
        formData.append("password", alunoresult.data.password);

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
          setCpf(""),
          setEndereco(""),
          setN_casa(""),
          setBairro(""),
          setCelular(""),
          setCep(""),
          setCidade(""),
          setEstado("Selecione o estado"),
          setCurso("Curso"),
          setTurno("Turno"),
          setData_matricula(""),
          // setData_termino_curso("");
          setPassword("");
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
    <div className="form-container">
      <form className="form-add" onSubmit={handleSubmit}>
        <VoltarButton url="/alunos" />

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
        <div className="input-three-columns">
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
            className="custom-date-input"
          />
          {errors.data_nascimento && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.data_nascimento}
            </p>
          )}
          <div className="custom-select-wrapper">
            <select onChange={(e) => setEstado_civil(e.target.value)}>
              <option value="">Estado civil</option>
              <option value="Solteiro">Solteiro(a)</option>
              <option value="Casado">Casado(a)</option>
              <option value="Viuvo">Viuvo(a)</option>
            </select>
          </div>
          {errors.estado_civil && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.estado_civil}
            </p>
          )}
        </div>
        <div className="input-three-columns">
          <div className="custom-select-wrapper">
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
            {errors.estado_civil && (
              <p className="error_message" style={{ color: "red" }}>
                {errors.grupo_sanguineo}
              </p>
            )}
          </div>
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
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Endereço"
        />
        <div className="input-three-columns">
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
        <div className="input-three-columns">
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
          <div className="custom-select-wrapper">
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
        </div>
        <div className="input-three-columns">
          <div className="custom-select-wrapper">
            <select
              value={turno_id}
              onChange={(e) => setTurno_id(e.target.value)}
            >
              <option value="">Selecione o Turno</option>
              {turnos.map((turno) => (
                <option key={turno.id} value={turno.id}>
                  {turno.nome}
                </option>
              ))}
            </select>
            {errors.turnos_id && (
              <p className="error_message" style={{ color: "red" }}>
                {errors.turno_id}
              </p>
            )}
          </div>
          <input
            type="date"
            value={data_matricula}
            onChange={(e) => setData_matricula(e.target.value)}
            className="custom-date-input"
          />
          {errors.data_matricula && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.data_matricula}
            </p>
          )}
          <div className="custom-select-wrapper">
            <select
              value={curso_id}
              onChange={(e) => setCurso_id(e.target.value)}
            >
              <option value="">Selecione o Curso</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.nome}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>
          {errors.curso_id && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.curso_id}
            </p>
          )}
        </div>
        <div className="input-file">
          <div className="input-file input-file-button">
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            Adicione sua Foto
          </div>
          <div className="input-file input-file-button">
            <input
              type="file"
              id="historico"
              name="historico"
              accept="application/pdf"
              onChange={handleHistoricoChange}
            />
            Adicione seu Histórico (.pdf até 10Mb)
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha"
          />
          {errors.password && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.password._errors?.[0]}
            </p>
          )}
        </div>
        <div className="form-btn-container">
          <button className="form-btn" type="submit">
            Adicionar Usuário
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAluno;
