import React, { useState } from "react";
import useAutoLogin from "../hooks/useAutoLogin";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import tmc from "twin-moon-color";
import FooterComponent from "./footer/FooterComponent";
import HeaderComponent from "./header/HeaderComponent";
import MainComponent from "./main/MainComponent";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";

const LayoutComponent = ({
  handleSearch,
  searchTerm,
  setSearchTerm,
  yourAllCardsData,
  yourSearchTerm,
  children,
  navigateToCart,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    handleSearch(newSearchTerm);
  };

  const finishAutoLogin = useAutoLogin();
  const [isDarkTheme, setDarkTheme] = useState(false);

  const themes = tmc({
    "text.headerColor": "!gray",
    "text.headerActive": "*white",
    favActive: "*#FB0000",
  });

  const handleThemeChange = (checked) => {
    setDarkTheme(checked);
  };

  const darkMode = createTheme(themes.dark);
  const lightMode = createTheme(themes.light);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={isDarkTheme ? darkMode : lightMode}>
      <CssBaseline />
      <HeaderComponent
        isDarkTheme={isDarkTheme}
        onThemeChange={handleThemeChange}
        onSearch={handleSearchChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSignOut={handleSignOut}
        isAuthenticated={isAuthenticated}
        navigateToCart={navigateToCart}
      />
      <MainComponent allCards={yourAllCardsData} searchTerm={yourSearchTerm}>
        {finishAutoLogin ? (
          children
        ) : (
          <Typography variant="h1">Loading...</Typography>
        )}
      </MainComponent>
      <FooterComponent />
    </ThemeProvider>
  );
};

export default LayoutComponent;
