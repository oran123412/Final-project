import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./usersUploads.css";
import { Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/ROUTES";
import CardComponent from "../../components/CardComponent";
import { toast } from "react-toastify";
import LoginContext from "../../store/loginContext";

const UsersUploads = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const { login } = useContext(LoginContext);

  useEffect(() => {
    const fetchBookImages = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/cards");
        const booksData = response.data;

        const processedBooks = booksData.map((book) => ({
          ...book,
          liked: login && login._id ? book.likes.includes(login._id) : false,
        }));

        setBooks(processedBooks);
      } catch (error) {}
    };

    fetchBookImages();
  }, [login]);
  const handleLikeCard = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/cards/${id}`
      );
      if (response.status === 200) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === id
              ? { ...book, liked: !book.liked, likes: response.data.likes }
              : book
          )
        );
      }
    } catch (err) {}
  };

  const handleCardClick = (bookId) => {
    navigate(`${ROUTES.CARDSPAGE}/${bookId}`);
  };

  const handleEditCard = (id) => {
    navigate(`${ROUTES.EDITCARD}/${id}`);
  };

  let isCallInProgress = false;
  const handleCallClick = (id) => {
    if (isCallInProgress) return;

    const cardItem = books.find((item) => item._id === id);

    if (cardItem) {
      isCallInProgress = true;

      toast.info(`Call now to: ${cardItem.phone}`, {
        onClose: () => {
          isCallInProgress = false;
        },
        autoClose: 5000,
      });
    } else {
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/cards/${id}`
      );
      if (response.status === 200) {
        const updatedDataFromServer = books.filter((card) => card._id !== id);

        setBooks(updatedDataFromServer);
      }
    } catch (error) {}
  };

  return (
    <div className="user-uploads-container users-uploads-specific">
      <h2 className="user-uploads-title">User Uploaded Books</h2>

      <Swiper
        className="book-swiper users-uploads-swiper"
        slidesPerView={5}
        navigation={true}
        modules={[Navigation]}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          660: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3,
          },
          900: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 50,
          },
        }}
      >
        {books.map((book, index) => (
          <SwiperSlide key={book._id || index} className="book-slide">
            <div className="user-uploads-card">
              <CardComponent
                id={book._id}
                title={book.title}
                subtitle={book.description}
                img={book.image.url}
                phone={book.phone || "No Phone"}
                address={
                  book.address || {
                    city: "No City",
                    street: "No Street",
                    houseNumber: 0,
                  }
                }
                cardNumber={book.cardNumber || 0}
                liked={book.liked || false}
                onLike={() => handleLikeCard(book._id)}
                onEdit={() => handleEditCard(book._id)}
                onDelete={() => handleDeleteCard(book._id)}
                onCall={() => handleCallClick(book._id)}
                onClick={() => handleCardClick(book._id)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default UsersUploads;
