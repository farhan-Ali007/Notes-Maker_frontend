import { Box, Button, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { black, mainColor, white } from "../styles/Styled";

const NotFound = ({ darkMode }) => {
  const theme = useTheme();
  return (
    <Box
      disableGutters
      sx={{
        height: "80vh",
        maxWidth: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundColor: darkMode ? theme.palette.background.default : white,
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        component="img"
        src={darkMode ? "/404-dark.png" : "/404-light.png"}
        alt="Not Found"
        sx={{
          height: { xs: "auto", md: "60%", lg: "60%" },
          width: { xs: "100%", sm: "60%", md: "40%" },
          marginBottom: 4,
        }}
      />
      <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
        Oops! Page not found.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="outlined"
        color="primary"
        sx={{
          borderRadius: "30px",
          ":hover": {
            color: black,
            background: theme.palette.text.primary,
          },
        }}
      >
        Go Back to Home
      </Button>
    </Box>
  );
};

export default NotFound;
