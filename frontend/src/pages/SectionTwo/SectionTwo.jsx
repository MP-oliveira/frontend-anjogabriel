import './SectionTwo.css';


const SectionTwo = () => {
  const scrollToSectionFour = () => {
    const sectionFour = document.getElementById('sectionFour');
    sectionFour.scrollIntoView({ behavior: 'smooth' });
  };

  const courses = [
    {
      title: "Técnico em Enfermagem",
      description: "Formação completa e prática para atuar em diversos ambientes de saúde. Aprenda procedimentos essenciais, cuidados com pacientes e gestão de equipes. Ideal para quem busca uma carreira dinâmica e gratificante na área da saúde.",
      icon: "🩺"
    },
    {
      title: "Técnico em Saúde do Trabalhador",
      description: "Especialização para formação de profissionais capacitados para atuar na promoção, prevenção e recuperação da saúde de colaboradores em empresas, indústrias e ambientes corporativos.",
      icon: "⚕️"
    }

  ];

  return (
    <div id='sectionTwo' className="services-section">
      <div className="services-header">
        <h2>Nossos Cursos</h2>
        <p>Formação especializada em Enfermagem e Saúde do Trabalhador, preparando profissionais qualificados para o mercado de trabalho.</p>
      </div>
      <div className="services-grid">
        {courses.map((service, index) => (
          <div key={index} className="service-card">
            <div className={`service-content ${service.title === "Técnico em Saúde do Trabalhador" ? "health-worker-content" : ""}`}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="emergency-cta">
        <h3>Quer saber mais sobre os nossos cursos?</h3>
        <button className="contact-btn" onClick={scrollToSectionFour}>Fale Conosco</button>
      </div>
    </div>
  );
};

export default SectionTwo;
