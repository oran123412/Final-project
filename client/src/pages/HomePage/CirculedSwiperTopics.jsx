import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./circuledSwiperTopics.css";
import image1 from "../../images/book&moon.jpg";
import image2 from "../../images/history.jpg";
import image3 from "../../images/angel.jpg";
import image4 from "../../images/castle&moon.jpg";
import image5 from "../../images/flyingStructre.jpg";
import image6 from "../../images/shiningMoon.jpg";
import image7 from "../../images/food.jpg";
import image8 from "../../images/running.jpg";

const CirculedSwiperTopics = () => {
  const images = [
    { src: image1, title: "Graphic Novels", id: "graphic novels" },
    { src: image2, title: "History", id: "history" },
    { src: image3, title: "Action Superpower", id: "action superpower" },
    { src: image4, title: "Fantasy", id: "fantasy" },
    { src: image5, title: "Historical Fiction", id: "historical fiction" },
    { src: image6, title: "Literary Fiction", id: "literary fiction" },
    { src: image7, title: "Cookbooks", id: "cookbooks" },
    { src: image8, title: "Health & Fitness", id: "health & fitness" },
  ];
  const refs = useRef(images.map(() => React.createRef()));

  const handleNavigationPage = (index) => {
    const elementRef = refs.current[index];
    if (elementRef.current) {
      window.location.hash = images[index].id.replace(/ /g, "-").toLowerCase();
    } else {
    }
  };
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      slidesPerView={5}
      navigation
      className="circuledImagesSwiper"
      breakpoints={{
        320: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 4,
        },
        1024: {
          slidesPerView: 5,
        },
      }}
      style={{
        height: "22vh",
        width: "98vw",
      }}
    >
      {images.map(({ src, title, id }, index) => (
        <SwiperSlide key={src}>
          <div
            className="images-container"
            ref={refs.current[index]}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
            onClick={() => handleNavigationPage(index)}
          >
            <img
              src={src}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                maxWidth: "100%",
              }}
              alt={title}
            />
            <h1 style={{ color: "black", fontSize: "15px" }}>{title}</h1>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CirculedSwiperTopics;
