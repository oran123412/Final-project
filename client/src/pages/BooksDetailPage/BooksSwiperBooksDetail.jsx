import axios from "axios";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import "./BooksSwiperBooksDetail.css";
import ROUTES from "../../routes/ROUTES";
import { useNavigate } from "react-router-dom";

const BooksSwiperBooksDetail = () => {
  const [suggestBooks, setSuggestBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const queries = [
        "liz tomforde",
        "Raina Telgemeier",
        "Joyce Rachel",
        "Rosamunde Pilcher",
        "Dr. Seuss",
        "Dav Pilkey",
        "Rick Riordan",
      ];
      const randomQueries = queries[Math.floor(Math.random() * queries.length)];

      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/books/google-swiper-detail`,
          {
            params: { q: randomQueries },
          }
        );
        if (data && data.items) {
          const seenBooks = new Set();
          const uniqueBooks = data.items.filter((book) => {
            if (
              book.volumeInfo &&
              book.volumeInfo.imageLinks?.thumbnail &&
              Array.isArray(book.volumeInfo.authors)
            ) {
              const bookKey = `${
                book.volumeInfo.title
              }-${book.volumeInfo.authors.join(",")}`;
              if (!seenBooks.has(bookKey)) {
                seenBooks.add(bookKey);
                return true;
              }
            }
            return false;
          });
          setSuggestBooks(uniqueBooks);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (isLoading) {
    return <div>Loading books...</div>;
  }

  const cleanAndTrimTitle = (title) => {
    const MAX_WORDS = 4;
    const cleanedTitle = title.replace(/[\/\:\,\.]/g, "");
    const words = cleanedTitle.split(" ");
    return words.length > MAX_WORDS
      ? `${words.slice(0, MAX_WORDS).join(" ")}...`
      : cleanedTitle;
  };

  const handleClickCard = (id) => {
    navigate(`${ROUTES.BOOKSDETAIL}/${id}`);
  };
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, Autoplay]}
      slidesPerView={5}
      spaceBetween={9}
      navigation
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      breakpoints={{
        400: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 5,
        },
      }}
      style={{
        height: "70vh",
        width: "99vw",
        marginTop: "70px",
      }}
    >
      {suggestBooks.map((book) => (
        <SwiperSlide key={book.id}>
          <div
            className="booksSlider"
            onClick={() => handleClickCard(book.id)}
            style={{ textAlign: "center" }}
          >
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
              style={{
                width: "auto",
                height: "35vh",
                margin: "25px auto ",
              }}
            />
            <h3 style={{ height: "40px" }}>
              {cleanAndTrimTitle(book.volumeInfo.title)}
            </h3>
            <p
              style={{
                marginTop: "20px",
                height: "30px",
              }}
            >
              {book.volumeInfo.authors?.join(", ")}
            </p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BooksSwiperBooksDetail;
