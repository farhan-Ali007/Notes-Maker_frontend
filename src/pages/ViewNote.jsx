import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../styles/Loader";
import jsPDF from "jspdf";
import { white } from "../styles/Styled";

const ViewNote = ({ darkMode }) => {
  const { id } = useParams();
  const theme = useTheme();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://chambray-warp-runner.glitch.me/api/note/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setNote(response.data.note);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching note:", error);
        setError("Failed to fetch note");
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!note) {
    return <Typography>No note found.</Typography>;
  }

  const removeImageTags = (html) => {
    return html.replace(/<img[^>]*>/g, "");
  };

  // Function to download note as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(note.title, 10, 10); // Title
    doc.setFontSize(12);
    doc.text(`Author: ${note.author.username}`, 10, 20); // Author
    doc.text(
      `Created At: ${new Date(note.createdAt).toLocaleDateString()}`,
      10,
      30
    ); // Date
    doc.text("Content:", 10, 40); // Content Header

    // Clean content for PDF
    const content = removeImageTags(note.content).replace(/<br\s*\/?>/gi, "\n");
    const splitContent = doc.splitTextToSize(content, 180); // Split text to fit PDF width
    let yPosition = 50; // Initial y position for content

    // Add content to PDF
    doc.text(splitContent, 10, yPosition); // Add content to PDF
    yPosition += splitContent.length * 6; // Adjust y position for the next content

    // Adding images if they exist
    if (note.images && note.images.length > 0) {
      note.images.forEach((image, index) => {
        // Load the image
        const img = new Image();
        img.src = image.url;

        img.onload = function () {
          // Set maximum dimensions for images
          const maxWidth = 180; // Maximum width for images
          const maxHeight = 100; // Maximum height for images

          // Calculate the new dimensions while maintaining the aspect ratio
          let width = img.width;
          let height = img.height;

          // Calculate the aspect ratio
          const aspectRatio = width / height;

          // Adjust dimensions based on the maximum constraints
          if (width > maxWidth) {
            width = maxWidth;
            height = maxWidth / aspectRatio; // Maintain aspect ratio
          }
          if (height > maxHeight) {
            height = maxHeight;
            width = maxHeight * aspectRatio; // Maintain aspect ratio
          }

          // Add image to PDF with calculated dimensions
          doc.addImage(img, "JPEG", 10, yPosition, width, height); // Adjust positioning and size as needed
          yPosition += height + 10; // Increment y position for the next image (with some spacing)

          // Check if we need to add a new page for content overflow
          if (yPosition + 10 > doc.internal.pageSize.height) {
            doc.addPage(); // Add a new page if overflow
            yPosition = 10; // Reset y position
          }

          // Save the PDF after all images are added
          if (index === note.images.length - 1) {
            doc.save(`${note.title}.pdf`); // Save the PDF
          }
        };
      });
    } else {
      doc.save(`${note.title}.pdf`); // Save the PDF if no images
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : "white",
        padding: { xs: "10px", sm: "20px" },
      }}
    >
      <Box
        sx={{
          maxWidth: "800px",
          margin: "auto",
          padding: { xs: "10px", sm: "20px" },
          backgroundColor:
            theme.palette.mode === "dark" ? theme.palette.grey[800] : "white",
          borderRadius: {
            xs: "none",
            md: "10px",
          },
          boxShadow: {
            xs: "none",
            md:
              theme.palette.mode === "dark"
                ? "0px 0px 5px 4px #0d80d8"
                : "0px 0px 3px 2px gray",
          },
          mt: {
            xs: "0px",
            md: "20px",
          },
        }}
      >
        {/* Tags */}
        <Box sx={{ marginBottom: "20px", textAlign: "center" }}>
          {note.tag && note.tag.length > 0 && (
            <Chip
              label={note.tag[0]}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.text.primary
                    : note.bgColor,
                fontSize: "1rem",
                color: note.color,
                fontWeight: "bold",
                p: "5px",
              }}
            />
          )}
        </Box>

        <Divider
          sx={{ marginBottom: "20px", backgroundColor: theme.palette.divider }}
        />
        {/* Title */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: "20px",
            fontWeight: "bold",
            color: theme.palette.text.primary,
            textAlign: "center",
          }}
        >
          {note.title}
        </Typography>

        {/* Content */}
        <Typography
          variant="body1"
          component="p"
          sx={{
            mb: "20px",
            whiteSpace: "pre-wrap",
            color: theme.palette.text.secondary,
          }}
          dangerouslySetInnerHTML={{ __html: removeImageTags(note.content) }}
        />

        {/* Images */}
        {note.images && (
          <Grid container spacing={2} sx={{ marginTop: "20px" }}>
            {note.images.map((image, index) => (
              <Grid item xs={12} sm={6} key={image._id || index}>
                <Card>
                  <CardMedia
                    component="img"
                    image={image.url}
                    alt={`Note Image ${index + 1}`}
                    sx={{
                      height: "auto",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Author and Date */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "20px",
            p: "10px 15px",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            Author: {note.author.username}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={downloadPDF}
            sx={{
              textTransform: "capitalize",
              padding: {
                xs: "8px 16px",
                sm: "10px 20px",
                md: "12px 24px",
              },
              fontSize: {
                xs: "0.8rem",
                sm: "1rem",
                md: "1.125rem",
              },
              ":hover": {
                color: "white",
                background: theme.palette.text.primary,
              },
              marginRight:"1rem"
            }}
          >
            Download as PDF
          </Button>

          <Typography variant="body2" color={theme.palette.text.primary}>
            Created At: {new Date(note.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewNote;
