import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UseContext"; // Importar o contexto

import Home from "./pages/Home/Home";
import Login from "./components/Login/Login";
import EsqueciASenha from "./components/EsqueciASenha/EsqueciASenha";

import AddMaterialEUtensilio from "./components/AddMaterial/AddMaterialEUtensilo";
import AddTurno from "./components/Addturno/AddTurno";
import AddDiploma from "./components/AddDiploma/AddDiploma";
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

function App() {
  const { user } = useUser(); // Obter o estado do usuário
  const role = user;
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Home />} />
          <Route path="/esqueciaasenha" element={<EsqueciASenha />} />

          {/* <Route path="/alunos/add" element={user && role.role === 'aluno' ?<AddAluno /> :<Navigate to="/login"/>} />
          <Route path="/alunos/edit/:id" element={user && role.role === 'aluno' ?<EditAluno />:<Navigate to="/login"/>} />
          <Route path="/alunos" element={user && role.role === 'aluno' ?<Alunos />: <Navigate to="/login"/>} /> */}

          <Route path="/alunos/add" element={<AddAluno />} />
          <Route path="/alunos/edit/:id" element={<EditAluno />} />
          <Route path="/alunos" element={<Alunos />} />

          <Route path="/cursos/add" element={<AddCurso />} />
          <Route path="/cursos/edit/:id" element={<EditCurso />} />
          <Route path="/cursos" element={<Cursos />} />

          <Route path="/disciplinas/add" element={<AddDisciplina />} />
          <Route path="/disciplinas/edit/:id" element={<EditDisciplina />} />
          <Route path="/disciplinas" element={<Disciplinas />} />

          <Route path="/admins/create" element={user && role.role === 'admin' ? <AddAdmin /> : <Navigate to="/login" />} />
          <Route path="/admins/edit/:id" element={user && role.role === 'admin' ? <EditAdmin /> : <Navigate to="/login" />} />
          <Route path="/admins" element={user && role.role === 'admin' ? <Admins /> : <Navigate to="/login" />} />

          <Route path="/professores/add" element={user && role.role === 'professor' ? <AddProfessor /> : <Navigate to="/login" />} />
          <Route path="/professores/edit/:id" element={user && role.role === 'professor' ? <EditProfessor /> : <Navigate to="/login" />} />
          <Route path="/professores" element={user && role.role === 'professor' ? <Professores /> : <Navigate to="/login" />} />

          <Route path="/diplomas/:id" element={<AddDiploma />} />
          <Route path="/turnos" element={<AddTurno />} />
          <Route
            path="/materialeutensilios"
            element={<AddMaterialEUtensilio />}
          />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
