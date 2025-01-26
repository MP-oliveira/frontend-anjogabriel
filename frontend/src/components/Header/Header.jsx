import { useEffect, useState, useContext } from 'react';
import { UserCircle } from 'phosphor-react';
import { UserContext } from "../../context/UseContext";
import { Link } from 'react-scroll';

import Logo from '../../assets/Logo.png';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import './Header.css';

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [isBlurred, setIsBlurred] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsBlurred(true);
    } else {
      setIsBlurred(false);
    }
  };

  const handleNavigation = (section) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: section } });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userLog = JSON.parse(localStorage.getItem('user'));

    if (userLog) {
      setUser(userLog.role);
    }

    if (!token || !userLog) {
      setUser(null);
    }
  }, [setUser]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  return (
    <header className={`header ${isBlurred ? 'blur' : ''}`}>
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
            <NavLink to="/" className="nav-link">Home</NavLink>
          </li>
          <li>
            <Link 
              activeClass="active"
              to="sectionTwo"
              spy={true} 
              smooth={true} 
              offset={-70} 
              duration={500} 
              className="nav-link"
              onClick={() => {
                if (location.pathname !== '/') {
                  navigate('/');
                }
              }}
            >
              Nossos Cursos
            </Link>
          </li>
          <li>
            <Link 
              activeClass="active"
              to="sectionThree"
              spy={true} 
              smooth={true} 
              offset={-70} 
              duration={500} 
              className="nav-link"
              onClick={() => {
                if (location.pathname !== '/') {
                  navigate('/');
                }
              }}
            >
              Nossa Estrutura
            </Link>
          </li>
          <li>
            <Link 
              activeClass="active"
              to="sectionFour"
              spy={true} 
              smooth={true} 
              offset={-70} 
              duration={500} 
              className="nav-link"
              onClick={() => {
                if (location.pathname !== '/') {
                  navigate('/');
                }
              }}
            >
              Fale Conosco
            </Link>
          </li>
          <li className="dropdown">
            <button className="nav-link dropdown-trigger">
              Dashboard
            </button>
            <div className="dropdown-menu">
              <NavLink to="/alunos" className="dropdown-item">Alunos</NavLink>
              <NavLink to="/professores" className="dropdown-item">Professores</NavLink>
              <NavLink to="/cursos" className="dropdown-item">Cursos</NavLink>
              <NavLink to="/disciplinas" className="dropdown-item">Disciplina</NavLink>
              <NavLink to="/diplomas" className="dropdown-item">Diplomas</NavLink>
              <NavLink to="/turnos" className="dropdown-item">Turno</NavLink>
              <NavLink to="/admins" className="dropdown-item">Administrador</NavLink>
              <NavLink to="/materialeutensilios" className="dropdown-item">Materiais e Utensílios</NavLink>
              <NavLink to="/registroacademico" className="dropdown-item">Registro Acadêmico</NavLink>
            </div>
          </li>
        </div>
        <div className="login">
          {user ? (
            <>
              <div className="icon">
                <UserCircle size={30} color="#C6D6F3" />
              </div>
              <div className="user-text">
                Bem Vindo <span>{user.nome || user.email}!</span>
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