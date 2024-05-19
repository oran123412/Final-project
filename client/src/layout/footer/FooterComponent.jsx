import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/ROUTES";
import LoginContext from "../../store/loginContext";
import { useContext } from "react";
import "../../styles.css";

const FooterComponent = () => {
  const { login } = useContext(LoginContext);

  const navigate = useNavigate();

  const isAdmin = login && login.isAdmin;

  const isBusiness = login && login.isBusiness;

  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <Paper elevation={0} className="customBottomNavigation" sx={{ mt: 5 }}>
      <BottomNavigation className="customBottomNavigation" showLabels>
        <BottomNavigationAction
          label="About"
          icon={<InfoIcon />}
          onClick={() => handleNavigation(ROUTES.ABOUT)}
        />
        {login && login._id && (
          <BottomNavigationAction
            label="Favorites"
            icon={<FavoriteIcon />}
            onClick={() => handleNavigation(`${ROUTES.LIKEDPAGE}`)}
          />
        )}
        {login && (isAdmin || isBusiness) && (
          <BottomNavigationAction
            label="My cards"
            icon={<AccountBoxOutlinedIcon />}
            onClick={() => handleNavigation(`${ROUTES.MYCARDS}`)}
          />
        )}
      </BottomNavigation>
    </Paper>
  );
};

export default FooterComponent;
