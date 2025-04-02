import './SectionOne.css'
import Sala from '../../assets/sala.jpg'

const SectionOne = () => {
  return (
    <section id="sectionOne" className="sectionOne-content">
      <div className="sectionOne-container">
        <div className="sectionOne-left">
          <h1 className="sectionOne-h1">Sua escola de enfermagem de confiança em Simões Filho</h1>
          <p className="sectionOne-p">Com mais de 30 anos de experiência, construímos uma reputação sólida na formação de profissionais de enfermagem qualificados, oferecendo cursos técnicos adaptados às suas necessidades.</p>
          <div className="sectionOne-cta">
            <button className="sectionOne-btn">
              Explore nossos cursos
            </button>
            <div className="rating-box">
              <div className="stars">★★★★★</div>
              <span>Mais de 2000+ alunos</span>
            </div>
          </div>
          <div className="features">
            <div className="feature-item">
              <span className="check-icon">✓</span>
              Atendimento 24/7
            </div>
            <div className="feature-item">
              <span className="check-icon">✓</span>
              Professores certificados
            </div>
          </div>
        </div>
        <div className="sectionOne-right">
          <img className='sectionOne-img' src={Sala} alt="Sala de Aula" />
        </div>
      </div>
    </section>
  )
}

export default SectionOne