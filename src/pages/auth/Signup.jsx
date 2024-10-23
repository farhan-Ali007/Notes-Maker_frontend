import { Box, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../forms/authForm";
import { white } from "../../styles/Styled";
import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import Loader from "../../styles/Loader";

const Signup = ({ darkMode }) => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const { setIsAuthorized, setUser } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [file, setFile] = useState(null);
  const [isloading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Create a FormData object
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (file) {
      formData.append("image", file);
    }
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://chambray-warp-runner.glitch.me/api/user/signup",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("Data------>", data.response);
      localStorage.setItem("token", data?.token);
      toast.success(data.message);
      setUsername("");
      setEmail("");
      setPassword("");
      setUser(data?.user);
      setIsAuthorized(true);
      setIsLoading(false);
      navigateTo("/");
    } catch (error) {
      console.log("Full error", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response?.data?.error
          : "Something went wrong!";
      toast.error(errorMessage);
      console.log(errorMessage);
    }
  };

  {
    isloading && <Loader />;
  }

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
            label: "Username",
            name: "username",
            type: "text",
            value: username,
            onChange: (e) => setUsername(e.target.value),
          },
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
        onSubmit={handleSignUp}
        buttonText={isloading ? "Signing Up..." : "Sign Up"}
        isSignup={true}
        darkMode={darkMode}
        handleFileChange={handleFileChange}
        title={"Sign Up"}
      />
    </Box>
  );
};

export default Signup;
