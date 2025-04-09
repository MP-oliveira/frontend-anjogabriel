import "../EditAluno/Edit.css"; // Importando o CSS existente
import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import VoltarButton from '../VoltarButton/VoltarButton';

const materialSchema = z.object({
  nome: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  quantidade: z.number().min(1, { message: "A quantidade precisa ser maior que 0" }),
  tipo: z.string().min(1, { message: "Selecione um tipo válido" }),
});

const EditMaterialEUtensilio = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [materialData, setMaterialData] = useState({
    nome: "",
    quantidade: 0,
    tipo: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar dados do material
        const materialResponse = await api.get(`/materialeutensilios/${id}`);
        const material = materialResponse.data;

        setMaterialData({
          ...material,
          quantidade: Number(material.quantidade),
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

    // Validar os dados
    const materialResult = materialSchema.safeParse(materialData);

    if (!materialResult.success) {
      setErrors(materialResult.error.format());
      return;
    }

    try {
      await api.put(`/materialeutensilios/edit/${id}`, materialData);
      navigate("/materiaiseutensilios");
    } catch (error) {
      console.error("Erro ao atualizar material", error);
      setApiError("Erro ao atualizar material. Por favor, tente novamente.");
    }
  };

  const handleChange = (e) => {
    const { name, type, value } = e.target;

    let processedValue = value;
    if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    }

    setMaterialData(prev => ({
      ...prev,
      [name]: processedValue
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
            {errors.nome._errors?.[0]}
          </p>
        )}
        <div className="input-three-columns">

          <input
            type="text"
            name="categoria"
            value={materialData.categoria}
            onChange={handleChange}
            placeholder="Nome do Material"
          />
          {errors.nome && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.categoria._errors?.[0]}
            </p>
          )}
          <input
            type="number"
            name="quantidade"
            value={materialData.quantidade}
            onChange={handleChange}
            placeholder="Quantidade"
          />
          {errors.quantidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.quantidade._errors?.[0]}
            </p>
          )}
          <input
            type="text"
            name="unidade"
            value={materialData.unidade}
            onChange={handleChange}
            placeholder="Unidade"
          />
          {errors.quantidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.unidade._errors?.[0]}
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
          {errors.quantidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.valor_unitarior._errors?.[0]}
            </p>
          )}
          <input
            type="date"
            name="ultimo_pedido"
            value={materialData.ultimo_pedido}
            onChange={handleChange}
            placeholder="Ultimo Pedido"
          />
          {errors.quantidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.ultimo_pedido._errors?.[0]}
            </p>
          )}

          <input
            type="text"
            name="status_material"
            value={materialData.status_material}
            onChange={handleChange}
            placeholder="Estatos de Materiais e Ultensilios"
          />
          {errors.quantidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.status_material._errors?.[0]}
            </p>
          )}
        </div>
        <button className="aluno-btn" type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditMaterialEUtensilio; 