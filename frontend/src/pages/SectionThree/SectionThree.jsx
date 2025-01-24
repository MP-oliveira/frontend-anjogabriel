import './SectionThree.css';
import Escola1 from '../../assets/escola1.png';
import Escola2 from '../../assets/escola2.png';
import Escola3 from '../../assets/escola3.png';
import Escola4 from '../../assets/escola4.png';

const SectionThree = () => {
  return (
    <div className="about-us">
      <div className="about-us-card">
        <img src={Escola1} alt="Fachada da Escola" className="about-us-image" />
      </div>
      
      <div className="about-us-content">
        <div className="about-us-text">
          <h2>Nossa História</h2>
          <p>
            Há 30 anos, a Escola de Enfermagem AnjoGabriel iniciou sua jornada em 
            Simões Filho, Bahia, com o objetivo de formar profissionais de excelência.
          </p>
          <p>
            Desde então, somos referência na formação técnica em enfermagem, 
            contribuindo para o desenvolvimento da saúde em nossa região.
          </p>
          <p>
            Com mais de 5.000 profissionais formados, nossos alunos hoje atuam 
            em diversas instituições de saúde pelo Brasil.
          </p>
        </div>
        
        <div className="card">
          <div className="carousel">
            <img src={Escola2} alt="Laboratório" />
            <img src={Escola3} alt="Sala de Aula" />
            <img src={Escola4} alt="Formatura" />
            <img src={Escola2} alt="Laboratório" />
            <img src={Escola3} alt="Sala de Aula" />
            <img src={Escola4} alt="Formatura" />
          </div>
          <div className="carousel1">
            <img src={Escola2} alt="Laboratório" />
            <img src={Escola3} alt="Sala de Aula" />
            <img src={Escola4} alt="Formatura" />
            <img src={Escola2} alt="Laboratório" />
            <img src={Escola3} alt="Sala de Aula" />
            <img src={Escola4} alt="Formatura" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionThree;
