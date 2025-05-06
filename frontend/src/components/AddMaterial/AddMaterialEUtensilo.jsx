import { useState, useEffect } from "react";
import api from "../../services/api"; // Importando o serviço de API
import VoltarButton from "../VoltarButton/VoltarButton";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";

const materialSchema = z.object({
  nome: z.string().min(1, { message: "O nome é obrigatório" }),
  categoria: z.string().min(1, { message: "A categoria é obrigatória" }),
  quantidade: z.string().min(1, { message: "A quantidade é obrigatória" }),
  unidade: z.string().min(1, { message: "A unidade é obrigatória" }),
  valor_unitario: z
    .string()
    .min(1, { message: "O valor unitário é obrigatório" }),
  ultimo_pedido: z
    .string()
    .min(1, { message: "A data do último pedido é obrigatória" }),
  status_material: z
    .string()
    .min(1, { message: "O status do material é obrigatório" }),
});

const AddMaterialEUtensilio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("");
  const [valor_unitario, setValor_unitario] = useState("");
  const [ultimo_pedido, setUltimo_pedido] = useState("");
  const [status_material, setStatus_material] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loading

  // Obter a categoria da URL, se disponível
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoriaParam = params.get("categoria");

    if (categoriaParam) {
      setCategoria(decodeURIComponent(categoriaParam));
    }
  }, [location]);

  console.log(nome);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Formatar a data para o formato esperado pelo backend (YYYY-MM-DD)
    const formattedDate = ultimo_pedido
      ? new Date(ultimo_pedido).toISOString().split("T")[0]
      : "";

    const materialData = {
      nome,
      categoria,
      quantidade,
      unidade,
      valor_unitario,
      ultimo_pedido: formattedDate,
      status_material,
    };

    // Validar os dados com o schema
    const result = materialSchema.safeParse(materialData);

    if (!result.success) {
      const formattedErrors = {};
      result.error.errors.forEach((error) => {
        formattedErrors[error.path[0]] = error.message;
      });
      setErrors(formattedErrors);
    } else {
      setIsLoading(true); // Ativa o estado de loading antes da requisição
      try {
        // Enviar os dados para a API
        const response = await api.post(
          "/materialeutensilios/create",
          materialData
        );
        console.log("Resposta da API:", response.data);
        alert("Material adicionado com sucesso!");

        // Limpar os campos após o sucesso
        setNome("");
        setCategoria("");
        setQuantidade("");
        setUnidade("");
        setValor_unitario("");
        setUltimo_pedido("");
        setStatus_material("");
        navigate("/materialeutensilios");
      } catch (error) {
        console.error("Erro ao adicionar Material", error);

        // Mostrar mensagem de erro mais específica
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          alert(`Erro: ${error.response.data.error}`);
        } else {
          alert(
            "Erro ao adicionar material. Verifique os dados e tente novamente."
          );
        }
      } finally {
        setIsLoading(false); // Desativa o estado de loading após a requisição (sucesso ou erro)
      }
      setErrors({});
    }
  };

  return (
    <div className="form-container">
      <form className="form-add" onSubmit={handleSubmit}>
        <VoltarButton url="/materialeutensilios" />

        <h2>Adicionar Materiais e Utensilios</h2>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        {errors.nome && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.nome}
          </p>
        )}

        <div className="input-three-columns">
          <div className="custom-select-wrapper">
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Categoria</option>
              <option value="Material Hospitalar / Material Técnico">
                Material Hospitalar / Material Técnico
              </option>
              <option value="Material Didático / Escolar">
                Material Didático / Escolar
              </option>
              <option value="Material de Escritório / Administrativo">
                Material de Escritório / Administrativo
              </option>
              <option value="Material de Limpeza e Higiene">
                Material de Limpeza e Higiene
              </option>
              <option value="Equipamentos de Manutenção">
                Equipamentos de Manutenção
              </option>
            </select>
          </div>
          {errors.categoria && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.categoria}
            </p>
          )}

          <input
            type="text"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Quantidade"
          />
          {errors.quantidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.quantidade}
            </p>
          )}

          <input
            type="text"
            value={unidade}
            onChange={(e) => setUnidade(e.target.value)}
            placeholder="Unidade"
          />
          {errors.unidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.unidade}
            </p>
          )}
        </div>

        <div className="input-three-columns">
          <input
            type="text"
            value={valor_unitario}
            onChange={(e) => setValor_unitario(e.target.value)}
            placeholder="Valor Unitário"
          />
          {errors.valor_unitario && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.valor_unitario}
            </p>
          )}

          <input
            type="date"
            value={ultimo_pedido}
            onChange={(e) => setUltimo_pedido(e.target.value)}
            placeholder="Último Pedido"
          />
          {errors.ultimo_pedido && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.ultimo_pedido}
            </p>
          )}

          <div className="custom-select-wrapper">
            <select
              value={status_material}
              onChange={(e) => setStatus_material(e.target.value)}
            >
              <option value="">Status do Material</option>
              <option value="Disponível">Disponível</option>
              <option value="Em Estoque Baixo">Em Estoque Baixo</option>
              <option value="Esgotado">Esgotado</option>
              <option value="Em Manutenção">Em Manutenção</option>
            </select>
          </div>
          {errors.status_material && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.status_material}
            </p>
          )}
        </div>

        <div className="aluno-btn-container">
          <button
            className="aluno-btn"
            type="submit"
            disabled={isLoading} // Desabilita o botão quando estiver carregando
          >
            {isLoading ? "Adicionando..." : "Adicionar Material ou Utensílio"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMaterialEUtensilio;
