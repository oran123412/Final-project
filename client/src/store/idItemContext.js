import { createContext, useState } from "react";

const IdItemContext = createContext();

export const IdItemProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  return (
    <IdItemContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </IdItemContext.Provider>
  );
};

export { IdItemContext };
