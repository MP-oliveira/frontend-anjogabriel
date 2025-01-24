import './SectionThree.css';
import bgWaves from '../../assets/bg-waves.png';
import foto1 from '../../assets/foto1.jpg';
import foto2 from '../../assets/foto2.jpg';
import foto3 from '../../assets/foto3.jpg';
import foto4 from '../../assets/foto4.jpg';
import foto5 from '../../assets/foto5.jpg';
import foto6 from '../../assets/foto6.jpg';

const SectionThree = () => {
  const images = [
    { src: foto1, alt: 'Laboratório de Enfermagem', rotate: '-4deg', top: '0px', left: '0px' },
    { src: foto2, alt: 'Aulas Práticas', rotate: '3deg', top: '15px', left: '-10px' },
    { src: foto3, alt: 'Formatura', rotate: '-2deg', top: '-10px', left: '10px' },
    { src: foto4, alt: 'Estrutura', rotate: '4deg', top: '5px', left: '-15px' },
    { src: foto5, alt: 'Equipamentos', rotate: '-3deg', top: '-5px', left: '5px' },
    { src: foto6, alt: 'Sala de Aula', rotate: '2deg', top: '10px', left: '-5px' }
  ];

  return (
    <section 
      className="gallery-section" 
      style={{ 
        backgroundImage: `url(${bgWaves})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover'
      }}
    >
      <div className="gallery-header">
        <h1>Nossa Estrutura</h1>
        <p>Conheça nosso ambiente de aprendizado, equipado com tecnologia de ponta e espaços 
           pensados para sua formação profissional</p>
      </div>

      <div className="gallery-container">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="gallery-item"
            style={{
              transform: `rotate(${image.rotate})`,
              top: image.top,
              left: image.left
            }}
          >
            <div className="gallery-frame">
              <img src={image.src} alt={image.alt} loading="lazy" />
              <div className="gallery-overlay">
                <span>{image.alt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionThree;
