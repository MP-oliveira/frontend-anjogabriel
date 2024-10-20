
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Foto1 from '../assets/Foto1.jpg'
import Foto2 from '../assets/Foto2.jpg'
import Foto3 from '../assets/Foto3.jpg'

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <Slider {...settings}>
      <div>
        <img src={Foto1} alt="Description 1" />
      </div>
      <div>
        <img src={Foto2} alt="Description 2" />
      </div>
      <div>
        <img src={Foto3} alt="Description 2" />
      </div>
    </Slider>
  );
};

export default Carousel;
