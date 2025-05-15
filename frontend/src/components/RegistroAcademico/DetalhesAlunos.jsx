import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./DetalhesAlunos.css";
import VoltarButton from "../VoltarButton/VoltarButton";
import Button from "@mui/material/Button";
import StarIcon from "@mui/icons-material/Star";
import { TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress } from "@mui/material";
import Delete from "../../assets/trash.svg";

const DetalhesAluno = () => {
  const { id } = useParams();
  const [registroAluno, setRegistroAluno] = useState({});
  const [disciplinasCursadas, setDisciplinasCursadas] = useState([]);
  const [disciplinaAtual, setDisciplinaAtual] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [registroAtualId, setRegistroAtualId] = useState(id); // ID do registro que está sendo editado
  const [alunoInfo, setAlunoInfo] = useState({
    nome: "",
    curso: "",
    turma: ""
  });
  const [formData, setFormData] = useState({
    notaProva: 0,
    notaTrabalho: 0,
    notaTeste: 0,
    estagioNota: 0,
    faltas: 0,
    totalAulas: 0
  });
  const [loading, setLoading] = useState(true);
  // Novas variáveis para a lista de disciplinas
  const [todasDisciplinas, setTodasDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [adicionandoDisciplina, setAdicionandoDisciplina] = useState(false);
  const [loadingDisciplinas, setLoadingDisciplinas] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // NOVO: Estado para pares de faltas
  const [faltas, setFaltas] = useState([{ data: '', motivo: '' }]);
  // Novo estado para mensalidades
  const [mensalidades, setMensalidades] = useState([]);
  const [loadingMensalidades, setLoadingMensalidades] = useState(true);

  // Função para buscar todas as disciplinas, com tentativas alternativas
  const fetchTodasDisciplinas = async () => {
    setLoadingDisciplinas(true);
    setErrorMsg("");

    // Lista de possíveis endpoints para tentar
    const endpoints = [
      '/disciplinas',         // Endpoint principal
      '/disciplina',          // Possível endpoint alternativo
      '/api/disciplinas'      // Outro possível caminho
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint);

        if (response.data) {
          // Verificar o formato dos dados
          const disciplinas = Array.isArray(response.data) ? response.data :
            (response.data.data && Array.isArray(response.data.data)) ? response.data.data : [];

          if (disciplinas.length > 0) {
            setTodasDisciplinas(disciplinas);
            setLoadingDisciplinas(false);
            return disciplinas;
          }
        }
      } catch (error) {
        console.error(`Erro ao tentar endpoint ${endpoint}:`, error);
      }
    }

    // Se chegou aqui, vamos tentar um mock de dados como último recurso
    setErrorMsg("Não foi possível carregar as disciplinas do servidor. Por favor, tente novamente mais tarde.");
    setLoadingDisciplinas(false);
    return [];
  };

  useEffect(() => {
    const fetchDetalhesAluno = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/registroacademico/${id}`);

        if (response.data) {
          setRegistroAluno(response.data);

          // Buscar informações do aluno
          try {
            const alunoId = response.data.alunoId || id;
            const alunoResponse = await api.get(`/alunos/${alunoId}`);

            if (alunoResponse.data) {
              setAlunoInfo({
                id: alunoResponse.data.id || alunoId,
                nome: alunoResponse.data.nome || response.data.aluno,
                curso: alunoResponse.data.curso?.nome || response.data.curso || "Não informado",
                cursoId: alunoResponse.data.cursoId || response.data.cursoId || 1,
                turma: alunoResponse.data.turno || response.data.turma || "Não informada"
              });

              // Buscar mensalidades do aluno
              try {
                const mensalidadesResponse = await api.get(`/pagamentos/aluno/${alunoResponse.data.id}`);
                setMensalidades(mensalidadesResponse.data.pagamentos || []);
              } catch (error) {
                console.error("Erro ao buscar mensalidades:", error);
                setMensalidades([]);
              }
            }
          } catch (error) {
            console.error("Erro ao buscar dados do aluno:", error);
            setAlunoInfo({
              id: response.data.alunoId || id,
              nome: response.data.aluno || "Aluno não identificado",
              curso: response.data.curso || "Não informado",
              cursoId: response.data.cursoId || 1,
              turma: response.data.turma || "Não informada"
            });
          }

          // Buscar disciplinas cursadas
          await fetchDisciplinasCursadas();

          // Define a disciplina atual com os dados de presença e faltas
          setDisciplinaAtual({
            nome: response.data.disciplina,
            notaProva: response.data.notaProva || 0,
            notaTrabalho: response.data.notaTrabalho || 0,
            notaTeste: response.data.notaTeste || 0,
            estagioNota: response.data.estagioNota || 0,
            media: response.data.media || 0,
            faltaData: response.data.faltaData || [],
            faltaMotivo: response.data.faltaMotivo || [],
            totalAulas: response.data.totalAulas || 0
          });

          // Inicializa o formulário com os dados atuais
          setFormData({
            notaProva: response.data.notaProva || 0,
            notaTrabalho: response.data.notaTrabalho || 0,
            notaTeste: response.data.notaTeste || 0,
            estagioNota: response.data.estagioNota || 0,
            faltas: response.data.faltaData?.length || 0,
            totalAulas: response.data.totalAulas || 0,
            faltaMotivo: response.data.faltaMotivo || ""
          });

          // Preencher faltas com os dados do backend
          if (response.data.faltaData && response.data.faltaMotivo) {
            const faltasBackend = response.data.faltaData.map((data, idx) => ({
              data: data ? new Date(data).toISOString().slice(0, 10) : '',
              motivo: response.data.faltaMotivo[idx] || ''
            }));
            setFaltas(faltasBackend.length > 0 ? faltasBackend : [{ data: '', motivo: '' }]);
          } else {
            setFaltas([{ data: '', motivo: '' }]);
          }
        }

      } catch (error) {
        console.error("Erro ao buscar detalhes do aluno:", error);
      } finally {
        await fetchTodasDisciplinas();
        setLoading(false);
        setLoadingMensalidades(false);
      }
    };

    fetchDetalhesAluno();
  }, [id]);

  // Função para buscar disciplinas cursadas
  const fetchDisciplinasCursadas = async () => {
    try {
      const alunoId = alunoInfo.id || registroAluno.alunoId || id;


      try {
        const disciplinasResponse = await api.get(`/registroacademico/aluno/${alunoId}`);

        if (disciplinasResponse.data && Array.isArray(disciplinasResponse.data)) {
          const disciplinasFormatadas = disciplinasResponse.data.map(disc => ({
            id: disc.id,
            nome: disc.disciplina,
            status: disc.mediaFinal >= 7 ? "Concluído" : "Em andamento",
            media: disc.mediaFinal || disc.media || 0,
            estagioNota: disc.estagioNota || 0,
            notaProva: disc.notaProva || 0,
            notaTeste: disc.notaTeste || 0,
            notaTrabalho: disc.notaTrabalho || 0,
            faltas: disc.faltas || 0,
            totalAulas: disc.totalAulas || 0, // Garantindo que totalAulas seja carregado
            faltaData: disc.faltaData || [],
            faltaMotivo: disc.faltaMotivo || []
          }));

          setDisciplinasCursadas(disciplinasFormatadas);
          return;
        }
      } catch (endpointError) {
        console.warn("Erro ao buscar disciplinas do endpoint específico:", endpointError);
      }

      // Tentativa alternativa: buscar da listagem completa
      const registrosResponse = await api.get('/registroacademico');

      if (registrosResponse.data && Array.isArray(registrosResponse.data)) {
        const registrosDoAluno = registrosResponse.data.filter(reg =>
          (reg.alunoId && reg.alunoId === alunoId) ||
          (reg.aluno && reg.aluno.toLowerCase().includes(alunoInfo.nome.toLowerCase()))
        );


        if (registrosDoAluno.length > 0) {
          const disciplinasFormatadas = registrosDoAluno.map(reg => ({
            id: reg.id,
            nome: reg.disciplina,
            status: reg.mediaFinal >= 7 ? "Concluído" : "Em andamento",
            media: reg.mediaFinal || reg.media || 0,
            estagioNota: reg.estagioNota || 0,
            notaProva: reg.notaProva || 0,
            notaTeste: reg.notaTeste || 0,
            notaTrabalho: reg.notaTrabalho || 0,
            faltas: reg.faltas || 0,
            totalAulas: reg.totalAulas || 0, // Garantindo que totalAulas seja carregado
            faltaData: reg.faltaData || [],
            faltaMotivo: reg.faltaMotivo || []
          }));

          setDisciplinasCursadas(disciplinasFormatadas);
          return;
        }
      }

      console.warn("Nenhuma disciplina encontrada para o aluno");
      setDisciplinasCursadas([]);

    } catch (error) {
      console.error("Erro ao buscar disciplinas cursadas:", error);
      setDisciplinasCursadas([]);
    }
  };

  // Função para calcular presença
  const calcularPresenca = (faltas, totalAulas) => {
    if (!totalAulas || totalAulas === 0) return { valor: 100, abaixoMinimo: false };

    // Conta o número de faltas válidas (com data preenchida)
    const numeroFaltas = Array.isArray(faltas)
      ? faltas.filter(f => f && f.data && f.data.trim() !== '').length
      : (typeof faltas === 'number' ? faltas : 0);

    const presenca = ((totalAulas - numeroFaltas) / totalAulas) * 100;
    return {
      valor: Math.max(0, Math.min(100, presenca.toFixed(2))), // Garante valor entre 0 e 100
      abaixoMinimo: presenca < 70,
      faltas: numeroFaltas
    };
  };

  // Função para validar notas
  const validarNota = (nota) => {
    const numNota = parseFloat(nota);
    return !isNaN(numNota) && numNota >= 0 && numNota <= 10;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Para campos numéricos, converter para número
    if (['notaProva', 'notaTrabalho', 'notaTeste', 'estagioNota', 'faltas', 'totalAulas'].includes(name)) {
      // Permitir campo vazio para totalAulas
      if (name === 'totalAulas' && value === '') {
        setFormData(prev => ({
          ...prev,
          [name]: ''
        }));
        return;
      }

      // Limita a 1 casa decimal para notas
      let numValue = value === '' ? 0 : Number(value);

      // Se for uma nota, validar e limitar entre 0 e 10
      if (['notaProva', 'notaTrabalho', 'notaTeste', 'estagioNota'].includes(name)) {
        numValue = Math.min(10, Math.max(0, numValue));
      }

      // Para totalAulas, garantir valor positivo
      if (name === 'totalAulas') {
        numValue = Math.max(1, numValue);
      }

      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      // Para campos de texto
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Validar notas antes de calcular a média
      const notas = [
        { nome: 'Prova', valor: formData.notaProva },
        { nome: 'Trabalho', valor: formData.notaTrabalho },
        { nome: 'Teste', valor: formData.notaTeste },
        { nome: 'Estágio', valor: formData.estagioNota }
      ];

      const notasInvalidas = notas.filter(n => !validarNota(n.valor));
      if (notasInvalidas.length > 0) {
        alert(`Por favor, verifique as seguintes notas (devem estar entre 0 e 10):\n${notasInvalidas.map(n => n.nome).join(', ')}`);
        return;
      }

      // Cálculo da média apenas com as notas preenchidas
      const notasPreenchidas = notas.filter(n => n.valor > 0);
      const media = notasPreenchidas.length > 0 
        ? notasPreenchidas.reduce((acc, n) => acc + parseFloat(n.valor), 0) / notasPreenchidas.length 
        : 0;

      // Filtrar apenas as faltas que têm data e motivo preenchidos
      const faltasValidas = faltas.filter(f => f.data && f.motivo);
      
      // Validar datas das faltas
      const dataAtual = new Date();
      const faltasInvalidas = faltasValidas.filter(f => {
        const dataFalta = new Date(f.data);
        return dataFalta > dataAtual;
      });

      if (faltasInvalidas.length > 0) {
        alert('Não é possível registrar faltas para datas futuras!');
        return;
      }

      // Arrays de faltas
      const faltaDataArray = faltasValidas.map(f => f.data);
      const faltaMotivoArray = faltasValidas.map(f => f.motivo);

      // Dados a serem enviados para a API
      const dadosAtualizados = {
        faltaData: faltaDataArray,
        faltaMotivo: faltaMotivoArray,
        notaTeste: parseFloat(formData.notaTeste) || 0,
        testeData: formData.testeData || new Date().toISOString().slice(0, 10),
        testeDescricao: formData.testeDescricao || "",
        notaProva: parseFloat(formData.notaProva) || 0,
        provaData: formData.provaData || new Date().toISOString().slice(0, 10),
        provaDescricao: formData.provaDescricao || "",
        notaTrabalho: parseFloat(formData.notaTrabalho) || 0,
        trabalhoData: formData.trabalhoData || new Date().toISOString().slice(0, 10),
        trabalhoDescricao: formData.trabalhoDescricao || "",
        estagioNota: parseFloat(formData.estagioNota) || 0,
        estagioData: formData.estagioData || new Date().toISOString().slice(0, 10),
        estagioDescricao: formData.estagioDescricao || "",
        totalAulas: parseInt(formData.totalAulas) || 0,
        media: media,
        faltas: faltaDataArray.length
      };


      try {
        // Primeiro, atualizar o registro com arrays vazios para limpar as faltas
        const dadosLimpos = {
          ...dadosAtualizados,
          faltaData: [],
          faltaMotivo: [],
          faltas: 0
        };

        // Enviar dados limpos primeiro
        await api.put(`/registroacademico/edit/${registroAtualId}`, dadosLimpos);
        
        // Aguardar um momento para garantir que a limpeza foi processada
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Depois, enviar os novos dados com as faltas atualizadas
        const response = await api.put(`/registroacademico/edit/${registroAtualId}`, dadosAtualizados);

        // Atualizar o estado local com os novos dados
        setDisciplinaAtual(prev => ({
          ...prev,
          ...dadosAtualizados,
          media: response.data.registro?.media || media,
          faltaData: faltaDataArray,
          faltaMotivo: faltaMotivoArray
        }));

        // Se o registro atual for o mesmo que foi carregado inicialmente
        if (registroAtualId === id) {
          setRegistroAluno(prev => ({
            ...prev,
            ...dadosAtualizados,
            media: response.data.registro?.media || media,
            faltaData: faltaDataArray,
            faltaMotivo: faltaMotivoArray
          }));
        }

        // Atualizar a disciplina na lista de disciplinas cursadas
        setDisciplinasCursadas(prev =>
          prev.map(disc => {
            if (disc.id === registroAtualId) {
              return {
                ...disc,
                notaProva: parseFloat(formData.notaProva) || 0,
                notaTeste: parseFloat(formData.notaTeste) || 0,
                notaTrabalho: parseFloat(formData.notaTrabalho) || 0,
                estagioNota: parseFloat(formData.estagioNota) || 0,
                faltas: faltaDataArray.length,
                totalAulas: parseInt(formData.totalAulas) || 0,
                media: response.data.registro?.media || media,
                status: (response.data.registro?.media || media) >= 7 ? "Concluído" : "Em andamento",
                faltaData: faltaDataArray,
                faltaMotivo: faltaMotivoArray
              };
            }
            return disc;
          })
        );

        // Fechar o modo de edição
        setIsEditing(false);
        
        // Atualizar todos os dados do servidor
        await fetchDisciplinasCursadas();
        
        alert("Registro acadêmico atualizado com sucesso!");
      } catch (apiError) {

        if (apiError.response) {
          let mensagemErro = "Erro ao atualizar registro acadêmico";

          if (apiError.response.data) {
            if (apiError.response.data.error) {
              if (Array.isArray(apiError.response.data.error)) {
                mensagemErro = apiError.response.data.error.join(", ");
              } else {
                mensagemErro = apiError.response.data.error;
              }
            } else if (apiError.response.data.message) {
              mensagemErro = apiError.response.data.message;
            }
          }

          alert(`Erro: ${mensagemErro}`);
        } else {
          alert("Erro ao conectar com o servidor. Verifique sua conexão.");
        }
      }
    } catch (error) {
      alert("Erro ao salvar alterações. Tente novamente.", error);
    }
  };

  // Função para adicionar uma nova disciplina
  const handleAddDisciplina = async () => {
    if (!disciplinaSelecionada) {
      alert("Por favor, selecione uma disciplina");
      return;
    }

    try {
      // Extrair o ID da disciplina e garantir que é um número
      const disciplinaId = typeof disciplinaSelecionada === 'string'
        ? parseInt(disciplinaSelecionada, 10)
        : disciplinaSelecionada;

      const disciplina = todasDisciplinas.find(d => d.id === disciplinaId);

      if (!disciplina) {
        console.error("Disciplina não encontrada com ID:", disciplinaId);
        alert("Erro: Disciplina não encontrada");
        return;
      }

      // Verificar se a disciplina já está cursada
      const disciplinaJaCursada = disciplinasCursadas.some(d => d.nome === disciplina.nome);
      if (disciplinaJaCursada) {
        alert("Esta disciplina já está cursada!");
        return;
      }

      // Usar o ID do aluno armazenado no estado alunoInfo
      const alunoId = alunoInfo.id || registroAluno.alunoId || id;


      // Usar o ID do curso armazenado no estado alunoInfo
      const cursoId = alunoInfo.cursoId || registroAluno.cursoId || 1;


      // Data atual no formato correto para o banco de dados
      const dataAtual = new Date().toISOString().slice(0, 10);

      // Criar novo registro acadêmico para a disciplina
      const novoRegistro = {
        alunoId: parseInt(alunoId, 10),
        disciplinaId: disciplinaId,
        cursoId: parseInt(cursoId, 10),
        faltaData: [],
        faltaMotivo: [],
        testeData: dataAtual,
        testeDescricao: "Teste inicial",
        notaTeste: 0,
        provaData: dataAtual,
        provaDescricao: "Prova inicial",
        notaProva: 0,
        trabalhoData: dataAtual,
        trabalhoDescricao: "Trabalho inicial",
        notaTrabalho: 0,
        estagioData: dataAtual,
        estagioDescricao: "Estágio inicial",
        estagioNota: 0,
        totalAulas: disciplina.carga_horaria || 20,
        media: 0,
        faltas: 0
      };

      try {
        const response = await api.post('/registroacademico/create', novoRegistro);

        const novoItem = response.data.novoRegistro || {
          id: new Date().getTime(),
          notaTeste: 0,
          notaProva: 0,
          notaTrabalho: 0,
          estagioNota: 0,
          media: 0
        };

        const novaDisciplina = {
          id: novoItem.id,
          nome: disciplina.nome,
          status: "Em andamento",
          media: 0,
          estagioNota: 0,
          notaProva: 0,
          notaTeste: 0,
          notaTrabalho: 0,
          faltas: 0,
          totalAulas: disciplina.carga_horaria || 20,
          faltaData: [],
          faltaMotivo: []
        };

        setDisciplinasCursadas(prevDisciplinas => [...prevDisciplinas, novaDisciplina]);

        setAdicionandoDisciplina(false);
        setDisciplinaSelecionada("");
        alert("Disciplina adicionada com sucesso!");

        await fetchDisciplinasCursadas();
      } catch (apiError) {
        console.error(`Erro ao adicionar disciplina no servidor:`, apiError);

        if (apiError.response) {
          let mensagemErro = "Erro ao adicionar disciplina no servidor";

          if (apiError.response.data) {
            if (apiError.response.data.error) {
              if (Array.isArray(apiError.response.data.error)) {
                mensagemErro = apiError.response.data.error.join(", ");
              } else {
                mensagemErro = apiError.response.data.error;
              }
            } else if (apiError.response.data.message) {
              mensagemErro = apiError.response.data.message;
            }
          }

          alert(`Erro: ${mensagemErro}`);
        } else {
          alert("Erro ao conectar com o servidor. Verifique sua conexão.");
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar disciplina:", error);
      alert("Erro ao adicionar disciplina. Tente novamente.");
    }
  };

  // Se o usuário clicar no botão de Adicionar Nova Disciplina, buscaremos as disciplinas novamente
  const handleOpenAddDisciplina = async () => {
    try {
      if (!adicionandoDisciplina) {
        setLoadingDisciplinas(true);
        setErrorMsg("");
        await fetchTodasDisciplinas();
      }
      setAdicionandoDisciplina(!adicionandoDisciplina);
    } catch (error) {
      console.error("Erro ao abrir formulário de adicionar disciplina:", error);
      setErrorMsg("Erro ao carregar disciplinas. Tente novamente.");
      setLoadingDisciplinas(false);
    }
  };

  const presenca = calcularPresenca(faltas, formData.totalAulas);

  // Função para selecionar uma disciplina para edição
  const selecionarDisciplinaParaEdicao = (disciplina) => {

    // Armazenar o ID do registro acadêmico sendo editado
    setRegistroAtualId(disciplina.id);

    // Definir a disciplina atual como a selecionada
    setDisciplinaAtual({
      id: disciplina.id, // Importante armazenar o ID
      nome: disciplina.nome,
      notaProva: disciplina.notaProva !== undefined ? disciplina.notaProva : 0,
      notaTrabalho: disciplina.notaTrabalho !== undefined ? disciplina.notaTrabalho : 0,
      notaTeste: disciplina.notaTeste !== undefined ? disciplina.notaTeste : 0,
      estagioNota: disciplina.estagioNota !== undefined ? disciplina.estagioNota : 0,
      media: disciplina.media !== undefined ? disciplina.media : 0,
      faltas: disciplina.faltas !== undefined ? disciplina.faltas : 0,
      totalAulas: disciplina.totalAulas || disciplina.carga_horaria || 20
    });

    // Atualizar o formulário com os dados da disciplina selecionada
    setFormData({
      notaProva: disciplina.notaProva !== undefined ? disciplina.notaProva : 0,
      notaTrabalho: disciplina.notaTrabalho !== undefined ? disciplina.notaTrabalho : 0,
      notaTeste: disciplina.notaTeste !== undefined ? disciplina.notaTeste : 0,
      estagioNota: disciplina.estagioNota !== undefined ? disciplina.estagioNota : 0,
      faltas: disciplina.faltas !== undefined ? disciplina.faltas : 0,
      totalAulas: disciplina.totalAulas || disciplina.carga_horaria || 20,
      faltaMotivo: disciplina.faltaMotivo || ""
    });

    // Ajustar a visualização para mostrar a disciplina selecionada
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Iniciar o modo de edição
    setIsEditing(true);
  };

  if (loading) {
    return (
      <div className="detalhes-container loading-container">
        <h2>Carregando dados do aluno...</h2>
      </div>
    );
  }
  

  return (
    <div className="detalhes-container">
      <VoltarButton url="/alunos" />
      <div className="detalhes-header">
        <div className="aluno-info">
          <h2 className="aluno-nome">{alunoInfo.nome}</h2>
          <p className="curso-nome">Curso: {alunoInfo.curso}</p>
        </div>
        <Button
          variant="contained"
          color={isEditing ? "success" : "primary"}
          onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
        >
          {isEditing ? "Salvar" : "Editar"}
        </Button>
      </div>

      {/* Nova seção de mensalidades */}
      <div className="mensalidades-section">
        <h2>Mensalidades</h2>
        <div className="mensalidades-grid">
          {loadingMensalidades ? (
            <div className="loading-container">
              <CircularProgress />
              <p>Carregando mensalidades...</p>
            </div>
          ) : mensalidades && mensalidades.length > 0 ? (
            mensalidades.map((mensalidade) => (
              <div key={mensalidade.id} className="mensalidade-card">
                <div className="mensalidade-header">
                  <h3>{new Date(mensalidade.mes_referencia).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
                </div>
                <div className="mensalidade-content">
                  <p><strong>Valor:</strong> R$ {parseFloat(mensalidade.valor).toFixed(2)}</p>
                  <p><strong>Data do Pagamento:</strong> {new Date(mensalidade.data_pagamento).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
                  <p><strong>Recebido por:</strong> {mensalidade.recebido_por}</p>
                  {mensalidade.observacao && (
                    <p className="mensalidade-observacao"><strong>Observação:</strong> {mensalidade.observacao}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Nenhuma mensalidade registrada.</p>
          )}
        </div>
      </div>

      {/* Seção de disciplina atual */}
      {disciplinasCursadas.length > 0 ? (
        <div className="disciplina-atual-section">
          <h2>Disciplina Atual</h2>
          <div className="disciplina-atual-card">
            <div className="disciplina-header">
              <h3>{disciplinaAtual.nome}</h3>
              <StarIcon sx={{ color: "#FFD700" }} />
            </div>

            {isEditing ? (
              <div className="notas-edit-form">
                <TextField
                  label="Nota Prova"
                  type="number"
                  name="notaProva"
                  value={formData.notaProva === 0 ? '' : formData.notaProva}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: { min: 0, max: 10, step: 0.1 },
                  }}
                  margin="normal"
                  size="small"
                />
                <TextField
                  label="Nota Teste"
                  type="number"
                  name="notaTeste"
                  value={formData.notaTeste === 0 ? '' : formData.notaTeste}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
                  margin="normal"
                  size="small"
                />
                <TextField
                  label="Nota Trabalho"
                  type="number"
                  name="notaTrabalho"
                  value={formData.notaTrabalho === 0 ? '' : formData.notaTrabalho}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
                  margin="normal"
                  size="small"
                />
                <TextField
                  label="Nota Estágio"
                  type="number"
                  name="estagioNota"
                  value={formData.estagioNota === 0 ? '' : formData.estagioNota}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
                  margin="normal"
                  size="small"
                />
                <TextField
                  label="Faltas"
                  type="number"
                  name="faltas"
                  value={formData.faltas === 0 ? '' : formData.faltas}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0, max: formData.totalAulas, step: 1 } }}
                  margin="normal"
                  size="small"
                />
                <TextField
                  label="Total de Aulas"
                  type="number"
                  name="totalAulas"
                  value={formData.totalAulas === 0 ? '' : formData.totalAulas}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 1 } }}
                  margin="normal"
                  size="small"
                />
                {/* Formulário de faltas */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const novasFaltas = [...faltas];
                    const ultimaFalta = novasFaltas[novasFaltas.length - 1];
                    
                    if (ultimaFalta.data && ultimaFalta.motivo) {
                      const faltasAnteriores = novasFaltas.slice(0, -1);
                      const faltaExistente = faltasAnteriores.find(f => f.data === ultimaFalta.data);
                      
                      if (!faltaExistente) {
                        setFaltas([...novasFaltas, { data: '', motivo: '' }]);
                      } else {
                        alert('Já existe uma falta registrada para esta data!');
                      }
                    } else {
                      alert('Por favor, preencha a data e o motivo da falta!');
                    }
                  }}
                  className="faltas-form"
                >
                  <label className="faltas-label">Faltas (Data e Motivo):</label>
                  {faltas.map((falta, idx) => (
                    <div key={idx} className="falta-item">
                      <input
                        type="date"
                        value={falta.data}
                        onChange={e => {
                          const novas = [...faltas];
                          novas[idx].data = e.target.value;
                          setFaltas(novas);
                        }}
                        className="falta-data"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Motivo"
                        value={falta.motivo}
                        onChange={e => {
                          const novas = [...faltas];
                          novas[idx].motivo = e.target.value;
                          setFaltas(novas);
                        }}
                        className="falta-motivo"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (faltas.length === 1) {
                            setFaltas([{ data: '', motivo: '' }]);
                          } else {
                            const novasFaltas = faltas.filter((_, i) => i !== idx);
                            setFaltas(novasFaltas);
                          }
                        }}
                        className="delete-button"
                      >
                        <img src={Delete} alt="Deletar" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="edit-btn add-falta-btn"
                  >
                    Adicionar Falta
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="notas-section">
                  <h3>Notas</h3>
                  <div className="notas-grid">
                    <div className="notas-card">
                      <h4>Provas</h4>
                      <p>{typeof disciplinaAtual.notaProva === 'number' ? disciplinaAtual.notaProva.toFixed(1) : "N/A"}</p>
                    </div>

                    <div className="notas-card">
                      <h4>Testes</h4>
                      <p>{typeof disciplinaAtual.notaTeste === 'number' ? disciplinaAtual.notaTeste.toFixed(1) : "N/A"}</p>
                    </div>

                    <div className="notas-card">
                      <h4>Trabalhos</h4>
                      <p>{typeof disciplinaAtual.notaTrabalho === 'number' ? disciplinaAtual.notaTrabalho.toFixed(1) : "N/A"}</p>
                    </div>

                    <div className="notas-card">
                      <h4>Estágio</h4>
                      <p>{typeof disciplinaAtual.estagioNota === 'number' ? disciplinaAtual.estagioNota.toFixed(1) : "N/A"}</p>
                    </div>
                  </div>

                  <div className="media-final">
                    <h4 className={typeof disciplinaAtual.media === 'number' && disciplinaAtual.media < 6 ? 'nota-baixa' : ''}>
                      Média Atual: {typeof disciplinaAtual.media === 'number' ? disciplinaAtual.media.toFixed(2) : "N/A"}
                    </h4>
                  </div>
                </div>

                <div className="presenca-section">
                  <h3>Presenças e Faltas</h3>
                  <div className="presenca-info">
                    <p>Total de Aulas: {formData.totalAulas}</p>
                    <p>Faltas: {(faltas && faltas.length && faltas[0].data) ? faltas.length : 0}</p>
                    {(faltas && faltas.length && faltas[0].data) ? (
                      <ul className="faltas-lista">
                        {faltas.map((falta, idx) => (
                          <li key={idx} className="falta-item-lista">
                            <span className="falta-arrow">&rarr;</span>
                            <b>{falta.data ? new Date(falta.data).toLocaleDateString() : ''}</b> - {falta.motivo}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Nenhuma falta registrada</p>
                    )}
                    <p className={presenca.abaixoMinimo ? "alerta" : ""}>
                      Presença: {presenca.valor}%
                      {presenca.abaixoMinimo && " - Abaixo do mínimo de 70%"}
                    </p>
                    {presenca.abaixoMinimo && (
                      <p className="alerta">
                        Faltam {Math.ceil(formData.totalAulas * 0.7 - (formData.totalAulas - formData.faltas))}
                        presenças para atingir o mínimo de 70%
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="adicionar-disciplina-section">
          <div className="add-disciplina-header">
            <h2>Adicionar Primeira Disciplina</h2>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenAddDisciplina}
            >
              Adicionar Disciplina
            </Button>
          </div>
        </div>
      )}

      {/* Seção de adicionar disciplina */}
      <div className="adicionar-disciplina-section">
        <div className="add-disciplina-header">
          <h2>Adicionar Disciplina</h2>
          <Button
            variant="contained"
            color={adicionandoDisciplina ? "error" : "primary"}
            onClick={handleOpenAddDisciplina}
          >
            {adicionandoDisciplina ? "Cancelar" : "Adicionar Nova Disciplina"}
          </Button>
        </div>

        {adicionandoDisciplina && (
          <div className="add-disciplina-form">
            <p>Total de disciplinas disponíveis: {todasDisciplinas.length}</p>

            {loadingDisciplinas ? (
              <div className="loading-disciplinas">
                <CircularProgress size={30} />
                <p>Carregando disciplinas...</p>
              </div>
            ) : (
              <>
                {errorMsg && (
                  <div className="disciplina-info">
                    <p className="alerta">{errorMsg}</p>
                  </div>
                )}

                <div className="disciplina-reload">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={fetchTodasDisciplinas}
                    startIcon={<span className="reload-icon">↻</span>}
                    sx={{ mb: 2 }}
                  >
                    Recarregar Disciplinas
                  </Button>
                </div>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="disciplina-select-label">Disciplina</InputLabel>
                  <Select
                    labelId="disciplina-select-label"
                    value={disciplinaSelecionada}
                    label="Disciplina"
                    onChange={(e) => {
                      setDisciplinaSelecionada(e.target.value);
                    }}
                  >
                    {todasDisciplinas.length > 0 ? (
                      todasDisciplinas.map(disciplina => (
                        <MenuItem key={disciplina.id} value={disciplina.id}>
                          {disciplina.nome} - {disciplina.modulo || 'Módulo não definido'}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        Nenhuma disciplina disponível
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>

                <div className="disciplina-info">
                  {todasDisciplinas.length === 0 && (
                    <p className="alerta">Nenhuma disciplina encontrada. Verifique se existem disciplinas cadastradas.</p>
                  )}
                </div>

                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddDisciplina}
                  disabled={!disciplinaSelecionada}
                  sx={{ mt: 2 }}
                >
                  Adicionar Disciplina
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Seção de disciplinas cursadas */}
      <div className="disciplinas-section">
        <h2>Disciplinas Cursadas</h2>
        <div className="disciplinas-grid">
          {disciplinasCursadas.length > 0 ? (
            disciplinasCursadas.map(disciplina => {
              const notas = [disciplina.notaProva, disciplina.notaTeste, disciplina.notaTrabalho, disciplina.estagioNota].filter(n => n !== null && n !== undefined && n !== '' && !isNaN(n));
              const media = notas.length > 0 ? (notas.reduce((acc, n) => acc + parseFloat(n), 0) / notas.length) : null;

              const totalAulas = disciplina.id === registroAtualId ? formData.totalAulas : (disciplina.totalAulas || 0);
              const faltasQtd = Array.isArray(disciplina.faltaData) && disciplina.faltaData.length > 0
                ? disciplina.faltaData.filter(f => f).length
                : (typeof disciplina.faltas === 'number' ? disciplina.faltas : 0);

              const presenca = calcularPresenca(faltasQtd, totalAulas);

              return (
                <div
                  key={disciplina.id}
                  className="disciplina-card"
                  onClick={() => selecionarDisciplinaParaEdicao(disciplina)}
                >
                  <div className="disciplina-icon">
                    <h3>{disciplina.nome}</h3>
                  </div>
                  <div className="disciplina-card-content-p">
                    <p>Status: {disciplina.status}</p>
                    <p>Média: {media !== null ? media.toFixed(2) : 'N/A'}</p>
                    <p>Estágio: {disciplina.estagioNota !== undefined && disciplina.estagioNota !== null ? disciplina.estagioNota.toFixed(1) : "N/A"}</p>
                    <div className="disciplina-notas-grid">
                      {disciplina.notaProva !== undefined && disciplina.notaProva !== null && disciplina.notaProva !== '' && (
                        <span>
                          P: {disciplina.notaProva.toFixed(1)}
                        </span>
                      )}
                      {disciplina.notaTeste !== undefined && disciplina.notaTeste !== null && disciplina.notaTeste !== '' && (
                        <span>
                          T: {disciplina.notaTeste.toFixed(1)}
                        </span>
                      )}
                      {disciplina.notaTrabalho !== undefined && disciplina.notaTrabalho !== null && disciplina.notaTrabalho !== '' && (
                        <span>
                          Tr: {disciplina.notaTrabalho.toFixed(1)}
                        </span>
                      )}
                      {(!disciplina.notaProva || disciplina.notaProva === '') && 
                       (!disciplina.notaTeste || disciplina.notaTeste === '') && 
                       (!disciplina.notaTrabalho || disciplina.notaTrabalho === '') && (
                        <span className="nota-nao-aplicada">N/A</span>
                      )}
                    </div>
                    <p className={`disciplina-presenca ${presenca.abaixoMinimo ? 'alerta' : ''}`}>
                      Presença: {presenca.valor}%
                      {presenca.abaixoMinimo && " - Abaixo do mínimo"}
                      <span className="disciplina-faltas">(Faltas: {faltasQtd}/{totalAulas})</span>
                    </p>
                    {presenca.abaixoMinimo && (
                      <p className="alerta">
                        Faltam {Math.ceil(totalAulas * 0.7 - (totalAulas - faltasQtd))} presenças para atingir o mínimo de 70%
                      </p>
                    )}
                    <div className="disciplina-card-footer">
                      <span className="clique-para-editar">Clique para editar</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Nenhuma disciplina cursada encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalhesAluno;
