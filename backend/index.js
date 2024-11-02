require('dotenv').config();
const express = require('express');
const app = express();
const port = 3001;
const exphbs = require('express-handlebars')
const alunoRoutes = require('./routes/alunoRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const diplomaRoutes = require('./routes/diplomaRoutes');
const professorRoutes = require('./routes/professorRoutes');
const materialEUtensilioRoutes = require('./routes/materialEUtensilio');
const turnoRoutes = require('./routes/turnoRoutes');
const flash = require('express-flash')
const cors = require('cors')



const db = require("./db/db");
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))


app.use('/api/alunos', alunoRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/disciplinas', disciplinaRoutes);
app.use('/api/diplomas', diplomaRoutes);
app.use('/api/professores', professorRoutes);
app.use('/api/materialeutensilios', materialEUtensilioRoutes);
app.use('/api/turnos', turnoRoutes);
// app.get('/', (req, res) => {
//   res.render('home')
// })


db
// .sync({force: true})
.sync()
.then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})

.catch(err => {
  console.error(err);
})