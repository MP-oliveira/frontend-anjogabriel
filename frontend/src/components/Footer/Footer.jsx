import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';
import footer1 from '../../assets/footer1.png';
import footer2 from '../../assets/footer2.png';
import footer3 from '../../assets/footer3.png';
import footer4 from '../../assets/footer4.png';
import footer5 from '../../assets/footer5.png';
import footer6 from '../../assets/footer6.png';

const Footer = () => {
  const whatsappLink = () => {
    const number = "5571992011531";
    const message = "Olá! Gostaria de saber mais informações sobre os cursos.";
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <h2 className="footer-cta">Precisa de informações?</h2>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="footer-button">
          <FaWhatsapp /> (71) 99201-1531
        </a>
      </div>

      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-brand-header">
            <h3> Escola de Enfermagem <span>Anjo Gabriel</span></h3>
          </div>
          <p>Formação técnica de excelência em enfermagem</p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Youtube"><FaYoutube /></a>
          </div>
        </div>

        <div className="footer-locations">
          <div className="location">
            <h4>Simões Filho</h4>
            <p>Avenida Altamirando de Araújo Ramos, 278</p>
            <p>Centro, Simões Filho - BA</p>
            <a href="#" className="location-link">Ver no Google Maps</a>
          </div>
        </div>

        <div className="footer-gallery">
          <img src={footer1} alt="Laboratório" />
          <img src={footer2} alt="Sala de Aula" />
          <img src={footer3} alt="Prática" />
          <img src={footer4} alt="Formatura" />
          <img src={footer5} alt="Estrutura" />
          <img src={footer6} alt="Equipamentos" />
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 - Escola Técnica de Enfermagem <span> Anjo Gabriel</span></p>
        <nav>
          <a href="#sectionOne">Home</a>
          <a href="#sectionTwo">Nossos Cursos</a>
          <a href="#sectionThree">Nossa Estrutura</a>
          <a href="#sectionFour">Fale Conosco</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer; 