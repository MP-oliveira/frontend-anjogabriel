const express = require('express');
const app = express();
const port = 3001;
const alunoRoutes = require('./routes/alunoRoutes');

const db = require("./db/db");
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use('/alunos', alunoRoutes);

db.sync()
.then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})

.catch(err => {
  console.error(err);
})