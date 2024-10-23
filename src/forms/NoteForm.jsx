import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import React, { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { black, mainColor, white } from "../styles/Styled";
import { PhotoCamera } from "@mui/icons-material";

const NoteForm = ({ darkMode }) => {
  const theme = useTheme();
  const navigateTo = useNavigate();

  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const contentRef = useRef(null);
  const [images, setImages] = useState([]); // Store both the File and preview URL
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let content = contentRef.current.innerHTML;

    images.forEach((_, index) => {
      content = content.replace(
        /<img[^>]+src="([^">]+)"[^>]*>/g,
        `<img-placeholder-${index} />`
      );
    });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tag", tag);

    images.forEach((image) => {
      formData.append("images", image.file);
    });

    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await axios.post(
        "https://chambray-warp-runner.glitch.me/api/note/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setTitle("");
      contentRef.current.innerText = "";
      setTag("");
      setImages([]); // Clear images after submit
      setLoading(false);
      toast.success(response.data?.message);
      navigateTo("/notes");
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // Handle image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        newImages.push({ file, preview: event.target.result });

        if (newImages.length === files.length) {
          setImages((prevImages) => [...prevImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle deleting a newly uploaded image
  const handleDeleteNewImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "90vh",
        backgroundColor: darkMode
          ? theme.palette.background.default
          : "#ffffff",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: "sans-serif",
          fontWeight: 700,
          marginTop: {
            xs: "0px",
            md: "1rem",
          },
          marginBottom: {
            xs: "1rem",
            md: "1rem",
          },
          color: mainColor,
        }}
      >
        Create Note
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        p={3}
        sx={{
          width: { xs: "90%", sm: "60%", md: "50%" },
          boxShadow: darkMode
            ? "0px 0px 5px 4px #0d80d8"
            : "0px 0px 0px 1px gray",
          transition: "box-shadow 0.4s ease-in-out",
          backgroundColor: darkMode ? "#333333" : "#fff",
          borderRadius: 2,
          minHeight: {
            xs: "75vh",
            md: "80vh",
          },
          marginBottom: {
            xs: "10px",
            md: "2rem",
          },
          "&:hover": {
            boxShadow: darkMode
              ? "0px 0px 16px 6px #0d80d8"
              : "0px 0px 16px 6px gray",
          },
        }}
      >
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          sx={{
            backgroundColor: darkMode ? "#424242" : "#ffffff",
            color: darkMode ? "#ffffff" : "#000000",
            input: {
              color: darkMode ? "#ffffff" : "#000000",
            },
          }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel
            id="tags-label"
            sx={{ color: darkMode ? "#ffffff" : "#000000" }}
          >
            Tags
          </InputLabel>
          <Select
            labelId="tags-label"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            required
            sx={{
              backgroundColor: darkMode ? "#424242" : "#ffffff",
              color: darkMode ? "#ffffff" : "#000000",
            }}
          >
            <MenuItem value="Home work">Home work</MenuItem>
            <MenuItem value="Office work">Office work</MenuItem>
            <MenuItem value="Class work">Class work</MenuItem>
            <MenuItem value="Life work">Life work</MenuItem>
            <MenuItem value="Test">Test</MenuItem>
            <MenuItem value="Learning">Learning</MenuItem>
            <MenuItem value="Goals">Goals</MenuItem>
            <MenuItem value="Important">Important</MenuItem>
            <MenuItem value="Idea">Idea</MenuItem>
            <MenuItem value="Reminder">Reminder</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <div
          contentEditable
          ref={contentRef}
          style={{
            border: "1px solid #ccc",
            minHeight: "200px",
            padding: "10px",
            borderRadius: "4px",
            marginTop: "16px",
            backgroundColor: darkMode ? "#333" : "#ffffff",
            color: darkMode ? "#ffffff" : "#000000",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            height: "auto",
            maxHeight: "500px",
          }}
        ></div>

        <Typography
          variant="subtitle1"
          sx={{ mt: 2, color: darkMode ? white : black }}
        >
          Images
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
          {images.map((image, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={image.preview}
                alt="new upload"
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  borderRadius: "8px",
                }}
              />
              <IconButton
                onClick={() => handleDeleteNewImage(index)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  color: "red",
                }}
              >
                X
              </IconButton>
            </div>
          ))}
        </Stack>

        <Button
          variant="outlined"
          component="label"
          sx={{
            mt: 2,
            color: darkMode ? "#ffffff" : "#000000",
            borderColor: darkMode ? "#ffffff" : "#000000",
            ":hover": {
              background: theme.palette.text.primary,
            },
          }}
        >
          Upload Images
          <input
            type="file"
            hidden
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </Button>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: theme.palette.text.primary,
            color: darkMode ? "#ffffff" : "#ffffff",
          }}
        >
          {loading ? "Creating..." : "Create Note"}
        </Button>
      </Box>
    </Stack>
  );
};

export default NoteForm;
