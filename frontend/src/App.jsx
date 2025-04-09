import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./context/UseContext";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import EsqueciASenha from "./components/EsqueciASenha/EsqueciASenha";

import AddMaterialEUtensilio from "./components/AddMaterial/AddMaterialEUtensilo";
import AddTurno from "./components/Addturno/AddTurno";
import Diploma from "./components/Diploma/Diploma"
import Header from "./components/Header/Header";

import AddAluno from "./components/AddAluno/AddAluno";
import EditAluno from "./components/EditAluno/EditAluno";
import Alunos from "./components/Alunos/Alunos";

import AddCurso from "./components/AddCurso/AddCurso";
import EditCurso from "./components/EditCurso/EditCurso";
import Cursos from "./components/Cursos/Cursos";

import AddDisciplina from "./components/AddDisciplina/AddDisciplina";
import EditDisciplina from "./components/EditDisciplina/EditDisciplina";
import Disciplinas from "./components/Disciplinas/Disciplinas";

import AddAdmin from "./components/AddAdmin/AddAdmin";
import EditAdmin from "./components/EditAdmin/EditAdmin";
import Admins from "./components/Admin/Admin";

import AddProfessor from "./components/AddProfessor/AddProfessor";
import EditProfessor from "./components/EditProfessor/EditProfessor";
import Professores from "./components/Professores/Professores";

import AddRegistroAcademico from "./components/AddRegistroAcademico/AddRegistroAcademico";
import EditRegistroAcademico from "./components/EditRegistroAcademico/EditRegistroAcademico";
import RegistroAcademico from './components/RegistroAcademico/RegistroAcademicoAluno';
import DetalhesAluno from './components/RegistroAcademico/DestalhesAlunos';
import Boletim from './components/Boletim/Boletim';
import FinancialDashboard from './components/Financial/FinancialDashboard';

import Dashboard from './components/Dashboard/Dashboard';
import Transacoes from './components/Transacoes/Transacoes';
import AdicionarTransacao from './components/AddTransacao/AddTransacao';
import AdicionarConta from './components/AdicionarConta/AdicionarConta';


function App() {
  const { user } = useContext(UserContext); // Obter o estado do usuário
  const role = user
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Home />} />
          <Route path="/esqueciaasenha" element={<EsqueciASenha />} />

          <Route path="/alunos/add" element={user && (role.role === 'aluno' || role.role === 'admin') ? <AddAluno /> : <Navigate to="/login" />} />
          <Route path="/alunos/edit/:id" element={user && (role.role === 'aluno' || role.role === 'admin') ? <EditAluno /> : <Navigate to="/login" />} />
          <Route path="/alunos" element={user && (role.role === 'aluno' || role.role === 'admin' || role.role === 'professor') ? <Alunos /> : <Navigate to="/login" />} />

          <Route path="/cursos/add" element={user && role.role === 'admin' ? <AddCurso /> : <Navigate to="/login" />} />
          <Route path="/cursos/edit/:id" element={user && role.role === 'admin' ? <EditCurso /> : <Navigate to="/login" />} />
          <Route path="/cursos" element={user && role.role === 'admin' ? <Cursos /> : <Navigate to="/login" />} />

          <Route path="/disciplinas/add" element={user && role.role === 'admin' ? <AddDisciplina /> : <Navigate to="/login" />} />
          <Route path="/disciplinas/edit/:id" element={user && (role.role === 'professor' || role.role === 'admin') ? <EditDisciplina /> : <Navigate to="/login" />} />
          <Route path="/disciplinas" element={user && (role.role === 'professor' || role.role === 'admin' || role.role === 'aluno') ? <Disciplinas /> : <Navigate to="/login" />} />

          <Route path="/admins/create" element={<AddAdmin /> } />
          <Route path="/admins/edit/:id" element={user && role.role === 'admin' ? <EditAdmin /> : <Navigate to="/login" />} />
          <Route path="/admins" element={ <Admins /> } />

          <Route path="/professores/add" element={user && role.role === 'admin' ? <AddProfessor /> : <Navigate to="/login" />} />
          <Route path="/professores/edit/:id" element={user && role.role === 'admin' ? <EditProfessor /> : <Navigate to="/login" />} />
          <Route path="/professores" element={user && (role.role === 'professor' || role.role === 'admin') ? <Professores /> : <Navigate to="/login" />} />

          <Route path="/registroacademico" element={user && (role.role === 'aluno' || role.role === 'admin' || role.role === 'professor') ? <RegistroAcademico /> : <Navigate to="/login" />} />
          <Route path="/registroacademico/create" element={user && role.role === 'admin' ? <AddRegistroAcademico /> : <Navigate to="/login" />} />
          <Route path="/registroacademico/edit/:id" element={user && (role.role === 'professor' || role.role === 'admin') ? <EditRegistroAcademico /> : <Navigate to="/login" />} />
          <Route path="/registroacademico/:id" element={user && (role.role === 'aluno' || role.role === 'admin') ? <DetalhesAluno />  : <Navigate to="/login" />} />

          <Route path="/diplomas/:id" element={<Diploma />} />
          <Route path="/boletim/:id" element={<Boletim />} />
          <Route path="/turnos" element={user && role.role === 'admin' ? <AddTurno /> : <Navigate to="/login" />} />
          <Route
            path="/materialeutensilios"
            element={user && role.role === 'admin' ? <AddMaterialEUtensilio /> : <Navigate to="/login" />}
          />
          <Route path="/financial" element={<FinancialDashboard />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/transacoes" element={<Transacoes />} />
          <Route path="/adicionar-transacao" element={<AdicionarTransacao />} />
          <Route path="/adicionar-conta" element={<AdicionarConta />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
