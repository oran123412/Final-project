import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Drawer,
  ListItemIcon,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import { useContext } from "react";
import ROUTES from "../../../routes/ROUTES";
import { useNavigate } from "react-router-dom";
import LoginContext from "../../../store/loginContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const LeftDrawerComponent = ({ isOpen, onCloseDrawer }) => {
  const { login } = useContext(LoginContext);

  const navigate = useNavigate();

  const isAdmin = login && login.isAdmin;

  const isBusiness = login && login.isBusiness;

  const handleSignOut = async () => {
    localStorage.removeItem("token");

    window.location.href = `${ROUTES.LOGIN}`;
  };
  return (
    <Drawer anchor="left" open={isOpen} onClose={onCloseDrawer}>
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={onCloseDrawer}
        onKeyDown={onCloseDrawer}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(ROUTES.ABOUT)}>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="About Us" />
            </ListItemButton>
          </ListItem>
          {login && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate(ROUTES.LIKEDPAGE)}>
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText primary="Like" />
              </ListItemButton>
            </ListItem>
          )}
          {login && (isAdmin || isBusiness) && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(ROUTES.MYCARDS)}>
                  <ListItemIcon>
                    <AccountBoxOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Cards" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(ROUTES.CREATECARD)}>
                  <ListItemIcon>
                    <AddCircleOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create New Card" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
        <Divider />
        {isAdmin && login && (
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate(ROUTES.SANDBOX)}>
                <ListItemIcon>
                  <DeveloperModeIcon />
                </ListItemIcon>
                <ListItemText primary="Sandbox" />
              </ListItemButton>
            </ListItem>
          </List>
        )}
        {login && (
          <>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleSignOut}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sign Out" />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default LeftDrawerComponent;
