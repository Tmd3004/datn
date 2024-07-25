import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import images from "../../assets/images/images";
import Image from "../Image/Image";
import "./CustomSlider.scss";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const CustomSlider = () => {
  return (
    <div className="wrapper">
      <Swiper
        modules={[Navigation]}
        slidesPerView={4}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
      >
        <SwiperSlide className="swiper-slide">
          <Image
            src={images.noImage}
            alt="image slider"
            className="slider-image"
          />
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <Image
            src={images.noImage}
            alt="image slider"
            className="slider-image"
          />
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <Image
            src={images.noImage}
            alt="image slider"
            className="slider-image"
          />
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <Image
            src={images.noImage}
            alt="image slider"
            className="slider-image"
          />
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <Image
            src={images.noImage}
            alt="image slider"
            className="slider-image"
          />
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <Image
            src={images.noImage}
            alt="image slider"
            className="slider-image"
          />
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <Image
            src={images.noImage}
            alt="image slider"
            className="slider-image"
          />
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <Image
            src={images.noImage}
            alt="image slider"
            className="slider-image"
          />
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <Image
            src={images.noImage}
            alt="image slider"
            className="slider-image"
          />
        </SwiperSlide>
      </Swiper>

      <IoIosArrowBack className="swiper-button-prev" />
      <IoIosArrowForward className="swiper-button-next" />
    </div>
  );
};

export default CustomSlider;
