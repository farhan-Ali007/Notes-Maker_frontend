import { Box, Typography, Button, useTheme } from "@mui/material";
import { mainColor, poppins, white } from "../styles/Styled";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Typist from "react-typist";

const Home = ({ darkMode }) => {
  const theme = useTheme();
  return (
    <Box
      className="typist"
      sx={{
        maxWidth: "100vw",
        minHeight: "90vh",
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
          lg: "row",
        },
        background: darkMode ? theme.palette.background.default : white,
        color: darkMode ? theme.palette.text.primary : mainColor,
      }}
    >
      {/* Left Half (Text + Button) */}
      <Box
        sx={{
          minWidth: "50%",
          padding: {
            xs: 3,
            sm: 3,
            md: 8,
          },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "inherit",
        }}
      >
        <Typography
          variant="h3"
          color="white"
          fontFamily={poppins}
          sx={{
            fontWeight: "bold",
            justifyContent: "center",
            color: mainColor,
            marginBottom: 2,
            [theme.breakpoints.down("sm")]: {
              fontSize: "2.3rem",
            },
            paddingTop: {
              xs: "2.5rem",
              sm: "2.5rem",
            },
          }}
        >
          <Typist>
            Welcome to Notiqo <Typist.Delay ms={1000} />{" "}
          </Typist>
        </Typography>
        <Typography
          variant="h5"
          color={mainColor}
          justifyContent={"center"}
          fontFamily={poppins}
          justifySelf={"center"}
          sx={{ marginBottom: 1, fontWeight: "bold" }}
        >
          Your Smart Note-Taking Companion
        </Typography>
        <Typography
          variant="h6"
          color={mainColor}
          fontFamily={poppins}
          justifyContent={"center"}
          sx={{ marginBottom: 4, fontWeight: "bold" }}
        >
          Start a new journey!
        </Typography>
        <Button
          component={Link}
          to="/notes"
          variant="outlined"
          color="primary"
          size="small"
          sx={{
            width: {
              xs: "10rem",
              sm: "11rem",
              md: "10rem",
              lg: "10rem",
            },
            textTransform: "capitalize",
            fontFamily: poppins,
            fontWeight: 500,
            fontSize: "1rem",
            display: "inline-flex",
            color: mainColor,
            padding: "10px 0px",
            borderRadius: "30px",
            "&:hover": {
              backgroundColor: mainColor,
              color: white,
            },
          }}
        >
          Let&apos;s Go{" "}
          <ChevronRightIcon
            sx={{ color: "inherit", transition: " 0.3s ease-in-out" }}
          />
        </Button>
      </Box>

      {/* Right Half (Image) */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={darkMode ? "/alphabet-dark.png" : "/alphabet-light.png"}
          alt="writing"
          sx={{
            width: {
              xs: "100%",
              sm: "100%",
              md: "100%",
            },
            marginRight: {
              xs: "50px",
              sm: "50px",
              md: "none",
              lg: "none",
            },
            height: {
              xs: "auto",
              md: "90vh",
            },
            paddingTop: "10px",
            objectFit: "cover",
          }}
        />
      </Box>
    </Box>
  );
};

export default Home;
