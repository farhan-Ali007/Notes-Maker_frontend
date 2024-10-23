import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { black, poppins, white } from "../styles/Styled";

const ForgotPasswordForm = ({
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        width: "90%",
        maxWidth: "400px",
        margin: "0 auto",
        padding: 2,
        background: darkMode ? theme.palette.background.default : white,
        borderRadius: 2,
        boxShadow: darkMode
          ? "0px 4px 10px rgba(13, 128, 216, 0.8)"
          : "0px 4px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Typography
        variant="h5"
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
          placeholder={placeholder}
          required
          value={field.value}
          onChange={field.onChange}
        />
      ))}
      <Button
        variant="contained"
        type="submit"
        fullWidth
        sx={{
          color: black,
          background: theme.palette.text.primary,
          textTransform: "capitalize",
          ":hover": {
            background: " #0968b0",
            color: white,
          },
        }}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default ForgotPasswordForm;
