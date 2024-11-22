import { useEffect, useState } from 'react';
import { UserCircle } from 'phosphor-react';
import Logo from '../../assets/Logo.png';
import { NavLink, useNavigate } from "react-router-dom";
import './Header.css';

const Header = () => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsBlurred(true);
    } else {
      setIsBlurred(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      setIsAuthenticated(true);
      setUsername(user.name || user.email); // Ajuste conforme os dados que você está armazenando
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

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
          {isAuthenticated ? (
            <>
              <div className="icon">
                <UserCircle size={30} color="#C6D6F3" />
              </div>
              <div className="user-text">
                Bem Vindo <span>{username}!</span>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
            </>
          ) : (
            <button onClick={() => navigate('/login')} className="login-button">Login</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
