import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import image1 from "../../images/frame.png";
import "./GalleryOfSevenImages.css";

const GalleryOfSevenImages = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      slidesPerView={1}
      style={{ height: "50vh", width: "99vw" }}
    >
      <SwiperSlide className="swiperOfGallery">
        <div
          style={{
            width: "100vw",
            height: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundSize: "cover",
            backgroundImage: `url(${image1})`,
            backgroundPosition: "center",
          }}
        >
          <h1 style={{ color: "black", fontSize: "4.5vw" }}>
            BOOK STORE ONLINE
          </h1>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default GalleryOfSevenImages;
