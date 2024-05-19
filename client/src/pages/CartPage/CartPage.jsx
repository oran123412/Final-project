import { useState, useContext } from "react";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import ROUTES from "../../routes/ROUTES";
import { useNavigate, useLocation } from "react-router-dom";
import normalizeRegister from "../RegisterPage/normalizeRegister";
import { validateSchema } from "../../validation/cartValidation";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoginContext from "../../store/loginContext";
import FormFields from "../RegisterPage/FormFields";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import CreditCard from "../../images/creditCard.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import truck from "../../images/truck.png";
import { IdItemContext } from "../../store/idItemContext";

const CartPage = () => {
  const { cartItems, setCartItems } = useContext(IdItemContext);
  const [inputsValue, setInputsValue] = useState({
    first: "",
    middle: "",
    last: "",
    email: "",
    phone: "",
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
    CreditCard: "",
    cardValidity: "",
    cvv: "",
    id: "",
  });
  const [errors, setErrors] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
    CreditCard: "",
    cardValidity: "",
    cvv: "",
    id: "",
  });

  const navigate = useNavigate();
  const { login } = useContext(LoginContext);

  const registerBook = async (bookId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/books/detail/${bookId}`
      );
      if (response.status === 200) {
      } else {
        toast.error("Failed to add book to cart due to server error.");
      }
    } catch (error) {
      toast.error("Server error during book registration.");
    }
  };

  useEffect(() => {
    cartItems.forEach((item) => {
      registerBook(item.id);
    });
  }, [cartItems]);

  const handleInputsChange = (e) => {
    setInputsValue((CopyOfCurrentValue) => ({
      ...CopyOfCurrentValue,
      [e.target.id]: e.target.value,
    }));
  };

  const handleInputsBlur = (e) => {
    const fieldId = e.target.id;
    const fieldValue = { [fieldId]: inputsValue[fieldId] };

    const validatorFunction = validateSchema[fieldId];
    if (validatorFunction) {
      const { error } = validatorFunction(fieldValue);
      if (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldId]: error.details[0].message,
        }));
      } else {
        setErrors((prevErrors) => {
          const { [fieldId]: removed, ...rest } = prevErrors;
          return rest;
        });
      }
    } else {
      console.warn(`No validation function found for ${fieldId}`);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.finalPrice,
    0
  );
  const currencyCode = "\u20AA";

  const handlePurchaseButton = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/books/purchase`,
        {
          items: cartItems.map((item) => ({ id: item.id })),
        }
      );

      if (response.status === 200) {
        const updatedCartItems = cartItems
          .map((item) => {
            const purchasedItem = response.data.items.find(
              (i) => i.id === item.id
            );
            if (purchasedItem) {
              return {
                ...item,
                amount: item.amount - (purchasedItem.amount || 1),
              };
            }
            return item;
          })
          .filter((item) => item.amount > 0);

        setCartItems(updatedCartItems);
        const cartStorageKey = Object.keys(localStorage).find((key) =>
          key.includes("cartItems")
        );

        localStorage.removeItem(cartStorageKey);

        const clickedItemsKey = Object.keys(localStorage).find((key) =>
          key.includes("clickedItems")
        );

        localStorage.removeItem(clickedItemsKey);

        toast.success("Purchase successful!");
        navigate(ROUTES.HOME);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data ===
          "Sorry, one of your books is currently out of stock"
      ) {
        toast.error("Sorry, one of your books is currently out of stock");
      } else {
        toast.error("An error occurred during the purchase.");
      }
    }
  };
  const handleDelete = () => {
    const cartStorageKey = Object.keys(localStorage).find((key) =>
      key.includes("cartItems")
    );
    if (cartStorageKey) {
      localStorage.removeItem(cartStorageKey);
    } else {
      window.location.reload();
    }

    const clickedItemsKey = Object.keys(localStorage).find((key) =>
      key.includes("clickedItems")
    );
    if (clickedItemsKey) {
      localStorage.removeItem(clickedItemsKey);

      window.location.reload();
    }
  };
  return (
    <>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 1,
        }}
      >
        <Box>
          <Typography variant="h5" style={{ textAlign: "center" }}>
            My Cart
          </Typography>
          <Typography variant="h8" style={{ textAlign: "center" }}>
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`}>
                <h3>{item.title}</h3>
                {item.hasDiscount ? (
                  <p
                    style={{
                      textDecoration: "line-through",
                      textDecorationColor: "red",
                    }}
                  >
                    Original Price: {item.originalPrice}{" "}
                  </p>
                ) : (
                  ""
                )}
                <p>Price: {item.finalPrice}</p>
              </div>
            ))}
          </Typography>

          <Typography variant="h6" style={{ textAlign: "center" }}>
            Total Price:{currencyCode} {totalPrice}
          </Typography>

          <Typography style={{ fontSize: "0.75rem", textAlign: "center" }}>
            (total price includs transportation)
          </Typography>
        </Box>

        <Box component="form" noValidate sx={{ mt: 3 }}>
          <FormFields
            inputsValue={inputsValue}
            errors={errors}
            handleInputsChange={handleInputsChange}
            handleInputsBlur={handleInputsBlur}
          />
          {}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              src={CreditCard}
              alt="credit-cards"
              width={150}
              height={30}
              style={{ marginTop: "10px" }}
            />
            <Button
              type="button"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="error"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
          <Button
            onClick={handlePurchaseButton}
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={Object.keys(errors).length > 0}
          >
            purchase
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CartPage;
