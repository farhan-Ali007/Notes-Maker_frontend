import {
  Box,
  Button,
  TextField,
  Input,
  useTheme,
  Typography,
} from "@mui/material";
import { poppins, white } from "../styles/Styled";
import { Link } from "react-router-dom";

const AuthForm = ({
  fields,
  onSubmit,
  buttonText,
  isSignup,
  darkMode,
  title,
  handleFileChange,
  placeholder,
}) => {
  const theme = useTheme();

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        width: "90%",
        maxWidth: "400px",
        padding: 2,
        background: darkMode ? theme.palette.background.default : white,
        borderRadius: 2,
        boxShadow: darkMode
          ? "0px 4px 10px rgba(13, 128, 216, 0.8)"
          : "0px 4px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.text.primary,
          fontFamily: poppins,
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>
      {fields.map((field) => (
        <TextField
          key={field.name}
          label={field.label}
          type={field.type || "text"}
          name={field.name}
          variant="outlined"
          fullWidth
          placeholder={
            field.name === "username"
              ? "@username"
              : field.name === "email"
              ? "example@gmail.com"
              : ""
          }
          required
          value={field.value}
          onChange={field.onChange}
        />
      ))}
      {isSignup && (
        <Input
          type="file"
          name="file"
          accept="image/*"
          fullWidth
          onChange={handleFileChange}
        />
      )}
      <Button
        variant="contained"
        type="submit"
        fullWidth
        sx={{ background: theme.palette.text.primary }}
      >
        {buttonText}
      </Button>
      {isSignup ? (
        <Typography sx={{ color: theme.palette.text.secondary }}>
          Already have an account?{" "}
          <Link to={"/login"} style={{ color: theme.palette.text.primary }}>
            Login
          </Link>
        </Typography>
      ) : (
        <>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            <Link
              to={"/forgot-password"}
              style={{ color: theme.palette.text.primary }}
            >
              Forgot password?
            </Link>
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            Don&apos;t have a an account?{" "}
            <Link to={"/Signup"} style={{ color: theme.palette.text.primary }}>
              Signup
            </Link>
          </Typography>
        </>
      )}
    </Box>
  );
};

export default AuthForm;
