import { Box, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../main";
import { mainColor } from "../styles/Styled";
import Loader from "../styles/Loader";

const Search = ({ open, handleClose }) => {
  const { searchQuery, setSearchQuery } = useContext(Context);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query) => {
    if (!query) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://chambray-warp-runner.glitch.me/api/note/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setSearchResults(response.data.notes);
      setHasSearched(true);
    } catch (err) {
      setError("Error fetching search results.");
      console.error("Search API Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [searchQuery]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle clicks outside the search component
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      // Close search if not focused and empty
      if (!searchQuery) {
        handleClose(); // Close search
      }
    }
  };

  useEffect(() => {
    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigate to the note page for the selected note
  const handleNoteClick = (noteId) => {
    navigate(`/note/${noteId}`);
    handleClose();
    setSearchQuery("");
  };

  {
    loading && <Loader />;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: open ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        backdropFilter: "blur(5px)",
      }}
    >
      <Box
        ref={searchRef}
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          width: { xs: "90%", sm: "60%", md: "40%" },
          boxShadow: 3,
          position: "relative",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search notes..."
          onBlur={() => {
            if (!searchQuery) {
              handleClose();
            }
          }}
        />
        {loading && <CircularProgress />}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Box sx={{ marginTop: "20px" }}>
          {searchResults.map((note) => (
            <Box
              key={note._id}
              sx={{
                margin: "10px 0",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                color: mainColor,
              }}
              onClick={() => handleNoteClick(note._id)} // Handle note click
            >
              <h3>{note.title}</h3> {/* Display only the title */}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Search;
