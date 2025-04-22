import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import "./DetalhesAlunos.css";

import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import { TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress } from "@mui/material";

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
    totalAulas: 20
  });
  const [loading, setLoading] = useState(true);
  // Novas variáveis para a lista de disciplinas
  const [todasDisciplinas, setTodasDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [adicionandoDisciplina, setAdicionandoDisciplina] = useState(false);
  const [loadingDisciplinas, setLoadingDisciplinas] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
        console.log(`Tentando buscar disciplinas no endpoint: ${endpoint}`);
        const response = await api.get(endpoint);
        
        if (response.data) {
          console.log(`Resposta do endpoint ${endpoint}:`, response.data);
          
          // Verificar o formato dos dados
          const disciplinas = Array.isArray(response.data) ? response.data : 
                             (response.data.data && Array.isArray(response.data.data)) ? response.data.data : [];
          
          if (disciplinas.length > 0) {
            console.log("Disciplinas encontradas:", disciplinas.length);
            console.log("Amostra:", disciplinas[0]);
            setTodasDisciplinas(disciplinas);
            setLoadingDisciplinas(false);
            return disciplinas;
          } else {
            console.warn(`Endpoint ${endpoint} retornou array vazio`);
          }
        }
      } catch (error) {
        console.error(`Erro ao tentar endpoint ${endpoint}:`, error);
      }
    }
    
    // Se chegou aqui, vamos tentar um mock de dados como último recurso
    console.warn("Todos os endpoints falharam, usando dados de fallback");
    const disciplinasMock = [
      { id: 1, nome: "Anatomia Humana", modulo: "Modulo 1" },
      { id: 2, nome: "Fisiologia", modulo: "Modulo 1" },
      { id: 3, nome: "Bioquímica", modulo: "Modulo 2" },
      { id: 4, nome: "Farmacologia", modulo: "Modulo 2" },
      { id: 5, nome: "Enfermagem Cirúrgica", modulo: "Modulo 3" },
      { id: 6, nome: "Atendimento de Emergência", modulo: "Modulo 3" },
    ];
    
    setTodasDisciplinas(disciplinasMock);
    setErrorMsg("Não foi possível carregar as disciplinas do servidor. Usando dados de exemplo.");
    setLoadingDisciplinas(false);
    return disciplinasMock;
  };

  useEffect(() => {
    const fetchDetalhesAluno = async () => {
      try {
        setLoading(true);
        console.log("Buscando registro acadêmico com ID:", id);
        const response = await api.get(`/registroacademico/${id}`);
        console.log("Dados recebidos:", response.data);

        if (response.data) {
          setRegistroAluno(response.data);
          
          // Buscar informações do aluno, similar ao do boletim
          try {
            const alunoId = response.data.alunoId || id; // Usar o ID do aluno ou o ID do registro
            console.log("Buscando aluno com ID:", alunoId);
            const alunoResponse = await api.get(`/alunos/${alunoId}`);
            console.log("Dados do aluno:", alunoResponse.data);
            
            if (alunoResponse.data) {
              setAlunoInfo({
                id: alunoResponse.data.id || alunoId, // Armazenar o ID do aluno explicitamente
                nome: alunoResponse.data.nome || response.data.aluno,
                curso: alunoResponse.data.curso?.nome || response.data.curso || "Não informado",
                cursoId: alunoResponse.data.cursoId || response.data.cursoId || 1, // Armazenar o ID do curso
                turma: alunoResponse.data.turno || response.data.turma || "Não informada"
              });
            }
          } catch (error) {
            console.error("Erro ao buscar dados do aluno:", error);
            // Usar os dados do registro acadêmico como fallback
            setAlunoInfo({
              id: response.data.alunoId || id,
              nome: response.data.aluno || "Aluno não identificado",
              curso: response.data.curso || "Não informado",
              cursoId: response.data.cursoId || 1,
              turma: response.data.turma || "Não informada"
            });
          }
          
          // Buscar disciplinas cursadas pelo aluno - usando a listagem geral
          await fetchDisciplinasCursadas();
          
          // Define a disciplina atual como a do registro acadêmico atual
          setDisciplinaAtual({
            nome: response.data.disciplina,
            notaProva: response.data.notaProva || 0,
            notaTrabalho: response.data.notaTrabalho || 0,
            notaTeste: response.data.notaTeste || 0,
            estagioNota: response.data.estagioNota || 0,
            media: response.data.media || 0,
            faltaData: response.data.faltaData,
            faltaMotivo: response.data.faltaMotivo
          });
          
          // Inicializa o formulário com os dados atuais
          setFormData({
            notaProva: response.data.notaProva || 0,
            notaTrabalho: response.data.notaTrabalho || 0,
            notaTeste: response.data.notaTeste || 0,
            estagioNota: response.data.estagioNota || 0,
            faltas: response.data.faltas || 0,
            totalAulas: response.data.totalAulas || 20,
            faltaMotivo: response.data.faltaMotivo || ""
          });
        }
        
      } catch (error) {
        console.error("Erro ao buscar detalhes do aluno:", error);
      } finally {
        // Buscar todas as disciplinas disponíveis - Agora usando a função específica
        console.log("Iniciando busca de disciplinas...");
        const disciplinas = await fetchTodasDisciplinas();
        console.log("Disciplinas carregadas no useEffect:", disciplinas);
        setLoading(false);
      }
    };

    fetchDetalhesAluno();
  }, [id]);

  // Nova função para buscar todas as disciplinas cursadas pelo aluno
  const fetchDisciplinasCursadas = async () => {
    try {
      // Tentativa 1: Buscar do endpoint específico de aluno (se existir)
      try {
        const alunoId = alunoInfo.id || registroAluno.alunoId || id;
        console.log("Buscando disciplinas cursadas pelo aluno ID:", alunoId);
        const disciplinasResponse = await api.get(`/registroacademico/aluno/${alunoId}`);
        
        if (disciplinasResponse.data && Array.isArray(disciplinasResponse.data) && disciplinasResponse.data.length > 0) {
          console.log("Disciplinas cursadas encontradas via endpoint específico:", disciplinasResponse.data);
          setDisciplinasCursadas(disciplinasResponse.data.map(disc => ({
            id: disc.id,
            nome: disc.disciplina,
            status: disc.mediaFinal >= 7 ? "Concluído" : "Em andamento",
            media: disc.mediaFinal || disc.media || 0,
            estagioNota: disc.estagioNota || 0,
            notaProva: disc.notaProva || 0,
            notaTeste: disc.notaTeste || 0,
            notaTrabalho: disc.notaTrabalho || 0,
            faltas: disc.faltas || 0,
            totalAulas: disc.totalAulas || 20
          })));
          return;
        }
      } catch (endpointError) {
        console.warn("Endpoint específico de aluno falhou, tentando alternativa:", endpointError);
      }
      
      // Tentativa 2: Buscar da listagem completa e filtrar
      const registrosResponse = await api.get('/registroacademico');
      console.log("Todos os registros acadêmicos:", registrosResponse.data);
      
      if (registrosResponse.data && Array.isArray(registrosResponse.data)) {
        // Filtrar registros pelo nome do aluno (caso o ID não seja confiável)
        const alunoNome = alunoInfo.nome;
        const registrosDoAluno = registrosResponse.data.filter(reg => 
          (reg.aluno && reg.aluno.toLowerCase().includes(alunoNome.toLowerCase())) ||
          (reg.alunoId && reg.alunoId === alunoInfo.id)
        );
        
        console.log("Registros filtrados para o aluno:", registrosDoAluno);
        
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
            totalAulas: reg.totalAulas || 20
          }));
          
          console.log("Disciplinas cursadas formatadas:", disciplinasFormatadas);
          setDisciplinasCursadas(disciplinasFormatadas);
          return;
        }
      }
      
      // Fallback para dados simulados se nada funcionar
      console.warn("Nenhuma disciplina encontrada, usando fallback");
      setDisciplinasCursadas([
        { id: 1, nome: "Anatomia", status: "Concluído", media: 8.5, estagioNota: 9.0, notaProva: 8.0, notaTeste: 8.5, notaTrabalho: 8.5, faltas: 2, totalAulas: 20 },
        { id: 2, nome: "Bioquímica", status: "Concluído", media: 7.8, estagioNota: 8.0, notaProva: 7.5, notaTeste: 7.0, notaTrabalho: 8.5, faltas: 4, totalAulas: 20 },
        { id: 3, nome: registroAluno.disciplina, status: "Em andamento", media: registroAluno.media || 0, estagioNota: registroAluno.estagioNota || 0, notaProva: registroAluno.notaProva || 0, notaTeste: registroAluno.notaTeste || 0, notaTrabalho: registroAluno.notaTrabalho || 0, faltas: registroAluno.faltas || 0, totalAulas: registroAluno.totalAulas || 20 }
      ]);
      
    } catch (error) {
      console.error("Erro ao buscar disciplinas cursadas:", error);
      // Usar dados simulados como fallback
      setDisciplinasCursadas([
        { id: 1, nome: "Anatomia", status: "Concluído", media: 8.5, estagioNota: 9.0, notaProva: 8.0, notaTeste: 8.5, notaTrabalho: 8.5, faltas: 2, totalAulas: 20 },
        { id: 2, nome: "Bioquímica", status: "Concluído", media: 7.8, estagioNota: 8.0, notaProva: 7.5, notaTeste: 7.0, notaTrabalho: 8.5, faltas: 4, totalAulas: 20 },
        { id: 3, nome: registroAluno.disciplina, status: "Em andamento", media: registroAluno.media || 0, estagioNota: registroAluno.estagioNota || 0, notaProva: registroAluno.notaProva || 0, notaTeste: registroAluno.notaTeste || 0, notaTrabalho: registroAluno.notaTrabalho || 0, faltas: registroAluno.faltas || 0, totalAulas: registroAluno.totalAulas || 20 }
      ]);
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

  const calcularPresenca = (faltas, totalAulas) => {
    if (totalAulas === 0) return { valor: 100, abaixoMinimo: false };
    const presenca = ((totalAulas - faltas) / totalAulas) * 100;
    return {
      valor: presenca.toFixed(2),
      abaixoMinimo: presenca < 70
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Para campos numéricos, converter para número (substitui o valor anterior)
    if (name === 'notaProva' || name === 'notaTrabalho' || name === 'notaTeste' || name === 'estagioNota' || name === 'faltas' || name === 'totalAulas') {
      // Limita a 1 casa decimal para notas
      let numValue = value === '' ? 0 : Number(value);
      
      // Se for uma nota, limitar entre 0 e 10
      if (name === 'notaProva' || name === 'notaTrabalho' || name === 'notaTeste' || name === 'estagioNota') {
        numValue = Math.min(10, Math.max(0, numValue));
      }
      
      setFormData({
        ...formData,
        [name]: numValue
      });
    } else {
      // Para campos de texto
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Cálculo da média com base nas notas atualizadas
      const media = (
        parseFloat(formData.notaProva) + 
        parseFloat(formData.notaTrabalho) + 
        parseFloat(formData.notaTeste) + 
        parseFloat(formData.estagioNota)
      ) / 4;

      // Dados a serem enviados para a API, seguindo o formato esperado pelo controller
      const dadosAtualizados = {
        faltaData: formData.faltaData || null,
        faltaMotivo: formData.faltaMotivo || "",
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
        estagioDescricao: formData.estagioDescricao || ""
        // A media será calculada no backend
      };

      console.log("Dados a serem enviados:", dadosAtualizados);
      console.log("Salvando alterações no registro ID:", registroAtualId);

      try {
        // Usando o ID correto do registro acadêmico que está sendo editado
        const response = await api.put(`/registroacademico/edit/${registroAtualId}`, dadosAtualizados);
        console.log("Resposta da atualização:", response.data);
        
        // Atualizar o estado local com os novos dados
        setDisciplinaAtual(prev => ({
          ...prev,
          ...dadosAtualizados,
          media: response.data.registro?.media || media
        }));
        
        // Se o registro atual for o mesmo que foi carregado inicialmente
        if (registroAtualId === id) {
          setRegistroAluno(prev => ({
            ...prev,
            ...dadosAtualizados,
            media: response.data.registro?.media || media
          }));
        }
        
        // Atualizar a disciplina na lista de disciplinas cursadas
        setDisciplinasCursadas(prev => 
          prev.map(disc => {
            if (disc.id === registroAtualId) {
              // Atualizar a disciplina com os novos dados
              return {
                ...disc,
                notaProva: parseFloat(formData.notaProva) || 0,
                notaTeste: parseFloat(formData.notaTeste) || 0,
                notaTrabalho: parseFloat(formData.notaTrabalho) || 0,
                estagioNota: parseFloat(formData.estagioNota) || 0,
                faltas: formData.faltas || 0,
                totalAulas: formData.totalAulas || 20,
                media: response.data.registro?.media || media,
                status: (response.data.registro?.media || media) >= 7 ? "Concluído" : "Em andamento"
              };
            }
            return disc;
          })
        );
        
        setIsEditing(false);
        alert("Registro acadêmico atualizado com sucesso!");
        
        // Opcionalmente, ainda podemos atualizar todos os dados do servidor
        // await fetchDisciplinasCursadas();
      } catch (apiError) {
        console.error("Erro na API:", apiError);
        
        if (apiError.response) {
          console.error("Resposta da API:", apiError.response.data);
          console.error("Status:", apiError.response.status);
          
          // Extrair a mensagem de erro mais específica
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
      console.error("Erro ao salvar alterações:", error);
      alert("Erro ao salvar alterações. Tente novamente.");
    }
  };

  // Função para adicionar uma nova disciplina
  const handleAddDisciplina = async () => {
    if (!disciplinaSelecionada) {
      alert("Por favor, selecione uma disciplina");
      return;
    }

    try {
      console.log("Todas disciplinas:", todasDisciplinas);
      console.log("Disciplina selecionada:", disciplinaSelecionada, "tipo:", typeof disciplinaSelecionada);
      
      // Extrair o ID da disciplina e garantir que é um número
      const disciplinaId = typeof disciplinaSelecionada === 'string' 
        ? parseInt(disciplinaSelecionada, 10) 
        : disciplinaSelecionada;
        
      const disciplina = todasDisciplinas.find(d => d.id === disciplinaId);
      console.log("Disciplina encontrada:", disciplina);
      
      if (!disciplina) {
        console.error("Disciplina não encontrada com ID:", disciplinaId);
        alert("Erro: Disciplina não encontrada");
        return;
      }
      
      // Usar o ID do aluno armazenado no estado alunoInfo
      const alunoId = alunoInfo.id || registroAluno.alunoId || id;
      console.log("ID do aluno para registro:", alunoId);
      
      // Usar o ID do curso armazenado no estado alunoInfo
      const cursoId = alunoInfo.cursoId || registroAluno.cursoId || 1;
      console.log("ID do curso para registro:", cursoId);
      
      // Data atual no formato correto para o banco de dados
      const dataAtual = new Date().toISOString().slice(0, 10);
      
      // Criar novo registro acadêmico para a disciplina - com todos os campos necessários
      // Seguindo exatamente o formato esperado pelo backend
      const novoRegistro = {
        alunoId: parseInt(alunoId, 10),
        disciplinaId: disciplinaId,
        cursoId: parseInt(cursoId, 10),
        // Campos opcionais abaixo
        faltaData: null,
        faltaMotivo: "",
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
        estagioNota: 0
        // A média será calculada no backend
      };

      console.log("Enviando novo registro:", novoRegistro);
      
      // Tenta enviar para a API com tratamento de erro mais detalhado
      try {
        // Corrigindo a rota para corresponder ao backend
        const response = await api.post('/registroacademico/create', novoRegistro);
        console.log("Disciplina adicionada:", response.data);
        
        // Verificar se a resposta contém o registro criado
        const novoItem = response.data.novoRegistro || {
          id: new Date().getTime(),
          notaTeste: 0,
          notaProva: 0,
          notaTrabalho: 0,
          estagioNota: 0,
          media: 0
        };
        
        // Adicionar a nova disciplina à lista local
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
          totalAulas: 20
        };
        
        console.log("Adicionando à lista local:", novaDisciplina);
        setDisciplinasCursadas(prevDisciplinas => [...prevDisciplinas, novaDisciplina]);
        
        setAdicionandoDisciplina(false);
        setDisciplinaSelecionada("");
        alert("Disciplina adicionada com sucesso!");
        
        // Atualizar a lista de disciplinas cursadas em vez de recarregar a página
        await fetchDisciplinasCursadas();
      } catch (apiError) {
        console.error("Erro na API:", apiError);
        
        if (apiError.response) {
          console.error("Resposta da API:", apiError.response.data);
          console.error("Status:", apiError.response.status);
          
          // Extrair a mensagem de erro mais específica
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
    console.log("Botão Adicionar Nova Disciplina clicado");
    
    if (!adicionandoDisciplina) {
      console.log("Iniciando busca de disciplinas no handleOpenAddDisciplina");
      await fetchTodasDisciplinas();
    } else {
      setLoadingDisciplinas(false);
    }
    
    setAdicionandoDisciplina(!adicionandoDisciplina);
  };

  const presenca = calcularPresenca(formData.faltas, formData.totalAulas);

  // Função para selecionar uma disciplina para edição
  const selecionarDisciplinaParaEdicao = (disciplina) => {
    console.log("Selecionando disciplina para edição:", disciplina);
    
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
      totalAulas: disciplina.totalAulas !== undefined ? disciplina.totalAulas : 20
    });
    
    // Atualizar o formulário com os dados da disciplina selecionada
    setFormData({
      notaProva: disciplina.notaProva !== undefined ? disciplina.notaProva : 0,
      notaTrabalho: disciplina.notaTrabalho !== undefined ? disciplina.notaTrabalho : 0,
      notaTeste: disciplina.notaTeste !== undefined ? disciplina.notaTeste : 0,
      estagioNota: disciplina.estagioNota !== undefined ? disciplina.estagioNota : 0,
      faltas: disciplina.faltas !== undefined ? disciplina.faltas : 0,
      totalAulas: disciplina.totalAulas !== undefined ? disciplina.totalAulas : 20,
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
      <div className="detalhes-header">
        <Link to="/registroacademico" className="voltar-btn">
          Voltar para lista
        </Link>
        <div className="aluno-info">
          <h1 title={alunoInfo.nome}>{alunoInfo.nome}</h1>
          <p className="curso-nome">Curso: {alunoInfo.curso}</p>
          <p className="curso-nome">Turma: {alunoInfo.turma}</p>
        </div>
        <Button 
          variant="contained" 
          color={isEditing ? "success" : "primary"}
          onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
        >
          {isEditing ? "Salvar" : "Editar"}
        </Button>
      </div>

      {/* Seção de disciplina atual */}
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
                InputProps={{ inputProps: { min: 0 } }}
                margin="normal"
                size="small"
              />
              <TextField
                label="Total de Aulas"
                type="number"
                name="totalAulas"
                value={formData.totalAulas}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 1 } }}
                margin="normal"
                size="small"
              />
              <TextField
                label="Motivo da Falta"
                name="faltaMotivo"
                value={formData.faltaMotivo || ""}
                onChange={handleInputChange}
                margin="normal"
                size="small"
                multiline
                rows={2}
                fullWidth
                className="motivo-falta-field"
              />
            </div>
          ) : (
            <>
              <div className="notas-section">
                <h3>Notas</h3>
                <div className="notas-grid">
                  <div className="notas-card">
                    <h4>Provas</h4>
                    <p>{disciplinaAtual.notaProva !== undefined && disciplinaAtual.notaProva !== null ? disciplinaAtual.notaProva.toFixed(1) : "N/A"}</p>
                  </div>

                  <div className="notas-card">
                    <h4>Testes</h4>
                    <p>{disciplinaAtual.notaTeste !== undefined && disciplinaAtual.notaTeste !== null ? disciplinaAtual.notaTeste.toFixed(1) : "N/A"}</p>
                  </div>

                  <div className="notas-card">
                    <h4>Trabalhos</h4>
                    <p>{disciplinaAtual.notaTrabalho !== undefined && disciplinaAtual.notaTrabalho !== null ? disciplinaAtual.notaTrabalho.toFixed(1) : "N/A"}</p>
                  </div>
                  
                  <div className="notas-card">
                    <h4>Estágio</h4>
                    <p>{disciplinaAtual.estagioNota !== undefined && disciplinaAtual.estagioNota !== null ? disciplinaAtual.estagioNota.toFixed(1) : "N/A"}</p>
                  </div>
                </div>
                
                <div className="media-final">
                  <h4>Média Atual: {disciplinaAtual.media !== undefined && disciplinaAtual.media !== null ? disciplinaAtual.media.toFixed(2) : "N/A"}</h4>
                </div>
              </div>

              <div className="presenca-section">
                <h3>Presenças e Faltas</h3>
                <div className="presenca-info">
                  <p>Total de Aulas: {formData.totalAulas}</p>
                  <p>Faltas: {formData.faltas}</p>
                  {formData.faltaMotivo && (
                    <p>Motivo: {formData.faltaMotivo}</p>
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
                      console.log("Disciplina selecionada:", e.target.value);
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
            disciplinasCursadas.map(disciplina => (
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
                  <p>Média: {disciplina.media !== undefined && disciplina.media !== null ? disciplina.media.toFixed(2) : "N/A"}</p>
                  <p>Estágio: {disciplina.estagioNota !== undefined && disciplina.estagioNota !== null ? disciplina.estagioNota.toFixed(1) : "N/A"}</p>
                  <div className="disciplina-notas-grid">
                    <span>P: {disciplina.notaProva !== undefined && disciplina.notaProva !== null ? disciplina.notaProva.toFixed(1) : "N/A"}</span>
                    <span>T: {disciplina.notaTeste !== undefined && disciplina.notaTeste !== null ? disciplina.notaTeste.toFixed(1) : "N/A"}</span>
                    <span>Tr: {disciplina.notaTrabalho !== undefined && disciplina.notaTrabalho !== null ? disciplina.notaTrabalho.toFixed(1) : "N/A"}</span>
                  </div>
                  <p className="disciplina-presenca">
                    Presença: {((disciplina.totalAulas - disciplina.faltas) / disciplina.totalAulas * 100).toFixed(0)}% 
                    <span className="disciplina-faltas">(Faltas: {disciplina.faltas}/{disciplina.totalAulas})</span>
                  </p>
                  <div className="disciplina-card-footer">
                    <span className="clique-para-editar">Clique para editar</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhuma disciplina cursada encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalhesAluno;
