import { useState, useContext } from "react";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import ROUTES from "../../routes/ROUTES";
import { useNavigate } from "react-router-dom";
import normalizeRegister from "./normalizeRegister";
import { validateSchema } from "../../validation/registerValidation";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoginContext from "../../store/loginContext";
import FormFields from "./FormFields";
import MyLottieAnimation from "./MyLottieAnimation";
import MyLottieAnimation2 from "./MyLottieAnimation2";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [inputsValue, setInputsValue] = useState({
    first: "",
    middle: "",
    last: "",
    email: "",
    password: "",
    phone: "",
    url: "",
    alt: "",
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
    isBusiness: false,
  });
  const [errors, setErrors] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
  });

  const navigate = useNavigate();
  const { login } = useContext(LoginContext);

  const handleInputsChange = (e) => {
    const { id, value } = e.target;

    setInputsValue((prevInputs) => ({
      ...prevInputs,
      [id]: value,
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

  useEffect(() => {
    const normalizedData = normalizeRegister(inputsValue);
  }, [inputsValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const normalizedData = normalizeRegister(inputsValue);
      await axios.post(
        "http://localhost:3001/api/users/register",
        normalizedData
      );
      toast.success("You have registered successfully");
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || error.response.data;

        if (
          typeof errorMessage === "string" &&
          errorMessage.toLowerCase().includes("user already exists")
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email:
              "This email is already registered. Please use another email.",
          }));
        }
      }
    }
  };
  const handleBusinessAccountClick = () => {
    setInputsValue((prevInputsValue) => {
      const newIsBusiness = !prevInputsValue.isBusiness;

      return {
        ...prevInputsValue,
        isBusiness: newIsBusiness,
      };
    });
  };
  if (login) {
    return <Navigate to={ROUTES.HOME} />;
  }
  const handleHaveAccount = () => {
    navigate(ROUTES.LOGIN);
  };
  return (
    <>
      <MyLottieAnimation />
      <MyLottieAnimation2 />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            mt: 3,
            p: 1,
            width: "100%",
          }}
        >
          <FormFields
            inputsValue={inputsValue}
            errors={errors}
            handleInputsChange={handleInputsChange}
            handleInputsBlur={handleInputsBlur}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={inputsValue.isBusiness}
                onChange={handleBusinessAccountClick}
                color="primary"
              />
            }
            label="Business Account"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={Object.keys(errors).length > 0}
          >
            Sign Up
          </Button>
        </Box>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Typography
              variant="body2"
              style={{ cursor: "pointer" }}
              onClick={handleHaveAccount}
              sx={{
                p: 1.5,
                mt: 2,
                textDecoration: "underline",
                color: "secondary.main",
              }}
            >
              Already have an account? Sign in
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default RegisterPage;
