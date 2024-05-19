import axios from "axios";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import ROUTES from "../../routes/ROUTES";
import { useNavigate } from "react-router-dom";
import "../../components/CardsComponent.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Typography } from "@mui/material";
import "./SwipersOfMainBooks.css";
import cart2 from "../../images/cart2.png";
import { useContext } from "react";
import LoginContext from "../../store/loginContext";
import { IdItemContext } from "../../store/idItemContext";
const SwipersOfMainBooks = () => {
  const { login } = useContext(LoginContext);
  const { cartItems, setCartItems } = useContext(IdItemContext);
  const [booksByCategory, setBooksByCategory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [clicked, setClicked] = useState({});
  const [visable, setVisable] = useState({});
  const [isHover, setIsHover] = useState({});
  const [isFav, setIsFav] = useState({});
  const queries = [
    "Graphic Novels",
    "History",
    "Action Superpower",
    "Fantasy",
    "Historical Fiction",
    "Literary Fiction",
    "Cookbooks",
    "Health & Fitness",
  ];

  useEffect(() => {
    const fetchBooksForAllCategories = async () => {
      setIsLoading(true);
      const categories = {};

      await Promise.all(
        queries.map(async (query) => {
          try {
            const response = await axios.get(`/api/books`, {
              params: { q: query },
            });

            if (response.data && response.data.items) {
              const processedBooks = processBooks(response.data.items);
              const booksWithFavStatus = await markFavorites(processedBooks);
              categories[query] = booksWithFavStatus;
            }
          } catch (error) {
            categories[query] = [];
          }
        })
      );

      setBooksByCategory(categories);
      setIsLoading(false);
    };

    fetchBooksForAllCategories();
  }, []);

  const fetchFavorites = async () => {
    if (login && login._id) {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/books/favorites/status-user", {
          params: { userId: login._id },
        });
        const favoriteData = response.data.reduce((acc, item) => {
          acc[item.bookId] = true;
          return acc;
        }, {});
        setIsFav(favoriteData);
      } catch (error) {}
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [login?._id]);

  const processBooks = (books) => {
    const seenBooks = new Set();
    return books
      .map((book) => {
        book.hasDiscount =
          book.volumeInfo?.pageCount && book.volumeInfo.pageCount < 150;

        return book;
      })
      .filter((book) => {
        const bookKey =
          book.volumeInfo?.title +
          "-" +
          (book.volumeInfo.authors?.join(",") || "");

        const hasValidThumbnail =
          book.volumeInfo?.imageLinks?.thumbnail &&
          book.volumeInfo.imageLinks.thumbnail !== "";

        if (!seenBooks.has(bookKey) && hasValidThumbnail) {
          seenBooks.add(bookKey);
          return true;
        }
        return false;
      });
  };

  const handleClickCard = (id) => {
    navigate(`${ROUTES.BOOKSDETAIL}/${id}`);
  };
  const markFavorites = async (books) => {
    if (!login) {
      return books.map((book) => ({ ...book, isFavorite: false }));
    }
    const userId = login._id;
    try {
      const responses = await Promise.all(
        books.map((book) =>
          axios.get(`/api/books/favorites/status`, {
            params: { userId, bookId: book.id },
          })
        )
      );

      return books.map((book, index) => ({
        ...book,
        isFavorite: responses[index].data.isFavorite,
      }));
    } catch (error) {
      return books;
    }
  };

  const fetchPrice = async (bookId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/books/detail/${bookId}`
      );
      if (response.data) {
        return { price: response.data.price };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const isItemInCart = (bookId) => {
    return cartItems.some((item) => item.id === bookId);
  };

  const handleAddToCartClick = async (e, book) => {
    e.stopPropagation();

    setClicked((prev) => {
      const index = prev.findIndex((item) => item.id === book.id);
      let newClickedState = [...prev];

      if (index === -1) {
        newClickedState.push({ id: book.id, clicked: true });
      } else {
        newClickedState.splice(index, 1);
      }

      if (login && login._id) {
        const userPrefix = login._id;
        localStorage.setItem(
          userPrefix + "_clickedItems",
          JSON.stringify(newClickedState)
        );
      }
      return newClickedState;
    });

    const priceResponse = await fetchPrice(book.id);
    if (!priceResponse || priceResponse.price === null) {
      return;
    }

    const isDiscounted = book.volumeInfo.pageCount < 150;
    const finalPrice = isDiscounted
      ? priceResponse.price * 0.8
      : priceResponse.price;

    const newItem = {
      id: book.id,
      title: book.volumeInfo.title,
      originalPrice: priceResponse.price,
      finalPrice,
      hasDiscount: isDiscounted,
    };

    setCartItems((prevItems) => {
      const itemExists = isItemInCart(book.id);
      let updatedItems;

      if (itemExists) {
        updatedItems = prevItems.filter((item) => item.id !== book.id);
      } else {
        updatedItems = [...prevItems, newItem];
      }

      if (login && login._id) {
        const userPrefix = login._id;
        localStorage.setItem(
          userPrefix + "_cartItems",
          JSON.stringify(updatedItems)
        );
      }
      return updatedItems;
    });
  };

  useEffect(() => {
    if (login && login._id) {
      const userPrefix = login._id;
      const storedCartItems = localStorage.getItem(userPrefix + "_cartItems");
      const storedClickedItems = localStorage.getItem(
        userPrefix + "_clickedItems"
      );

      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      } else {
        setCartItems([]);
      }

      if (storedClickedItems) {
        setClicked(JSON.parse(storedClickedItems));
      } else {
        setClicked([]);
      }
    } else {
      setClicked([]);
    }
  }, [login?._id]);

  const handleFavClick = async (e, bookId) => {
    e.stopPropagation();
    if (!login) {
      return;
    }
    const userId = login._id;

    setIsFav((prevFavorites) => {
      const alreadyFavored = !!prevFavorites[bookId];

      axios
        .post(`/api/books/${bookId}/${alreadyFavored ? "unlike" : "like"}`, {
          userId,
        })
        .then((response) => {})
        .catch((error) => {});
      return {
        ...prevFavorites,
        [bookId]: !alreadyFavored,
      };
    });
  };
  if (!booksByCategory) {
    return <div>Loading books...</div>;
  }

  return (
    <>
      {queries.map((query) => {
        const sanitizedId = query.replace(/ /g, "-").toLowerCase();

        const books = booksByCategory[query];
        return (
          <div key={query} id={sanitizedId}>
            <h2>{query}</h2>
            {Array.isArray(books) && books.length > 0 && (
              <Swiper
                modules={[Navigation, Pagination, Scrollbar]}
                slidesPerView={5}
                navigation
                breakpoints={{
                  900: { slidesPerView: 4 },
                  400: { slidesPerView: 2 },
                }}
              >
                {books.map((book) => {
                  const thumbnail =
                    book.volumeInfo?.imageLinks?.thumbnail ||
                    "default-thumbnail.jpg";
                  const cleanAuthors = book.volumeInfo.authors
                    ? book.volumeInfo.authors.join(" ").split(" ", 4).join(" ")
                    : "No authors listed";

                  return (
                    <SwiperSlide
                      key={book.id}
                      onClick={() => handleClickCard(book.id)}
                    >
                      <div
                        className="image-zoom-container"
                        style={{
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          width: "100%",
                          position: "relative",
                        }}
                      >
                        <img
                          src={thumbnail}
                          alt={book.volumeInfo.title}
                          className="book-image"
                        />
                        <div className="bookContainer">
                          <div
                            className="foggy-cover"
                            style={{ zIndex: 3 }}
                          ></div>
                          {login && (
                            <FavoriteIcon
                              className="favIcon"
                              style={{
                                position: "absolute",
                                zIndex: 4,
                                color: isFav[book.id] ? "red" : "black",
                              }}
                              onClick={(e) => handleFavClick(e, book.id)}
                            />
                          )}
                          <div
                            className="cartIconClass cartIcon"
                            style={{
                              position: "absolute",
                              zIndex: 4,
                              height: "25px",
                              width: "35px",
                              backgroundColor: clicked.some(
                                (item) => item.id === book.id
                              )
                                ? "green"
                                : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50%",
                              backgroundImage: `url(${cart2})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundSize: "25px 25px",
                              backgroundRepeat: "no-repeat",
                            }}
                            onClick={(e) => handleAddToCartClick(e, book)}
                          ></div>

                          <h3>
                            {book.volumeInfo.title
                              .replace(/[&:]/g, "")
                              .trim()
                              .split(" ")
                              .slice(0, 4)
                              .join(" ")}
                          </h3>

                          <p>{cleanAuthors}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>
        );
      })}
    </>
  );
};
export default SwipersOfMainBooks;
