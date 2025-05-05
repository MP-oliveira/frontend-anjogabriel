module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define('Autenticacao', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'professor', 'aluno'),
      allowNull: false
    },
  });
  return Login;
};