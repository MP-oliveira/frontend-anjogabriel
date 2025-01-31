import { useState } from "react";
import api from "../../services/api"; // Importando o serviço de API

const AddMaterialEUtensilio = () => {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("");
  const [valor_unitario, setValor_unitario] = useState("");
  const [ultimo_pedido, setUltimo_pedido] = useState("");
  const [status_material, setStatus_material] = useState("");


  console.log(nome)

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Criar um FormData para enviar os arquivos junto com os dados
    const newMaterialEUtensilio = {
      nome,
      categoria,
      quantidade,
      unidade,
      valor_unitario,
      ultimo_pedido,
      status_material,
    }

    console.log(newMaterialEUtensilio)

    try {
      // Enviar os dados para a API
      await api.post("/materialeutensilios/create", newMaterialEUtensilio);
      alert("Material adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar Material", error);
    }
  };



  return (
    <div className="addaluno-container">
      <form className="form-addaluno" onSubmit={handleSubmit}>
        <h2>Adicionar Materiais e Utensilios</h2>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          placeholder="Categoria"
        />
        <input
          type="text"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          placeholder="Quantidade"
        />
        <input
          type="text"
          value={unidade}
          onChange={(e) => setUnidade(e.target.value)}
          placeholder="Unidade"
        />
        <input
          type="text"
          value={valor_unitario}
          onChange={(e) => setValor_unitario(e.target.value)}
          placeholder="Valor Unitário"
        />
        <input
          type="text"
          value={ultimo_pedido}
          onChange={(e) => setUltimo_pedido(e.target.value)}
          placeholder=" Último Pedido"
        />   <input
          type="text"
          value={status_material}
          onChange={(e) => setStatus_material(e.target.value)}
          placeholder="Estatos de Materiais e Ultensilios"
        />

<div className="aluno-btn-container">
          <button className="aluno-btn" type="submit">
            Adicionar Material ou Utensílio
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMaterialEUtensilio;
