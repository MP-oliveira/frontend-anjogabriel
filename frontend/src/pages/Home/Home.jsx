import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import SectionOne from '../SectionOne/SectionOne';
import SectionTwo from '../SectionTwo/SectionTwo';
import SectionThree from '../SectionThree/SectionThree';
import SectionFour from '../SectionFour/SectionFour';
import Footer from '../../components/Footer/Footer';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    // Verifica se há uma seção para rolar automaticamente ao carregar a página
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.state]);

  return (
    <div>
      <SectionOne />
      <div id="sectionTwo">
        <SectionTwo />
      </div>
      <div id="sectionThree">
        <SectionThree />
      </div>
      <div id="sectionFour">
        <SectionFour />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
