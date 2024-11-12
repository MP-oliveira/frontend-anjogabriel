import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home";
import AddMaterialEUtensilio from './components/AddMaterial/AddMaterialEUtensilo';
import AddTurno from './components/Addturno/AddTurno';
import AddDiploma from './components/AddDiploma/AddDiploma';
import Header from './components/Header/Header';

import AddAluno from "./components/AddAluno/AddAluno";
import EditAluno from "./components/EditAluno/EditAluno";
import Alunos from "./components/Alunos/Alunos";

import AddCurso from './components/AddCurso/AddCurso';
import EditCurso from './components/EditCurso/EditCurso';
import Cursos from './components/Cursos/Cursos';

import AddDisciplina from './components/AddDisciplina/AddDisciplina';
import EditDisciplina from './components/EditDisciplina/EditDisciplina';
import Disciplinas from './components/Disciplinas/Disciplinas';

import AddProfessor from './components/AddProfessor/AddProfessor';
import EditProfessor from './components/EditProfessor/EditProfessor';
import Professores from './components/Professores/Professores';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/alunos/add" element={<AddAluno />} />
          <Route path="/alunos/edit/:id" element={<EditAluno />} />
          <Route path="/alunos" element={<Alunos />} />

          <Route path="/cursos/add" element={<AddCurso />} />
          <Route path="/cursos/edit/:id" element={<EditCurso />} />
          <Route path="/cursos" element={<Cursos />} />

          <Route path="/disciplinas/add" element={<AddDisciplina />} />
          <Route path="/disciplinas/edit/:id" element={<EditDisciplina />} />
          <Route path="/disciplinas" element={<Disciplinas />} />

          <Route path="/professores/add" element={<AddProfessor />} />
          <Route path="/professores/edit/:id" element={<EditProfessor />} />
          <Route path="/professores" element={<Professores />} />

          <Route path="/diplomas" element={<AddDiploma />} />
          <Route path="/turnos" element={<AddTurno />} />
          <Route path="/materialeutensilios" element={<AddMaterialEUtensilio />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
