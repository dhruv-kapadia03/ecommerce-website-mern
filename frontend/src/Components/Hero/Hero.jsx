import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Hero.css';
import arrow_icon from '../Assets/arrow.png';
import hero_image1 from '../Assets/hero_image1.png'; 
import hero_image2 from '../Assets/hero_image2.png'; 
import hero_image3 from '../Assets/hero_image3.png'; 

const slides = [
  { image: hero_image1, title: "EXPLORE THE LATEST", text1: "Styles", text2: "For Everyone" },
  { image: hero_image2, title: "FIND YOUR LOOK", text1: "New Trends", text2: "Every Season" },
  { image: hero_image3, title: "SHOP YOUR STYLE", text1: "Best Picks", text2: "For Everyone" },
];

const Hero = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      // navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop={true}
      className="hero-slider"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="hero-slide">
            <div className="hero-left">
              <h2>{slide.title}</h2>
              <div>
                <p>{slide.text1}</p>
                <p>{slide.text2}</p>
              </div>
              <div className="hero-latest-btn">
                <div>Latest Collections</div>
                <img src={arrow_icon} alt="" />
              </div>
            </div>
            <div className="hero-right">
              <img src={slide.image} alt="Hero" />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Hero;

