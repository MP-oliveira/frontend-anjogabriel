import { useEffect, useState, useContext } from "react";
import { UserCircle, List, X } from "phosphor-react";
import { UserContext } from "../../context/UseContext";
import { Link } from "react-scroll";

import Logo from "../../assets/Logo.png";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [isBlurred, setIsBlurred] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsBlurred(true);
    } else {
      setIsBlurred(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userLog = JSON.parse(localStorage.getItem("user"));

    if (userLog) {
      setUser(userLog.role);
    }

    if (!token || !userLog) {
      setUser(null);
    }
  }, [setUser]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  const handleNavigateAndScroll = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header
      className={`header  no-print ${isBlurred ? "blur" : ""} ${
        menuOpen ? "menu-open" : ""
      }`}
    >
      <div className="header__container">
        <div className="logo">
          <div className="img">
            <img src={Logo} alt="Escola de Enfermagem Anjo Gabriel" />
          </div>
          <div className="logo-text">
            <span className="logo-span-anjo"> Anjo Gabriel</span>
            <span className="logo-span-escola">Escola de Enfermagem</span>
          </div>
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <List size={24} />}
        </button>
        <div className={`links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link
              activeClass="active"
              to="sectionOne"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="nav-link"
              onClick={() => {
                handleNavigateAndScroll("sectionOne");
                setMenuOpen(false);
              }}
            >
              Home
            </Link>
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
                handleNavigateAndScroll("sectionTwo");
                setMenuOpen(false);
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
                handleNavigateAndScroll("sectionThree");
                setMenuOpen(false);
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
                handleNavigateAndScroll("sectionFour");
                setMenuOpen(false);
              }}
            >
              Fale Conosco
            </Link>
          </li>
          <li className="dropdown">
            <NavLink
              className="nav-link dropdown-trigger"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <div className="dropdown-menu">
              <NavLink
                to="/admins"
                className="dropdown-item"
                onClick={() => setMenuOpen(false)}
              >
                Administrador
              </NavLink>
              <NavLink
                to="/alunos"
                className="dropdown-item"
                onClick={() => setMenuOpen(false)}
              >
                Alunos
              </NavLink>
              <NavLink
                to="/cursos"
                className="dropdown-item"
                onClick={() => setMenuOpen(false)}
              >
                Cursos
              </NavLink>

              <NavLink
                to="/disciplinas"
                className="dropdown-item"
                onClick={() => setMenuOpen(false)}
              >
                Disciplina
              </NavLink>
              <NavLink
                to="/materialeutensilios"
                className="dropdown-item"
                onClick={() => setMenuOpen(false)}
              >
                Materiais e Utensílios
              </NavLink>
              <NavLink
                to="/professores"
                className="dropdown-item"
                onClick={() => setMenuOpen(false)}
              >
                Professores
              </NavLink>
              <NavLink
                to="/turnos"
                className="dropdown-item"
                onClick={() => setMenuOpen(false)}
              >
                Turno
              </NavLink>
              <NavLink
                to="/dashboard"
                className="dropdown-item"
                onClick={() => setMenuOpen(false)}
              >
                Financeiro
              </NavLink>
            </div>
          </li>
        </div>
        <div className="login">
          {user ? (
            <div className="user-container">
              <div className="icon">
                <UserCircle size={26} color="#C6D6F3" />
                <div className="user-text">
                  <span>{user.nome || user.email}</span>
                </div>
              </div>
              <div className="login-button-container">
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="login-button">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
