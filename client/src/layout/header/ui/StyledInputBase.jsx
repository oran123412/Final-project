import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "black",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    border: "1px solid black",

    "&::placeholder": {
      color: "black",
      opacity: 1,
    },
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default StyledInputBase;
