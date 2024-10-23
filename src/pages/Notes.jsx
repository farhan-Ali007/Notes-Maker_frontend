import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import CustomModal from "../components/modal/CustomModal";
import { poppins, white } from "../styles/Styled";
import { toast } from "react-hot-toast";
import Loader from "../styles/Loader";

const Notes = ({ darkMode }) => {
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

        const response = await axios.get(
          "https://chambray-warp-runner.glitch.me/api/note/getall",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const sortedNotes = response.data.notes.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setNotes(sortedNotes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to fetch notes");
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedNoteId(id);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedNoteId) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `https://chambray-warp-runner.glitch.me/api/note/${selectedNoteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setNotes(notes.filter((note) => note._id !== selectedNoteId));
      toast.success(response.data?.message);
      setModalOpen(false);
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("No note found.");
    }
  };

  const handleTitleClick = (id) => {
    navigate(`/note/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/edit/${id}`); // Navigate to edit route
  };

  const toggleFavorite = async (note) => {
    const token = localStorage.getItem("token");
    // console.log("Token for toggling favorite---->", token);

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
        paddingInline: "20px",
        background: darkMode ? theme.palette.background.default : white,
      }}
    >
      {notes && notes.length > 0 ? (
        <Typography
          variant="h4"
          component="h1"
          sx={{
            textAlign: "center",
            mb: 4,
            pt:{
              xs:2,
              sm:2
            },
            fontFamily: poppins,
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          All Notes
        </Typography>
      ) : (
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
          No note found.
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          overflow: "auto",
          justifyContent: {
            xs: "center",
            sm: "space-between",
            md: "space-between",
            lg: "center",
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
              backgroundColor: "#fff",
              borderBottom: darkMode ? "1px solid #0d80d8" : "1px solid gray",
              borderRadius: "10px",
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
                    maxWidth: { xs: "80%", sm: "80%", md: "100%" },
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
                <Tooltip title="Edit note" arrow>
                  <IconButton
                    aria-label="edit"
                    color="primary"
                    onClick={() => handleEditClick(note._id)}
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                </Tooltip>
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
                <Tooltip title="Delete note" arrow>
                  <IconButton
                    aria-label="delete"
                    color="warning"
                    onClick={() => handleDeleteClick(note._id)}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      <Link to="/create" style={{ textDecoration: "none" }}>
        <Tooltip title="Add Note" placement="top" arrow>
          <IconButton
            sx={{
              position: "fixed",
              bottom: {
                xs: 35,
                sm: 25,
                md: 50,
              },
              right: 30,
              backgroundColor: theme.palette.text.primary,
              color: "#fff",
              "&:hover": {
                backgroundColor: "#006bb3",
              },
              zIndex: 1000,
            }}
            aria-label="add note"
          >
            <AddIcon sx={{ fontSize: "2.5rem" }} />
          </IconButton>
        </Tooltip>
      </Link>

      <CustomModal
        modalOpen={modalOpen}
        handleClose={() => setModalOpen(false)}
        title="Delete Confirmation"
        message="Are you sure you want to delete this note?"
        onConfirm={handleDeleteConfirm}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        darkMode={darkMode}
      />
    </Box>
  );
};

export default Notes;
