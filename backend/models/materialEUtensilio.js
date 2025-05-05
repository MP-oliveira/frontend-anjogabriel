const { DataTypes } = require('sequelize');
const db = require('../db/db');




const MaterialEUtensilio = db.define('MaterialEUtensilio', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.ENUM('Material Hospitalar / Material Técnico', 'Material Didático / Escolar',
      'Material de Escritório / Administrativo', 'Material de Limpeza e Higiene', 'Equipamentos de Manutenção'),
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valor_unitario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ultimo_pedido: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status_material: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
  {
    tableName: "materialeutensilios",
    timestamps: false,
  });

module.exports = MaterialEUtensilio;
