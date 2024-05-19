import { createContext, useState } from "react";

const LoginContext = createContext(null);

export const LoginProvider = ({ children }) => {
  const [login, setLogin] = useState(null);

  const loginUser = (userDetails) => {
    setLogin({
      ...userDetails,
    });
  };

  const logoutUser = () => {
    setLogin(null);
  };

  return (
    <LoginContext.Provider value={{ login, setLogin, loginUser, logoutUser }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
