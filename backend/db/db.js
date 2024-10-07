const { Sequelize } = require('sequelize');

const db = new Sequelize("postgresql://postgres.ipttodfbukirsrgzcgnn:souapaixonadoporjesus@aws-0-us-west-1.pooler.supabase.com:6543/postgres", {
  dialect: 'postgres',
  host: 'localhost',
})

try {
  db.authenticate()
  console.log('Connection has been established successfully.');
} catch (error) {
  console.log(error)
}

module.exports = db