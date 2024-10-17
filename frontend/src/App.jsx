import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home/Home";
import AddAluno from "./components/AddAluno";
import AddDisciplina from './components/AddDisciplina';
import AddProfessor from './components/AddProfessor';
import AddMaterialEUtensilio from './components/AddMaterialEUtensilo';
import Navbar from "./components/Navbar/Navbar";
import AddCurso from './components/AddCurso';

function App() {
  return (
    <>
    <BrowserRouter>
    <Navbar />
    <Routes>
    <Route path="/" element={ <Home /> } />
      
    <Route path="/alunos" element={ <AddAluno /> } />
    <Route path="/cursos" element={ <AddCurso /> } />
    <Route path="/disciplinas" element={ <AddDisciplina/> } />
    <Route path="/professores" element={ <AddProfessor /> } />
    <Route path="/materialeutensilios" element={ <AddMaterialEUtensilio/> } />

      

    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
