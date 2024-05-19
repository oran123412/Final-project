import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RecipeReviewCard from "../../components/CardsComponent";
import * as React from "react";
import { useContext } from "react";
import { SearchContext } from "../../store/searchContext";
import SwipersOfMainBooks from "./SwipersOfMainBooks";
import GalleryOfSevenImages from "./GalleryOfSevenImages";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import AuthorsSlider from "../AuthorPage/AuthorsSlider";
import CirculedSwiperTopics from "./CirculedSwiperTopics";
import backgroundImage from "../../images/backgroundHeader.jpg";
import UsersUploads from "./UsersUploads";
import "./HomePage.css";
import "swiper/css";
import "swiper/css/navigation";
import SwiperCore from "swiper/core";

SwiperCore.use([Navigation, Pagination, Scrollbar]);
const HomePage = () => {
  const [books, setBooks] = useState([]);
  const { search } = useContext(SearchContext);

  const fetchBooks = async () => {
    if (!search) return;

    try {
      const response = await axios.get("/api/books/google-books", {
        params: { q: search, orderBy: "newest" },
      });
      const booksFromAPI = response.data.items.map((book) => ({
        ...book,
        id: book.id,
        isFromGoogleAPI: true,
      }));

      const uploadsResponse = await axios.get(
        "http://localhost:3001/api/cards"
      );
      const booksFromUploads = uploadsResponse.data.map((upload) => ({
        ...upload,
        id: upload._id,
        volumeInfo: {
          title: upload.title || "No Title",
          imageLinks: {
            thumbnail: upload.image.url || "/path/to/default/image.jpg",
          },
          authors: [upload.author || "Unknown Author"],
        },
        isFromGoogleAPI: false,
      }));

      const combinedBooks = [...booksFromAPI, ...booksFromUploads];

      const uniqueBooksMap = new Map();
      const seenTitles = new Set();

      combinedBooks.forEach((book) => {
        if (
          !uniqueBooksMap.has(book.id) &&
          !seenTitles.has(book.volumeInfo.title)
        ) {
          uniqueBooksMap.set(book.id, book);
          seenTitles.add(book.volumeInfo.title);
        }
      });

      setBooks(Array.from(uniqueBooksMap.values()));
    } catch (error) {
      setBooks([]);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search]);

  return (
    <div
      id="main"
      style={{
        padding: 10,
        paddingTop: 0,
        marginLeft: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          display: !!search ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          width: "100%",
          margin: "auto",
          height: "500px",
          transition: "opacity 0.5s ease-in-out",
          overflow: "hidden",
          borderRadius: " 0 0 300px 300px",
          border: "solid 1px RGB(64, 103, 161)",
          borderTop: "none",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="searchSwiper"
          style={{ position: "relative", width: "100%" }}
        >
          <Swiper
            modules={[Navigation, Pagination, Scrollbar]}
            slidesPerView={4}
            navigation={true}
            breakpoints={{
              320: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              900: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            style={{
              width: "75%",
              height: "100%",
              position: "relative",
              margin: "0 auto",
            }}
          >
            {books.map((book, index) => (
              <SwiperSlide key={`${book.id}-${index}`}>
                <RecipeReviewCard book={book} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {!search && <GalleryOfSevenImages />}
      <div style={{ marginTop: "60px" }}>
        <CirculedSwiperTopics />
      </div>
      <div style={{ marginTop: "110px" }}>
        <SwipersOfMainBooks />
      </div>
      <UsersUploads />
      <AuthorsSlider />
    </div>
  );
};

export default HomePage;
