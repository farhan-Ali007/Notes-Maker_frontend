import { Box, useTheme } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "../../forms/ForgotPasswordForm";
import { Context } from "../../main";
import { white } from "../../styles/Styled";

const ForgotPassword = ({ darkMode }) => {
  const theme = useTheme();
  const navigateTo = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "https://chambray-warp-runner.glitch.me/api/user/forgotpassword",
        { email },
        {
          withCredentials: true,
        }
      );

      // Assuming your API returns the reset token and base URL
      console.log("Forgot Password data------>", data);
      toast.success(data.message);
      setEmail("");
      const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
      // Set up the reset link
      const resetLink = `${frontendUrl}/reset-password/${data.token}?email=${encodeURIComponent(email)}`;

      // console.log("Reset Password Link: ", resetLink);

      // Send the reset link to the user's email
      // Ensure your backend has the logic to send the email containing resetLink
    } catch (error) {
      console.log("Full error", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Something went wrong!";
      toast.error(errorMessage);
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
      <ForgotPasswordForm
        fields={[
          {
            label: "Email",
            name: "email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
          },
        ]}
        onSubmit={handleSubmit}
        buttonText="Submit"
        darkMode={darkMode}
        title={"Forgot Password?"}
        placeholder={"Enter your email"}
      />
    </Box>
  );
};

export default ForgotPassword;
