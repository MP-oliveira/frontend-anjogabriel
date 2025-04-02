import './SectionTwo.css';


const SectionTwo = () => {
  const courses = [
    {
      title: "Técnico em Enfermagem",
      description: "Formação completa para atuar em hospitais, clínicas e postos de saúde",
      icon: "🏥"
    },
    {
      title: "Técnico em Enfermagem do Trabalho",
      description: "Especialização para atuar em medicina ocupacional e empresarial",
      icon: "⚕️"
    },
    {
      title: "Técnico em Pronto Atendimento",
      description: "Preparação específica para emergências e atendimentos urgentes",
      icon: "🚑"
    },
    // {
    //   title: "Técnico em Enfermagem de Pronto Socorro",
    //   description: "Formação especializada para atendimentos de emergência",
    //   icon: "🏨"
    // },
    // {
    //   title: "Técnico em Enfermagem de Ambulância",
    //   description: "Capacitação para atendimento móvel de urgência",
    //   icon: "🚨"
    // }
  ];

  return (
    <div id='sectionTwo' className="services-section">
      <div className="services-header">
        <h2>Nossos Cursos</h2>
        <p>Oferecemos uma ampla gama de cursos para atender a todas as suas necessidades.</p>
      </div>
      <div className="services-grid">
        {courses.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
      <div className="emergency-cta">
        <h3>Quer saber mais sobre os nossos cursos?</h3>
        <button className="contact-btn">Fale Conosco</button>
      </div>
    </div>
  );
};

export default SectionTwo;
