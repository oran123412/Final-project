import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import "./CardsComponent.css";
import defaultBookImage from "../images/defaultBookImage.jpg";
import ROUTES from "../routes/ROUTES";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RecipeReviewCard({ book }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [price, setPrice] = useState("Loading...");

  useEffect(() => {
    if (book.isFromGoogleAPI) {
      const fetchingPrice = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/api/books/detail/${book.id}`
          );
          const actualPrice = response.data.price;
          setPrice(actualPrice);
        } catch (err) {
          setPrice("Price unavailable");
        }
      };
      fetchingPrice();
    } else {
      setPrice(null);
    }
  }, [book.id, book.isFromGoogleAPI]);
  const currencyCode = "\u20AA";
  const originalTitle = book?.volumeInfo?.title || "Unknown Title";
  const cleanedTitle = originalTitle.replace(/[\/\:\,\.]/g, "");
  const title =
    cleanedTitle.split(" ").length > 3
      ? cleanedTitle.split(" ").slice(0, 3).join(" ")
      : cleanedTitle;

  const thumbnail = book?.volumeInfo?.imageLinks?.thumbnail || defaultBookImage;

  const handleClickCard = (bookId) => {
    if (book.isFromGoogleAPI) {
      navigate(`${ROUTES.BOOKSDETAIL}/${bookId}`);
    } else {
      navigate(`${ROUTES.CARDSPAGE}/${bookId}`);
    }
  };
  return (
    <Card
      className="image-zoom-container"
      sx={{
        margin: "auto",
        marginTop: "25px",
      }}
    >
      <CardMedia
        className="cardMediaClass"
        onClick={() => handleClickCard(book.id)}
        component="img"
        image={thumbnail}
        alt={title}
      />
      <CardContent>
        <CardHeader
          className="cardHeader"
          title={title}
          titleTypographyProps={{
            style: { textAlign: "center" },
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        />
        {!book.isFromGoogleAPI && (
          <div
            style={{
              backgroundColor: "#ffa",
              textAlign: "center",
              padding: "5px",
            }}
          >
            Uploaded Card
          </div>
        )}
        <div style={{ textAlign: "center" }}>
          {price && price !== "Loading..." && (
            <button
              className="button"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => handleClickCard(book.id)}
              style={{ textAlign: "center" }}
            >
              {isHovered
                ? "Check for a discount"
                : `Price: ${currencyCode} ${price}`}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
