import './SectionOne.css'
import Formatura from '../../assets/formatura.jpg'

const SectionOne = () => {
  const scrollToSectionTwo = () => {
    const sectionTwo = document.getElementById('sectionTwo');
    sectionTwo.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="sectionOne" className="sectionOne-content">
      <div className="sectionOne-container">
        <div className="sectionOne-left">
          <h1 className="sectionOne-h1">Sua escola de enfermagem de confiança em Simões Filho</h1>
          <p className="sectionOne-p">Com mais de 25 anos de experiência, construímos uma reputação sólida na formação de profissionais de enfermagem qualificados, oferecendo cursos técnicos adaptados às suas necessidades.</p>
          <div className="sectionOne-cta">
            <button className="sectionOne-btn" onClick={scrollToSectionTwo}>
              Explore nossos cursos
            </button>
            <div className="rating-box">
              <div className="stars">★ ★ ★ ★ ★</div>
              <span>Mais de 4000+ alunos</span>
            </div>
          </div>
          <div className="features">
            <div className="feature-item">
              <span className="check-icon">✓</span>
              Aulas de segunda a sábado
            </div>
            <div className="feature-item">
              <span className="check-icon">✓</span>
              Professores certificados e Qualificados
            </div>
          </div>
        </div>
        <div className="sectionOne-right">
          <img className='sectionOne-img' src={Formatura} alt="Formatura" />
        </div>
      </div>
    </section>
  )
}

export default SectionOne