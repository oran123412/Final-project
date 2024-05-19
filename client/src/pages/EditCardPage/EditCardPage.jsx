import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Box, Avatar, Typography, Grid, Button } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import TextInputComponent from "../../components/TextInputComponent";
import validateSchema from "../../validation/createCardValidation";
import LoginContext from "../../store/loginContext";
import { fromServer } from "./normalizeEdit";
import normalizeTwoServer from "./normalizeTwoServer";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/ROUTES";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCardPage = () => {
  const navigate = useNavigate();
  const [inputsValue, setInputsValue] = useState({
    title: "",
    subtitle: "",
    description: "",
    phone: "",
    email: "",
    web: "",
    url: "",
    alt: "",
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
    price: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    subtitle: "",
    description: "",
    phone: "",
    email: "",
    web: "",
    url: "",
    alt: "",
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
    price: "",
  });

  let { id } = useParams();
  const { login } = useContext(LoginContext);

  useEffect(() => {
    if (!id || !login) {
      return;
    }
    axios
      .get("http://localhost:3001/api/cards/" + id)
      .then(({ data }) => {
        if (data.user_id === login._id) {
        } else {
        }
        setInputsValue(fromServer(data));
        validateInitialData(fromServer(data));
      })
      .catch((err) => {});
  }, [id, login]);

  const validateInitialData = (data) => {
    let initialErrors = {};
    Object.keys(data).forEach((key) => {
      const validationResult = validateSchema[key]
        ? validateSchema[key](data[key])
        : null;
      if (validationResult && validationResult.error) {
        initialErrors[key] = validationResult.error.details[0].message;
      } else {
        initialErrors[key] = "";
      }
    });
    setErrors(initialErrors);
  };

  const handleInputsChange = (e) => {
    setInputsValue((cInputsValue) => {
      const newInputsValue = { ...cInputsValue, [e.target.id]: e.target.value };

      return newInputsValue;
    });
  };

  const handleInputsBlur = (e) => {
    const { id, value } = e.target;
    const validationResult = validateSchema[id]
      ? validateSchema[id](value)
      : null;
    if (validationResult && validationResult.error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: validationResult.error.details[0].message,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedCard = await axios.put(
        "http://localhost:3001/api/cards/" + id,
        normalizeTwoServer(inputsValue)
      );

      navigate(ROUTES.HOME);
    } catch (error) {
      const message =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(message);
    }
  };

  const noValidationErrors = Object.values(errors).every(
    (error) => error === ""
  );

  return (
    <Box
      sx={{
        margin: 8,
        marginTop: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Edit your card
      </Typography>
      <form noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {Object.keys(inputsValue).map((keyName) => (
            <TextInputComponent
              key={"inputs" + keyName}
              id={keyName}
              label={keyName}
              value={inputsValue[keyName]}
              onChange={handleInputsChange}
              onBlur={handleInputsBlur}
              errors={errors[keyName]}
              required={errors[keyName] === "" ? true : false}
              xs={keyName === "price" ? 12 : 6}
            />
          ))}
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={!noValidationErrors}
        >
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default EditCardPage;
