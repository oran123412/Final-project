import { Link, Typography } from "@mui/material";

const CopyrightComponent = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit">Oran Meir</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default CopyrightComponent;
