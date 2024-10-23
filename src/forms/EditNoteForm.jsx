import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Stack,
  Typography,
  useTheme,
  IconButton,
  Divider,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { mainColor, white } from "../styles/Styled";

const EditNoteForm = ({ darkMode, note, onSubmit }) => {
  const theme = useTheme();
  const navigateTo = useNavigate();

  const [title, setTitle] = useState(note?.title || "");
  const [tag, setTag] = useState(note?.tag || "");
  const contentRef = useRef(null);
  const [images, setImages] = useState([]); // New images to upload
  const [existingImages, setExistingImages] = useState(note?.images || []); // Existing images
  const [deletedImages, setDeletedImages] = useState([]); // Images marked for deletion
  const [loading, setLoading] = useState(false);

  // Display loading message if note is not available
  if (!note) {
    return <Typography>Loading note...</Typography>;
  }

  // Update the note on form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (loading) return;

    const content = contentRef.current.innerHTML;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tag", tag);

    // console.log("New images before submit:------->", images);

    // Append new images to formData
    images.forEach((image) => {
      formData.append("images", image.file);
    });

    // Append deleted images if any
    if (deletedImages.length > 0) {
      formData.append("deletedImages", JSON.stringify(deletedImages));
      // console.log("Deleted images:--------->", deletedImages);
    }

    setLoading(true); // Set loading to true before making the API call

    try {
      await onSubmit(formData);
      // toast.success("Note updated successfully!");
      navigateTo("/notes");
    } catch (error) {
      toast.error("Failed to update note.");
      console.error("Error updating note:", error);
    } finally {
      setLoading(false); // Set loading to false after the process
    }
  };

  // Handle image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    // Create preview URLs for the uploaded files
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        // Push the image with its preview into newImages
        newImages.push({ file, preview: event.target.result });

        // Once all files are processed, update the images state
        if (newImages.length === files.length) {
          setImages((prevImages) => [...prevImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (publicId) => {
    setDeletedImages((prev) => [...prev, publicId]);
    setExistingImages((prev) =>
      prev.filter((img) => img.public_id !== publicId)
    );
  };

  // Handle deleting a newly uploaded image
  const handleDeleteNewImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Remove from newly uploaded images
  };

  // Populate content editor with existing note content
  useEffect(() => {
    if (note?.content && contentRef.current) {
      contentRef.current.innerHTML = note.content;
    }
  }, [note]);

  return (
    <Box
      minHeight="100vh"
      sx={{
        backgroundColor: darkMode ? theme.palette.background.default : "#fff",
        padding: "40px 0px",
      }}
    >
      <Box
        p={4}
        sx={{
          backgroundColor: darkMode ? "#2d2d2d" : "#f7f7f7",
          borderRadius: {
            xs: "none",
            md: "12px",
          },
          minheight: "90vh",
          boxShadow: darkMode
            ? "0px 0px 5px 4px #0d80d8"
            : "0px 0px 5px 4px gray",
          transition: "box-shadow 0.3s ease-in-out",
          maxWidth: "700px",
          mx: "auto",
          mt: {
            xs: "none",
            md: 5,
          },
          mb: {
            xs: "none",
            md: 5,
          },
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            fontWeight: "bold",
            color: theme.palette.text.primary,
            mb: 3,
          }}
        >
          Edit Your Note
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Note Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                backgroundColor: darkMode ? "#424242" : "#ffffff",
                input: {
                  color: darkMode ? theme.palette.text.primary : "#000000",
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: darkMode ? "#ffffff" : "#000000" }}>
                Tag
              </InputLabel>
              <Select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                sx={{
                  backgroundColor: darkMode ? "#424242" : "#ffffff",
                  color: darkMode ? theme.palette.text.primary : "#000000",
                  ".MuiSvgIcon-root": {
                    color: darkMode ? "#ffffff" : "#000000",
                  },
                }}
              >
                {[
                  "Home work",
                  "Office work",
                  "Class work",
                  "Life work",
                  "Test",
                  "Learning",
                  "Goals",
                  "Important",
                  "Idea",
                  "Reminder",
                  "Other",
                ].map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div
              contentEditable
              ref={contentRef}
              style={{
                border: "2px dashed",
                padding: "16px",
                minHeight: "200px",
                backgroundColor: white,
                color: mainColor,
                borderRadius: "8px",
                whiteSpace: "pre-wrap",
                overflowY: "auto",
                maxHeight: "300px",
              }}
            ></div>

            <div>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Existing Images
              </Typography>
              <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                {existingImages.map((image) => (
                  <div key={image.public_id} style={{ position: "relative" }}>
                    <img
                      src={image.url}
                      alt="note image"
                      style={{ maxWidth: "150px", borderRadius: "8px" }}
                    />
                    <IconButton
                      onClick={() => handleDeleteImage(image.public_id)}
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
            </div>

            <div>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                New Images
              </Typography>
              <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                {images.map((image, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={image.preview}
                      alt="new upload"
                      style={{ maxWidth: "150px", borderRadius: "8px" }}
                    />
                    <IconButton
                      onClick={() => handleDeleteNewImage(index)}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "red",
                        borderRadius: "1px solid red",
                        padding: "5px 10px",
                      }}
                    >
                      X
                    </IconButton>
                  </div>
                ))}
              </Stack>
            </div>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: darkMode ? "#ffffff" : "#000000",
                  color: darkMode ? "#ffffff" : "#000000",
                }}
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              <IconButton
                color="primary"
                aria-label="upload images"
                component="label"
              >
                <input
                  hidden
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={handleImageUpload}
                />
                <PhotoCamera />
              </IconButton>
            </Stack>

            <Divider />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: darkMode ? "#0d80d8" : "#1976d2",
                color: "#ffffff",
                mt: 2,
              }}
            >
              {loading ? "Updating..." : "Update Note"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default EditNoteForm;
