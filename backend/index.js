const express = require('express');
const app = express();
const port = 3001;
const exphbs = require('express-handlebars')
const alunoRoutes = require('./routes/alunoRoutes');
const flash = require('express-flash')


const db = require("./db/db");
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// public
app.use(express.static('public'))

app.use('/alunos', alunoRoutes);
app.get('/', (req, res) => {
  res.render('home')
})

app.use(flash())

db.sync()
.then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})

.catch(err => {
  console.error(err);
})