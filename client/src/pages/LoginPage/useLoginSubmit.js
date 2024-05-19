import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import LoginContext from "../../store/loginContext";
import ROUTES from "../../routes/ROUTES";

const useLoginSubmit = () => {
  const navigate = useNavigate();
  const { setLogin } = useContext(LoginContext);

  const handleSubmit = async (emailValue, passwordValue, setError) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        { email: emailValue, password: passwordValue },
        { validateStatus: false }
      );

      if (response.status === 200) {
        const data = response.data;

        const decoded = jwtDecode(data);

        if (decoded && decoded._id) {
          localStorage.setItem("token", data);

          setLogin(decoded);
          toast.success("Logged In Successfully");
          navigate(ROUTES.HOME);
        } else {
          throw new Error("Invalid token decoded.");
        }
      } else {
        throw new Error(
          "Login failed. Server responded with status: " + response.status
        );
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      toast.error(
        err.response?.data?.message ||
          "Login failed. Please check your email/password."
      );
    }
  };

  return handleSubmit;
};

export default useLoginSubmit;
