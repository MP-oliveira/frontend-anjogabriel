require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = 3001;
const adminRoutes = require('./routes/adminRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const diplomaRoutes = require('./routes/diplomaRoutes');
const professorRoutes = require('./routes/professorRoutes');
const materialEUtensilioRoutes = require('./routes/materialEUtensilio');
const turnoRoutes = require('./routes/turnoRoutes');
const authRoutes = require('./routes/authRoutes');
const regsitroAcademicoRoutes = require('./routes/registroAcademicoRoutes')
const transacaoFinanceiraRoutes = require('./routes/transacaoFinanceiraRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const contaRoutes = require('./routes/contaRoutes');
const cors = require('cors')
const db = require("./db/db");

// Configuração do Supabase
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
app.use('/api/admins', adminRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/disciplinas', disciplinaRoutes);
app.use('/api/diplomas', diplomaRoutes);
app.use('/api/professores', professorRoutes);
app.use('/api/materialeutensilios', materialEUtensilioRoutes);
app.use('/api/turnos', turnoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/registroacademico', regsitroAcademicoRoutes)
app.use('/api/financeiro', transacaoFinanceiraRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/contas', contaRoutes);

db
// .sync({ force: true, alter: true })
.sync()
.then(() => {
  console.log('Banco de dados sincronizado com sucesso');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch(err => {
  console.error('Erro ao sincronizar o banco de dados:', err);
});

module.exports = { supabase };