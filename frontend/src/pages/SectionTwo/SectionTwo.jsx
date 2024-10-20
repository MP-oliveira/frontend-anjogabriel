import './SectionTwo.css';
import Foto1 from '../../assets/foto1.jpg';
import Foto7 from '../../assets/foto7.jpg';
import Foto3 from '../../assets/foto3.jpg';
import Foto8 from '../../assets/foto8.jpg';
import Foto5 from '../../assets/foto5.jpg';
import Foto6 from '../../assets/foto6.jpg';

const SectionTwo = () => {
  return (
    <section id="sectionTwo" className="about-us">
      <div className="about-us-card">
        <img src={Foto3} alt="Escola de Enfermagem Anjo Gabriel" className="about-us-image" />
        <div className="about-us-card-text"></div>
      </div>
      <div className="about-us-content">
        <div className="about-us-text">
          <h2>Sobre Nós</h2>
          <p>
            Na Escola de Enfermagem Anjo Gabriel, formamos profissionais capacitados para transformar vidas. Nosso compromisso é oferecer um ensino de qualidade que combina teoria sólida e aulas práticas, permitindo que os alunos desenvolvam habilidades essenciais para a profissão.

            Contamos com um corpo docente experiente que proporciona suporte contínuo, garantindo que cada estudante tenha a orientação necessária para sua formação.

            Junte-se a nós e construa uma carreira de sucesso! Aqui,
          </p>
        </div>
        <div className="card">
          <div className="carousel">
            <img src={Foto1} alt="Escola de Enfermagem Anjo Gabriel" className="about-us-image" />
            <img src={Foto7} alt="Escola de Enfermagem Anjo Gabriel" className="about-us-image" />
            <img src={Foto8} alt="Escola de Enfermagem Anjo Gabriel" className="about-us-image" />
          </div>
          <div className="carousel1">
            <img src={Foto1} alt="Escola de Enfermagem Anjo Gabriel" className="about-us-image" />
            <img src={Foto7} alt="Escola de Enfermagem Anjo Gabriel" className="about-us-image" />
            <img src={Foto8} alt="Escola de Enfermagem Anjo Gabriel" className="about-us-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionTwo;
