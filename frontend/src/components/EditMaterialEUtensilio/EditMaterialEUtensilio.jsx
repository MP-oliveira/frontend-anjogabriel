import "../EditAluno/Edit.css"; // Importando o CSS existente
import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import VoltarButton from '../VoltarButton/VoltarButton';

const materialSchema = z.object({
  nome: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  categoria: z.string().min(1, { message: "Selecione uma categoria válida" }),
  quantidade: z.string().min(1, { message: "A quantidade é obrigatória" }),
  unidade: z.string().min(1, { message: "A unidade é obrigatória" }),
  valor_unitario: z.string().min(1, { message: "O valor unitário é obrigatório" }),
  ultimo_pedido: z.string().min(1, { message: "A data do último pedido é obrigatória" }),
  status_material: z.string().min(1, { message: "O status do material é obrigatório" }),
});

const EditMaterialEUtensilio = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [materialData, setMaterialData] = useState({
    nome: "",
    categoria: "",
    quantidade: "",
    unidade: "",
    valor_unitario: "",
    ultimo_pedido: "",
    status_material: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar dados do material
        const materialResponse = await api.get(`/materialeutensilios/${id}`);
        const material = materialResponse.data;

        // Formatar a data para o formato esperado pelo input date (YYYY-MM-DD)
        const dataFormatada = material.ultimo_pedido ? 
          new Date(material.ultimo_pedido).toISOString().split('T')[0] : '';

        setMaterialData({
          ...material,
          ultimo_pedido: dataFormatada,
        });
      } catch (error) {
        console.error("Erro ao carregar os dados", error);
        setApiError(
          error.response?.data?.message ||
          'Erro ao carregar os dados. Por favor, tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validar os dados
    const materialResult = materialSchema.safeParse(materialData);

    if (!materialResult.success) {
      const formattedErrors = {};
      materialResult.error.errors.forEach((error) => {
        formattedErrors[error.path[0]] = error.message;
      });
      setErrors(formattedErrors);
      return;
    }

    try {
      // Formatar a data para o formato esperado pelo backend
      const dataFormatada = materialData.ultimo_pedido ? 
        new Date(materialData.ultimo_pedido).toISOString().split('T')[0] : '';

      const dataToSend = {
        ...materialData,
        ultimo_pedido: dataFormatada,
      };

      await api.put(`/materialeutensilios/edit/${id}`, dataToSend);
      alert("Material atualizado com sucesso!");
      navigate("/materialeutensilios");
    } catch (error) {
      console.error("Erro ao atualizar material", error);
      
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Erro: ${error.response.data.error}`);
      } else {
        alert("Erro ao atualizar material. Verifique os dados e tente novamente.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMaterialData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando editado
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (apiError) {
    return <div className="error">{apiError}</div>;
  }

  return (
    <div className="form-container">
      <form className="form-add" onSubmit={handleSubmit}>

        <VoltarButton url='/materialeutensilios' />

        <h2>Editar Material e Utensílio</h2>

        <input
          type="text"
          name="nome"
          value={materialData.nome}
          onChange={handleChange}
          placeholder="Nome do Material"
        />
        {errors.nome && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.nome}
          </p>
        )}
        <div className="input-three-columns">
          <div className="custom-select-wrapper">
            <select
              name="categoria"
              value={materialData.categoria}
              onChange={handleChange}
            >
              <option value="">Selecione a categoria</option>
              <option value="Material Hospitalar / Material Técnico">Material Hospitalar / Material Técnico</option>
              <option value="Material Didático / Escolar">Material Didático / Escolar</option>
              <option value="Material de Escritório / Administrativo">Material de Escritório / Administrativo</option>
              <option value="Material de Limpeza e Higiene">Material de Limpeza e Higiene</option>
              <option value="Equipamentos de Manutenção">Equipamentos de Manutenção</option>
            </select>
          </div>
          {errors.categoria && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.categoria}
            </p>
          )}
          <input
            type="text"
            name="quantidade"
            value={materialData.quantidade}
            onChange={handleChange}
            placeholder="Quantidade"
          />
          {errors.quantidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.quantidade}
            </p>
          )}
          <input
            type="text"
            name="unidade"
            value={materialData.unidade}
            onChange={handleChange}
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
            name="valor_unitario"
            value={materialData.valor_unitario}
            onChange={handleChange}
            placeholder="Valor Unitário"
          />
          {errors.valor_unitario && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.valor_unitario}
            </p>
          )}
          <input
            type="date"
            name="ultimo_pedido"
            value={materialData.ultimo_pedido}
            onChange={handleChange}
            placeholder="Último Pedido"
          />
          {errors.ultimo_pedido && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.ultimo_pedido}
            </p>
          )}
          <div className="custom-select-wrapper">
            <select
              name="status_material"
              value={materialData.status_material}
              onChange={handleChange}
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
        <button className="aluno-btn" type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditMaterialEUtensilio; 