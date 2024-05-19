import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../BooksDetailPage/BooksDetailPage.css";
import BooksSwiperBooksDetail from "../BooksDetailPage/BooksSwiperBooksDetail";
import { IdItemContext } from "../../store/idItemContext";
import { number } from "joi";

const CardsPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const { setCartItems } = useContext(IdItemContext);
  const { id } = useParams();
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/cards/${id}`
        );
        setSelectedCard(response.data);
      } catch (error) {}
    };

    fetchBookDetails();
  }, []);
  if (!selectedCard) {
    return <div>Loading book details...</div>;
  }
  const formatAuthors = (authorsArray) =>
    authorsArray?.join(", ") || "Unknown Author";
  const formatISBNs = (identifiers) =>
    identifiers
      ? identifiers
          .map((identifier) => `${identifier.type}: ${identifier.identifier}`)
          .join(", ")
      : "ISBN not available";
  const handleAddToCartClick = () => {
    if (selectedCard) {
      setCartItems((prevItems) => [...prevItems, selectedCard]);
    }
  };
  const currencyCode = "\u20AA";
  const cleanAndTrimDescription = (description) => {
    const cleanedDescription = selectedCard.description.replace(/<[^>]+>/g, "");
    return cleanedDescription;
  };

  return (
    <>
      <div className="book-cover-container">
        {selectedCard.image && selectedCard.image.url && (
          <div className="bgImage-container">
            <img
              src={selectedCard.image.url}
              alt={`Cover of ${selectedCard.title}`}
              className="bgImage"
            />
          </div>
        )}
        {selectedCard.image && selectedCard.image.url && (
          <img
            src={selectedCard.image.url}
            alt={`Cover of ${selectedCard.title}`}
            className="frontImage"
          />
        )}
        <div className="cover-content">
          <h1>{selectedCard.title}</h1>
          {selectedCard.subtitle && <p>Subtitle: {selectedCard.subtitle}</p>}
          {selectedCard.description && (
            <p>Description: {selectedCard.description}</p>
          )}
          {selectedCard.phone && <p>Phone: {selectedCard.phone}</p>}
          {selectedCard.email && <p>Email: {selectedCard.email}</p>}

          {selectedCard.address && (
            <p>
              Address:{" "}
              {`${selectedCard.address.street} ${selectedCard.address.houseNumber}, ${selectedCard.address.city}, ${selectedCard.address.state}, ${selectedCard.address.country}`}
            </p>
          )}
        </div>
      </div>

      <p style={{ paddingLeft: "20px" }}>
        Price: {currencyCode}
        {selectedCard.price}
      </p>

      <br />

      <BooksSwiperBooksDetail />
    </>
  );
};

export default CardsPage;
