import { Box, Typography, useTheme } from "@mui/material";
import { lightBlack, mainColor, white } from "../styles/Styled";

const Footer = ({ darkMode }) => {
  const theme = useTheme();

  return (
    <>
      <Box
        component="footer"
        sx={{
          width: "100%",
          bgcolor: darkMode ? lightBlack : mainColor,
          py: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          color={darkMode ? theme.palette.text.primary : white}
          sx={{ fontWeight: 600 }}
        >
          © 2024 Notiqo. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Footer;
