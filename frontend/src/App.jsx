import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home";
import AddAluno from "./components/AddAluno/AddAluno";
import AddDisciplina from './components/AddDisciplina/AddDisciplina';
import AddProfessor from './components/AddProfessor/AddProfessor';
import AddMaterialEUtensilio from './components/AddMaterial/AddMaterialEUtensilo';
import AddCurso from './components/AddCurso/AddCurso';
import AddTurno from './components/Addturno/AddTurno';
import AddDiploma from './components/AddDiploma/AddDiploma';
import Header from './components/Header/Header';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/alunos" element={<AddAluno />} />
          <Route path="/cursos" element={<AddCurso />} />
          <Route path="/disciplinas" element={<AddDisciplina />} />
          <Route path="/diplomas" element={<AddDiploma />} />
          <Route path="/professores" element={<AddProfessor />} />
          <Route path="/turnos" element={<AddTurno />} />
          <Route path="/materialeutensilios" element={<AddMaterialEUtensilio />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
