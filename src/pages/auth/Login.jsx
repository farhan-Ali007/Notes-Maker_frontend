import { Box, useTheme } from "@mui/material";
import AuthForm from "../../forms/authForm";
import axios from "axios";
import { useContext, useState } from "react";
import { Context } from "../../main";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { white } from "../../styles/Styled";

const Login = ({ darkMode }) => {
  const theme = useTheme();

  const navigateTo = useNavigate();

  const { setIsAuthorized, setUser } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "https://chambray-warp-runner.glitch.me/api/user/login",
        { email, password },
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("token", data?.token);
      // console.log("Token----->", data.token);
      toast.success(data.message);
      setEmail("");
      setPassword("");
      setIsAuthorized(true);
      setUser(data?.user);
      navigateTo("/");
    } catch (error) {
      console.log("Full error", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Something went wrong!";
      toast.error(errorMessage);
      console.log(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        background: darkMode ? theme.palette.background.default : white,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 64px)",
        paddingTop: {
          xs: "none",
          md: "64px",
          lg: "64px",
        },
      }}
    >
      <AuthForm
        fields={[
          {
            label: "Email",
            name: "email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
          },
          {
            label: "Password",
            name: "password",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
          },
        ]}
        onSubmit={handleLogin}
        buttonText="Login"
        isSignup={false}
        darkMode={darkMode}
        title={"Login"}
      />
    </Box>
  );
};

export default Login;
