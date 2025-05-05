const { Sequelize } = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  host: 'localhost',
})

console.log('Conectando ao banco:', process.env.DATABASE_URL);

try {
  db.authenticate()
  console.log('Connection has been established successfully.');
} catch (error) {
  console.log(error)
}

module.exports = db