import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import loginContext from "../../store/loginContext";
import { IdItemContext } from "../../store/idItemContext";
import axios from "axios";
import { useEffect, useState } from "react";
import "./LikedBooksSwiper.css";
import ROUTES from "../../routes/ROUTES";

const LikedBooksSwiper = ({ books }) => {
  const { login } = useContext(loginContext);
  const [isFav, setIsFav] = useState({});
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`${ROUTES.BOOKSDETAIL}/${id}`);
  };

  const handleFavClick = async (e, book) => {
    e.stopPropagation();
    if (!login) {
      return;
    }

    const bookId = book.id;
    const userId = login._id;

    const currentlyFavored = !!isFav[bookId];
    const newFavoredStatus = !currentlyFavored;

    setIsFav((prev) => ({
      ...prev,
      [bookId]: newFavoredStatus,
    }));

    axios
      .post(`/api/books/${bookId}/${newFavoredStatus ? "like" : "unlike"}`, {
        userId: login._id,
      })
      .then((response) => {
        if (
          response.data.modifiedCount === 0 &&
          response.data.matchedCount === 0
        ) {
        } else {
          window.location.reload();
        }
      })
      .catch((error) => {
        setIsFav((prev) => ({
          ...prev,
          [bookId]: currentlyFavored,
        }));
      });
  };

  useEffect(() => {
    const initialFavState = books.reduce((acc, book) => {
      acc[book.id] = book.likes;
      return acc;
    }, {});

    setIsFav(initialFavState);
  }, [books]);
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      slidesPerView={5}
      navigation
      pagination={{ clickable: true }}
      style={{ height: "60vh" }}
      breakpoints={{
        400: {
          slidesPerView: 2,
        },
      }}
    >
      {books.map((book) => (
        <SwiperSlide key={book._id} onClick={() => handleCardClick(book.id)}>
          <div style={{ position: "relative", textAlign: "center" }}>
            <img
              src={book.imageLinks.thumbnail}
              alt={book.title}
              className="liked-book-image"
            />
            <h3>{book.title}</h3>
            <p>{book.subtitle}</p>
            {login && (
              <FavoriteIcon
                className="liked-book-fav-icon"
                onClick={(e) => handleFavClick(e, book)}
              />
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default LikedBooksSwiper;
