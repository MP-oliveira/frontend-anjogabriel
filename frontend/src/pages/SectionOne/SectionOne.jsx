import './SectionOne.css'
import Sala from '../../assets/sala.jpg'

const SectionOne = () => {
  return (
    <div className="sectionOne-content">
      <div className="sectionOne-left">
        <h1 className="sectionOne-h1">Formando os Anjos da Saúde</h1>
        <p className="sectionOne-p">Prepare-se para uma carreira gratificante na área da saúde com nossos cursos de 
          enfermagem com excelência e compaixão. Oferecemos uma formação completa e prática, focada em atender às
           necessidades do mercado de trabalho, e ensinando aos alunos o atendimento humanizado ao paciente.</p>
        <button className="sectionOne-btn">
          <a>
            Explore Nossos Cursos
          </a>
        </button>
      </div>
      <div className="sectionOne-right">
        <img className='sectionOne-img' src={Sala} alt="Sala de Aula" />
      </div>
    </div>
  )
}

export default SectionOne