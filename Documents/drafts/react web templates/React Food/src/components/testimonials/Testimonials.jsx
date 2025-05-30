import SectionTitle from '../title/SectionTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Stars from "../stars/Stars";
import Quote from "../../assets/quote.svg";
import { testimonialItem } from "../../Data";

import 'swiper/scss';
import 'swiper/scss/pagination';
import './testimonials.scss';

const Testimonials = () => {
  return (
    <section className="testimonials section">
        <SectionTitle subtitle='Testimonials' title={<>What Our Awesome <span>Clients Say</span> About Us</>} />
        <Swiper 
        slidesPerView={1}
        loop={true}
        grabCursor={true} 
        spaceBetween={10}
        pagination={{
          clickable: true
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          }
        }}
        modules={[Pagination]} 
        className='container'>
          {testimonialItem.map(({img, name, description, stars}, index) => {
            return (
               <SwiperSlide 
               className='testimonials-item'
               key={index}>
                <div className="testimonials-bg">
                  <img src={Quote} alt="" className="testimonials-quote" />
                  <div className="testimonials-data">
                    <img src={img} alt="" className="testimonials-img" />
                    <div>
                      <h3 className="testimonials-name">{name}</h3>
                      <p className="testimonials-profile">Customer</p>
                    </div>
                  </div>
                      <p className="testimonials-description">{description}</p>
                      <Stars stars={stars} />
                </div>
               </SwiperSlide>
          );
          })}
        </Swiper>
    </section>
  )
}
export default Testimonials