import { useEffect, useState } from 'react';
import { UserCircle } from 'phosphor-react';
import Logo from '../../assets/Logo.png';
import { NavLink } from "react-router-dom";
import './Header.css';

const Header = () => {
  const [isBlurred, setIsBlurred] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsBlurred(true);
    } else {
      setIsBlurred(false);
    }
    // console.log("ScrollY:", window.scrollY, "isBlurred:", isBlurred); // Adicione este console log
  };


  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header header.${isBlurred ? 'blur' : ''}`}>
      <div className="header__container">
        <div className="logo">
          <div className="img">
            <img src={Logo} alt="Escola de Enfermagem Anjo Gabriel" />
          </div>
          <div className="logo-text">
            Anjo Gabriel<span>Escola de Enfermagem</span>
          </div>
        </div>
        <div className="links">
          <li>
            <NavLink to={`/`} className="nav-link">Home</NavLink>
          </li>
          <li>
            <NavLink to={`/alunos`} className="nav-link">Alunos</NavLink>
          </li>
          <li>
            <NavLink to={`/cursos`} className="nav-link">Cursos</NavLink>
          </li>
          <li>
            <NavLink to={`/disciplinas`} className="nav-link">Disciplina</NavLink>
          </li>
          <li>
            <NavLink to={`/diplomas`} className="nav-link">Diplomas</NavLink>
          </li>
          <li>
            <NavLink to={`/turnos`} className="nav-link">Turno</NavLink>
          </li>
          <li>
            <NavLink to={`/professores`} className="nav-link">Professores</NavLink>
          </li>
          <li>
            <NavLink to={`/admins`} className="nav-link">Administrador</NavLink>
          </li>
          <li>
            <NavLink to={`/materialeutensilios`} className="nav-link">Materiais e Utensilios</NavLink>
          </li>
        </div>
        <div className="login">
          <div className="icon">
            <UserCircle size={30} color="#C6D6F3" />
          </div>
          <div className="user-text">
            Bem Vindo <span>Mauricio!</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
