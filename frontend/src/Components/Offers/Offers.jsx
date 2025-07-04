import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Offers.css';
import exclusive1 from '../Assets/exclusive_image1.png';
import exclusive2 from '../Assets/exclusive_image2.png';
import exclusive3 from '../Assets/exclusive_image3.png';

const slides = [
  { image: exclusive1, title: "Exclusive", subtitle: "Offers For You", description: "On Best Sellers Product" },
  { image: exclusive2, title: "Limited Time", subtitle: "Big Discounts", description: "Up to 50% Off" },
  { image: exclusive3, title: "New Arrivals", subtitle: "Fresh Styles", description: "Explore the Latest Trends" },
];

const Offers = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      // navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop={true}
      className="offers-slider"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="offers-slide">
            <div className="offers-left">
              <h1>{slide.title}</h1>
              <h1>{slide.subtitle}</h1>
              <p>{slide.description}</p>
              <button>Shop Now</button>
            </div>
            <div className="offers-right">
              <img src={slide.image} alt="Offer" />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Offers;

