import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { poppins, white } from "../styles/Styled";
import Loader from "../styles/Loader";

const Favorites = ({ darkMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log("token in favorite notes----->", token);

        const response = await axios.get(
          "https://chambray-warp-runner.glitch.me/api/note/getallfavorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        // console.log("Response of favorite notes---->", response.data);

        const sortedNotes = response.data.notes.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setNotes(sortedNotes);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching notes:", error);
        setError(error.response?.data?.error);
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleTitleClick = (id) => {
    navigate(`/note/${id}`);
  };

  const toggleFavorite = async (note) => {
    const token = localStorage.getItem("token");
    // console.log("token in favorites---->", token);

    try {
      let response;
      if (note.favorite) {
        // Unfavorite it
        response = await axios.put(
          `https://chambray-warp-runner.glitch.me/api/note/${note._id}/unfavorite`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
      } else {
        // Add to favorites
        response = await axios.put(
          `https://chambray-warp-runner.glitch.me/api/note/${note._id}/favorite`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
      }

      toast.success(response.data.message);

      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n._id === note._id ? { ...n, favorite: !note.favorite } : n
        )
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Typography variant="h5" sx={{ minHeight: "90vh" }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "90vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        background: darkMode ? theme.palette.background.default : white,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          textAlign: "center",
          mb: 4,
          fontFamily: poppins,
          fontWeight: 700,
          color: theme.palette.text.primary,
        }}
      >
        Favorite Notes
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: {
            xs: "center",
            sm: "space-between",
            md: "start",
            lg: "start",
          },
          gap: 3,
        }}
      >
        {notes.map((note) => (
          <Box
            key={note._id}
            sx={{
              flex: {
                xs: "1 1 45%",
                sm: "1 1 45%",
                md: "1 1 21%",
              },
              maxWidth: {
                xs: "100%",
                sm: "45%",
                md: "22%",
              },
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              backgroundColor: "#fff",
            }}
          >
            <Card sx={{ height: "100%", padding: "10px" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    cursor: "pointer",
                    textAlign: "center",
                    fontFamily: poppins,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: { xs: "80%", sm: "90%", md: "100%" },
                  }}
                  onClick={() => handleTitleClick(note._id)}
                >
                  {note.title}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  borderTop: `1px solid ${theme.palette.divider}`,
                  paddingTop: "10px",
                  "& .MuiIconButton-root": {
                    padding: "10px",
                    position: "relative",
                    "&:not(:last-child)::after": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      right: 0,
                      transform: "translateY(-50%)",
                      width: "1px",
                      height: "24px",
                      backgroundColor: theme.palette.divider,
                    },
                  },
                }}
              >
                <Tooltip
                  title={
                    note.favorite ? "Remove from favorite" : "Add to favorite"
                  }
                  arrow
                >
                  <IconButton
                    aria-label="favorite"
                    color="error"
                    onClick={() => toggleFavorite(note)}
                  >
                    {note.favorite ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderOutlinedIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Favorites;
