import React, { useContext, useState, useEffect } from "react";
import { Typography, Grid } from "@mui/material";
import axios from "axios";
import CardComponent from "../../components/CardComponent";
import LoginContext from "../../store/loginContext";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/ROUTES";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import "./MyCardsPage.css";

const MyCardsPage = () => {
  const [dataFromServer, setDataFromServer] = useState([]);
  const [userCards, setUserCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { login } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/cards/my-cards"
        );
        const initializedCards = response.data.map((card) => ({
          ...card,
          liked: card.likes.includes(login?._id),
        }));
        setUserCards(initializedCards);
        setDataFromServer(response.data);

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [login]);

  const handleDeleteCard = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/cards/${id}`
      );
      if (response.status === 200) {
        const updatedDataFromServer = dataFromServer.filter(
          (card) => card._id !== id
        );
        const updatedUserCards = userCards.filter((card) => card._id !== id);

        setDataFromServer(updatedDataFromServer);
        setUserCards(updatedUserCards);
      }
    } catch (error) {}
  };

  const handleLikeCard = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/cards/${id}`
      );

      setUserCards((prevUserCards) =>
        prevUserCards.map((card) =>
          card._id === id
            ? { ...card, liked: response.data.likes.includes(login?._id) }
            : card
        )
      );
    } catch (error) {}
  };

  const handleCardClick = (id) => {
    navigate(`${ROUTES.CARDSPAGE}/${id}`);
  };

  const handleEditCard = (id) => {
    navigate(`${ROUTES.EDITCARD}/${id}`);
  };

  let isCallInProgress = false;

  const handleCallClick = (id) => {
    if (isCallInProgress) return;

    const cardItem = dataFromServer.find((item) => item._id === id);

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

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const handleCreateCard = () => {
    navigate(`${ROUTES.CREATECARD}`);
  };

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Typography variant="h4" sx={{ textDecoration: "underline" }}>
          Your Created Cards
        </Typography>
      </Box>
      <br />
      <div className="cards-container">
        <div className="cards-grid">
          {userCards.length > 0 ? (
            userCards.map((item) => (
              <div className="card-item" key={item._id}>
                <CardComponent
                  id={item._id}
                  title={item.title}
                  subtitle={item.subtitle}
                  img={item.image.url}
                  phone={item.phone}
                  address={item.address}
                  cardNumber={item.bizNumber}
                  onDelete={() => handleDeleteCard(item._id)}
                  onEdit={() => handleEditCard(item._id)}
                  onLike={() => handleLikeCard(item._id)}
                  onClick={() => handleCardClick(item._id)}
                  onCall={() => handleCallClick(item._id)}
                  liked={item.liked}
                  userId={item.user_id}
                />
              </div>
            ))
          ) : (
            <Typography textAlign="center">No cards found.</Typography>
          )}
        </div>
      </div>
      <Box display="flex" justifyContent="center" mt={5} mb={7}>
        <Button variant="contained" onClick={handleCreateCard}>
          Create new card!
        </Button>
      </Box>
    </>
  );
};

export default MyCardsPage;
