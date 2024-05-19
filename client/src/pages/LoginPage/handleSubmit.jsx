import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import ROUTES from "../../routes/ROUTES";

const handleSubmit = async (
  e,
  { emailValue, passwordValue, setLogin, navigate }
) => {
  e.preventDefault();

  try {
    let { data } = await axios.post("/users/login", {
      email: emailValue,
      passwordValue: passwordValue,
    });

    localStorage.setItem("token", data.token);

    const userInfoFromToken = jwtDecode(data);
    setLogin(userInfoFromToken);
    toast.success("LoggedIn Successfully");
    navigate(ROUTES.HOME);
  } catch (err) {
    toast.error("Login failed. Please check your email/password.");
  }
};

export default handleSubmit;
