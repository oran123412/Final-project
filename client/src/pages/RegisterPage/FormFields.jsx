import React from "react";
import { Grid, TextField, Alert } from "@mui/material";

const FormFields = ({
  inputsValue,
  errors,
  handleInputsChange,
  handleInputsBlur,
}) => (
  <Grid container spacing={2}>
    {}
    {Object.keys(inputsValue).map(
      (key) =>
        key !== "isBusiness" && (
          <Grid
            item
            xs={12}
            sm={key === "first" || key === "middle" || key === "last" ? 4 : 12}
            key={key}
          >
            <TextField
              autoComplete={key}
              name={key}
              required={
                key !== "middle" &&
                key !== "url" &&
                key !== "alt" &&
                key !== "state"
              }
              fullWidth
              id={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={inputsValue[key]}
              onChange={handleInputsChange}
              onBlur={handleInputsBlur}
              type={key === "password" ? "password" : "text"}
            />
            {errors[key] && <Alert severity="error">{errors[key]}</Alert>}
          </Grid>
        )
    )}
  </Grid>
);

export default FormFields;
