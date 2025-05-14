import { useState } from 'react';
import './SectionFour.css';
import { FaMapMarkerAlt, FaPhone, FaClock, FaWhatsapp, FaInstagram, FaEnvelope, FaCheck } from 'react-icons/fa';

const SectionFour = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const whatsappLink = () => {
    const number = "5571992011531";
    const message = "Olá! Gostaria de saber mais informações sobre os cursos.";
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div id='sectionFour' className="contact-section">
      <div className="contact-header">
        <h1 className="contact-title">Fale Conosco</h1>
        <p className="contact-subtitle">Estamos prontos para atender você da melhor forma possível</p>
        <div className="social-links">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="social-link">
            <FaWhatsapp /> WhatsApp
          </a>
          <a href="https://www.instagram.com/enfermagemanjogabriel/" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaInstagram /> Instagram
          </a>
        </div>
      </div>
      
      <div className="contact-container">
        <div className="form-container">
          <div className="form-header">
            <h2>Envie sua mensagem</h2>
            <p>Responderemos o mais breve possível</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Nome completo"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Telefone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Mensagem"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn">
              <FaEnvelope className="btn-icon" />
              Enviar mensagem
            </button>
            
            <div className="form-footer">
              <div className="form-footer-content">
                <div className="footer-item">
                  <div className="footer-icon">🔒</div>
                  <p>Seus dados estão seguros</p>
                </div>
                <div className="footer-item">
                  <div className="footer-icon">⚡</div>
                  <p>Resposta em até 24h</p>
                </div>
                <div className="footer-item">
                  <div className="footer-icon">💬</div>
                  <p>Atendimento personalizado</p>
                </div>
              </div>
            </div>

            <div className="features-list">
              <h3>Por que escolher nossa escola?</h3>
              <div className="features-grid">
                <div className="feature">
                  <FaCheck className="feature-icon" />
                  <span>30 anos de experiência</span>
                </div>
                <div className="feature">
                  <FaCheck className="feature-icon" />
                  <span>Professores qualificados</span>
                </div>
                <div className="feature">
                  <FaCheck className="feature-icon" />
                  <span>Material didático atualizado</span>
                </div>
                <div className="feature">
                  <FaCheck className="feature-icon" />
                  <span>Laboratórios modernos</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="contact-info">
          <div className="info-box">
            <div className="info-header">
              <h3>Informações de Contato</h3>
              <p className="info-subtitle">Estamos aqui para ajudar!</p>
            </div>
            
            <div className="info-content">
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div className="info-text">
                  <h4>Localização</h4>
                  <p>Avenida Altamirando de Araújo Ramos, 278</p>
                  <p>Centro, Simões Filho - BA</p>
                </div>
              </div>

              <div className="info-item">
                <FaPhone className="info-icon" />
                <div className="info-text">
                  <h4>Telefone</h4>
                  <p>(71) 3396-2484</p>
                  <p>WhatsApp: (71) 99201-1531</p>
                </div>
              </div>

              <div className="info-item">
                <FaClock className="info-icon" />
                <div className="info-text">
                  <h4>Horário de Atendimento</h4>
                  <p>Segunda a Sexta: 8h às 18h</p>
                  <p>Sábado: 8h às 12h</p>
                </div>
              </div>
            </div>

            <div className="quick-contact">
              <a 
                href={whatsappLink()} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="whatsapp-btn"
              >
                <FaWhatsapp />
                Fale pelo WhatsApp
              </a>
            </div>
          </div>
          
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.815899029656!2d-38.404721!3d-12.786569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDQ3JzExLjYiUyAzOMKwMjQnMTcuMCJX!5e0!3m2!1spt-BR!2sbr!4v1629890000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionFour; 