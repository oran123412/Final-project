import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActionArea,
  CardMedia,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import ModeIcon from "@mui/icons-material/Mode";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PropTypes from "prop-types";
import LoginContext from "../store/loginContext";
import { useContext } from "react";

const CardComponent = ({
  title,
  subtitle,
  img,
  phone,
  address,
  cardNumber,
  id,
  liked,
  onDelete,
  onEdit,
  onLike,
  defaultColor,
  onClick,
  onCall,
  userId,
}) => {
  const { login } = useContext(LoginContext);
  const loggedIn = login;
  const handleImageError = (e) => {
    e.target.src =
      "https://cdn.leonardo.ai/users/174b9e54-f96e-4369-950f-7eaad8384fa9/generations/8f9b2e2c-a01b-48b4-8bd4-80d1259f7942/Leonardo_Diffusion_XL_page_not_found_0.jpg";
    e.target.alt = "Picture not found";
  };

  const handleDeleteClick = () => {
    onDelete(id);
  };

  const handleEditClick = () => {
    onEdit(id);
  };

  const handleLikeClick = () => {
    onLike(id, !liked);
  };

  const handleCallClick = () => {
    onCall(id);
  };

  return (
    <Card
      square
      raised
      sx={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        ":hover": {
          transform: "scale(1.05)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
        },
      }}
    >
      <CardActionArea onClick={() => onClick(id)}>
        <CardMedia
          component="img"
          image={img}
          onError={handleImageError}
          alt="Your image"
          height={200}
          sx={{ objectFit: "cover" }}
        />
        <CardHeader title={title} subheader={subtitle} />
        <Divider />
      </CardActionArea>
      <CardContent>
        <Typography component="div">
          <Typography component="span" fontWeight={700}>
            Phone:
          </Typography>
          {phone}
        </Typography>
        <Typography component="div">
          <Typography component="span" fontWeight={700}>
            Address:
          </Typography>
          {address?.city || "City not available"}
        </Typography>
      </CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          {loggedIn && (loggedIn.isAdmin || userId === loggedIn._id) && (
            <>
              <IconButton onClick={handleDeleteClick}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={handleEditClick}>
                <ModeIcon />
              </IconButton>
            </>
          )}
        </Box>
        <Box>
          <IconButton onClick={handleCallClick}>
            <LocalPhoneIcon />
          </IconButton>
          {loggedIn && (
            <IconButton onClick={handleLikeClick}>
              <FavoriteIcon color={liked ? "error" : defaultColor} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Card>
  );
};

CardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  img: PropTypes.string,
  phone: PropTypes.string.isRequired,
  address: PropTypes.shape({
    city: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    houseNumber: PropTypes.number.isRequired,
  }).isRequired,
  cardNumber: PropTypes.number.isRequired,
  liked: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired,
  defaultColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onCall: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

CardComponent.defaultProps = {
  subtitle: "missing subtitle ",
  defaultColor: "inherit",
};

export default CardComponent;
