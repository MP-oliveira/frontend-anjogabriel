import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to={`/`}>Home</NavLink>
        </li>
        <li>
          <NavLink to={`/alunos`}>Alunos</NavLink>
        </li>
        <li>
          <NavLink to={`/cursos`}>Cursos</NavLink>
        </li>
        <li>
          <NavLink to={`/disciplinas`}>Disciplina</NavLink>
        </li>
        <li>
          <NavLink to={`/turnos`}>Turno</NavLink>
        </li>
        <li>
          <NavLink to={`/professores`}>Professores</NavLink>
        </li>
        <li>
          <NavLink to={`/materialeutensilios`}>Materiais e Utensilios</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
