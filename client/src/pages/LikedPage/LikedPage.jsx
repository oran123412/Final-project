import React, { useContext, useState, useEffect } from "react";
import { Typography, Grid } from "@mui/material";
import axios from "axios";
import CardComponent from "../../components/CardComponent";
import ROUTES from "../../routes/ROUTES";
import loginContext from "../../store/loginContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import LikedBooksSwiper from "./LikedBooksSwiper";
import "./LikedPage.css";

const LikedPage = () => {
  const [userLikedCards, setUserLikedCards] = useState([]);
  const [dataFromServer, setDataFromServer] = useState([]);
  const [booksFromServer, setBooksFromServer] = useState([]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { login } = useContext(loginContext);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cardsResponse, booksResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/cards"),
          axios.get("http://localhost:3001/api/books/all"),
        ]);

        const allCards = cardsResponse.data;
        const allBooks = booksResponse.data;

        const userId = login ? login._id : undefined;

        const likedCards = allCards
          .filter((card) => card.likes.includes(userId))
          .map((card) => ({
            ...card,
            liked: card.likes.includes(userId),
          }));

        const likedBooks = allBooks.filter((book) => {
          return book.likes.includes(userId);
        });

        setUserLikedCards(likedCards);
        setDataFromServer(allCards);
        setBooksFromServer(likedBooks);
      } catch (error) {}
      setLoading(false);
    };

    fetchData();
  }, [login]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!userLikedCards.length && !dataFromServer.length) {
    return <Typography>No liked cards found.</Typography>;
  }

  const handleDeleteCard = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/cards/${id}`
      );
      if (response.status === 200) {
        const updatedDataFromServer = dataFromServer.filter(
          (card) => card._id !== id
        );

        setDataFromServer(updatedDataFromServer);
        window.location.reload();
      }
    } catch (error) {}
  };

  const handleEditCard = (id) => {
    navigate(`${ROUTES.EDITCARD}/${id}`);
  };

  const handleLikeCard = async (id) => {
    try {
      await axios.patch("http://localhost:3001/api/cards/" + id);
      setUserLikedCards((prevLikedCards) =>
        prevLikedCards.filter((card) => card._id !== id)
      );
      setDataFromServer((cDataFromServer) =>
        cDataFromServer.map((card) =>
          card._id === id ? { ...card, liked: !card.liked } : card
        )
      );
    } catch (err) {}
  };

  const handleCardClick = (id) => {
    navigate(`${ROUTES.CARDSPAGE}/${id}`);
  };

  const handleCallClick = (id) => {
    if (isCalling) return;

    setIsCalling(true);

    const card = dataFromServer.find((item) => item._id === id);

    if (card && card.phone) {
      toast.info(`Call now to: ${card.phone}`, {
        onClose: () => setIsCalling(false),
        autoClose: 5000,
      });

      const updatedData = dataFromServer.map((item) =>
        item._id === id ? { ...item, called: true } : item
      );
      setDataFromServer(updatedData);
    } else {
      setIsCalling(false);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Typography variant="h4" sx={{ textDecoration: "underline" }}>
          Your Liked Cards
        </Typography>
      </Box>
      <Grid container spacing={2} sx={{ mt: 5 }}>
        {userLikedCards.map((item, index) => (
          <Grid item lg={3} md={6} xs={12} key={`likedCard${index}`}>
            <div className="card-container">
              <CardComponent
                id={item._id}
                title={item.title}
                subtitle={item.subtitle}
                img={item.image.url}
                phone={item.phone}
                address={item.address}
                cardNumber={item.bizNumber}
                liked={item.liked}
                onDelete={() => handleDeleteCard(item._id)}
                onEdit={handleEditCard}
                onLike={handleLikeCard}
                onClick={handleCardClick}
                onCall={handleCallClick}
                defaultColor="error"
              />
            </div>
          </Grid>
        ))}
      </Grid>
      {booksFromServer.length > 0 && (
        <>
          <Typography
            variant="h4"
            sx={{ mt: 5, textDecoration: "underline", marginBottom: 2 }}
            style={{ textAlign: "center" }}
          >
            Your Liked Books
          </Typography>
          <div
            className="card-container"
            style={{
              width: "100%",
              margin: "auto",
            }}
          >
            <LikedBooksSwiper books={booksFromServer} />
          </div>
        </>
      )}
    </>
  );
};

export default LikedPage;
