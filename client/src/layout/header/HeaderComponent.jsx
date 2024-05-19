import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import MoreIcon from "@mui/icons-material/MoreVert";
import Switch from "@mui/material/Switch";
import Links from "./ui/Links";
import LeftDrawerComponent from "./ui/LeftDrawerComponent";
import FilterComponent from "./ui/FilterComponent";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/ROUTES";
import { useTheme } from "@mui/material/styles";
import LoginContext from "../../store/loginContext";
import { useContext } from "react";
import { transformation } from "leaflet";
import cart from "../../images/cart.png";
import Badge from "@mui/material/Badge";
import { IdItemContext } from "../../store/idItemContext";
import "./HeaderComponent.css";

const HeaderComponent = ({
  onThemeChange,
  onSearch,
  searchTerm,
  setSearchTerm,
  onSignOut,
  isAuthenticated,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { login } = useContext(LoginContext);
  const loggedIn = login;
  const { cartItems, setCartItems } = useContext(IdItemContext);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const theme = useTheme();

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleThemeChange = (event) => {
    onThemeChange(event.target.checked);
  };

  const handleOpenDrawerClick = () => {
    setIsOpen(true);
  };

  const handleCloseDrawerClick = () => {
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await onSignOut();
    window.location.href = `${ROUTES.LOGIN}`;
  };
  const navigateToCart = () => {
    navigate(ROUTES.CARTPAGE);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    ></Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {loggedIn && (
        <MenuItem onClick={handleSignOut}>
          <IconButton size="large" color="black"></IconButton>
          <p>Sign out</p>
        </MenuItem>
      )}
    </Menu>
  );
  const matches900to985 = useMediaQuery(
    "(min-width:900px) and (max-width:985px)"
  );
  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "100%",
        overflow: "hidden",
        backgroundColor: "none",
      }}
    >
      <AppBar
        position="static"
        sx={{
          boxShadow: "none",
        }}
        className="header"
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="black"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleOpenDrawerClick}
          >
            <MenuIcon />
          </IconButton>

          <Links />
          <FilterComponent
            onChange={onSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <Box
            sx={{
              my: 2,
              p: 1,
            }}
          >
            <Badge badgeContent={cartItems.length} color="primary">
              <img
                src={cart}
                alt="cart"
                height={35}
                width={35}
                style={{ cursor: "pointer" }}
                onClick={navigateToCart}
              />
            </Badge>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {theme.breakpoints.up("md") && loggedIn && login._id && (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="small"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleSignOut}
                color="black"
              >
                {!matches900to985 && "Sign Out"}
              </IconButton>
            </Box>
          )}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="black"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <LeftDrawerComponent
        isOpen={isOpen}
        onCloseDrawer={handleCloseDrawerClick}
      />
    </Box>
  );
};

export default HeaderComponent;
