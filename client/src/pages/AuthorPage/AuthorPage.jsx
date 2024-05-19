import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import "./AuthorPage.css";
import defaultBookImage from "../../images/defaultBookImage.jpg";
import BasicDateCalendar from "./Calendar";
import { Margin } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import ROUTES from "../../routes/ROUTES";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "./AuthorPageResponsive.css";

const AuthorPage = () => {
  const { title } = useParams();
  const [activeSlide, setActiveSlide] = useState(0);
  const [hasBooksToShow, setHasBooksToShow] = useState(true);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [author, setAuthor] = useState({
    isLoading: true,
    data: {},
    error: null,
  });
  const [authorBooks, setAuthorBooks] = useState([]);
  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      if (width <= 900 && width > 480) {
        setSlidesPerView(2);
      } else if (width <= 480) {
        setSlidesPerView(1);
      } else {
        setSlidesPerView(3);
      }
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => {
      window.removeEventListener("resize", updateSlidesPerView);
    };
  }, []);
  useEffect(() => {
    const fetchAuthorBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/books/author's-books",
          {
            params: {
              q: `inauthor:${title}`,
              orderBy: "newest",
              key: process.env.REACT_APP_GOOGLE_BOOKS_API_KEY,
            },
          }
        );

        if (response.data && response.data.items) {
          const normalize = title.toLowerCase();
          const specificAuthor = response.data.items.filter((book) =>
            book.volumeInfo.authors.some(
              (author) => author.toLowerCase() === normalize
            )
          );

          const seenBooks = new Set();
          const uniqueBooks = response.data.items.filter((book) => {
            if (book.volumeInfo && Array.isArray(book.volumeInfo.authors)) {
              const bookKey = `${
                book.volumeInfo.title
              }-${book.volumeInfo.authors.join(",")}`;

              if (!seenBooks.has(bookKey) && specificAuthor.includes(book)) {
                seenBooks.add(bookKey);

                return true;
              }
            }

            return false;
          });

          setAuthorBooks(uniqueBooks);
          if (uniqueBooks.length > 0) {
            setHasBooksToShow(true);
          }
        } else {
          setHasBooksToShow(false);
          setAuthorBooks([]);
        }
      } catch (error) {
        setAuthorBooks([]);
      }
    };

    fetchAuthorBooks();
  }, [title]);
  useEffect(() => {
    const fetchAuthorVideos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/books/youtube",
          {
            params: {
              q: `${title} book review`,
              part: "snippet",
              maxResults: 5,
              type: "video",
              key: process.env.REACT_APP_YOUTUBE_API_KEY,
            },
          }
        );

        if (response.data && response.data.items) {
          setVideos(response.data.items);
        } else {
          setVideos([]);
        }
      } catch (error) {
        setVideos([]);
      }
    };

    fetchAuthorVideos();
  }, [title]);

  useEffect(() => {
    const fetchAuthor = async () => {
      const baseUrl = "http://localhost:3001/api/books/wikipedia";
      const authorUrl = `${baseUrl}?action=query&format=json&prop=pageimages|info|extracts&titles=${encodeURIComponent(
        title
      )}&pithumbsize=500&inprop=contentmodel|pageid&exintro=true&explaintext=true&origin=*`;

      try {
        const authorResponse = await fetch(authorUrl);
        const authorData = await authorResponse.json();

        if (!authorData.query || !authorData.query.pages) {
          throw new Error("Invalid API response: Missing author information");
        }
        const pages = authorData.query.pages;
        const authorPage = Object.values(pages)[0];

        if (authorPage.thumbnail) {
          const authorDetails = {
            title: authorPage.title,
            imageUrl: authorPage.thumbnail.source,
            summary: authorPage.extract,
          };

          setAuthor({ isLoading: false, data: authorDetails, error: null });
        } else {
          setAuthor({ isLoading: false, data: {}, error: null });
        }
      } catch (error) {
        setAuthor({ isLoading: false, data: {}, error: error.toString() });
      }
    };

    fetchAuthor();
  }, []);

  if (author.isLoading) return <div>Loading...</div>;
  if (author.error) return <div>Error loading author: {author.error}</div>;
  if (!author.data.title) return <div>No author found.</div>;

  const handleChange = (index) => {
    setActiveSlide(index);
  };
  const handleAuthorBookClick = (bookId) => {
    navigate(`${ROUTES.BOOKSDETAIL}/${bookId}`);
  };

  return (
    <>
      <h1 style={{ textAlign: "center", textDecoration: "underline" }}>
        Author's lectures and information
      </h1>
      <div className="container-page">
        <div className="calendarAndData">
          <BasicDateCalendar
            style={{
              width: "100vw",
              height: "150vh",
              position: "absolute",
            }}
          />

          <div className="mask">
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              {author.data.title}
            </div>
            <p style={{ textAlign: "center" }}>{author.data.summary}</p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "50px",
          }}
        >
          <div className="book-navigation">
            {authorBooks.map((_, index) => (
              <button
                key={index}
                className={index === activeSlide ? "active" : ""}
                onClick={() => handleChange(index)}
              ></button>
            ))}
          </div>
          <div className="book-display">
            {authorBooks.map((book, index) => (
              <div
                key={book.id}
                className="slide-wrapper"
                onClick={() => handleAuthorBookClick(book.id)}
                style={{
                  visibility: index === activeSlide ? "visible" : "hidden",
                  position: index === activeSlide ? "static" : "absolute",
                  left: index === activeSlide ? "0" : "-9999px",
                }}
              >
                <img
                  src={
                    book.volumeInfo.imageLinks?.thumbnail || defaultBookImage
                  }
                  alt={`Cover of ${book.volumeInfo.title}`}
                  height={190}
                  width={125}
                />
                <h3>
                  {book.volumeInfo.title.split(" ").slice(0, 5).join(" ")}
                </h3>
                <p>{book.volumeInfo.authors?.[0]}</p>
              </div>
            ))}
          </div>
        </div>
        <h1 style={{ marginTop: "10px", textAlign: "center" }}>
          Book reviews:
        </h1>
        <Swiper slidesPerView={slidesPerView} pagination={{ clickable: true }}>
          {videos.map((video) => (
            <SwiperSlide key={video.id.videoId}>
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    <img
                      className="image-videos-slider"
                      style={{
                        maxWidth: "70%",
                        height: "auto",
                        maxHeight: "100%",
                        display: "block",
                        margin: "0 auto",
                      }}
                      src={video.snippet.thumbnails.high.url}
                      alt={video.snippet.title.replace(/;/g, "")}
                    />

                    <h3 style={{ margin: "0.5em 0" }}>
                      {video.snippet.title
                        .replace(/[&#;]/g, "")
                        .split(" ")
                        .slice(0, 5)
                        .join(" ")}
                    </h3>
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default AuthorPage;
