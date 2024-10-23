import { useState } from "react";
import {
  BorderColorOutlined,
  EditOutlined as EditIcon,
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { mainColor } from "../../styles/Styled";
import toast from "react-hot-toast";

const ProfileDrawer = ({ open, onClose, user, onUpdateUser }) => {
  const [avatarIcon, setAvatarIcon] = useState(
    user?.image[0]?.url || "/avatar.png"
  ); // Initialize with user image or default
  const [selectedFile, setSelectedFile] = useState(null); // Store selected image file
  const [username, setUsername] = useState(user?.username || "John Doe"); // Initialize with user username
  const [loading, setLoading] = useState(false);

  // Handle avatar edit and image selection logic
  const handleAvatarEdit = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        // Use FileReader to show the new image in the Avatar component
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarIcon(reader.result);
        };
        reader.readAsDataURL(file);

        setSelectedFile(file);
      }
    };
    input.click();
  };

  const handleUsernameEdit = () => {
    const newUsername = prompt("Enter new username", username);
    if (newUsername) {
      setUsername(newUsername);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    const formData = new FormData();
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    if (username !== user?.username) {
      formData.append("username", username);
    }

    try {
      const token = localStorage.getItem("token");
      // console.log("Token in ProfileDrawer---->", token);

      const response = await axios.post(
        "https://chambray-warp-runner.glitch.me/api/user/updateprofile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Attach token to headers
          },
          withCredentials: true,
        }
      );

      const updatedUser = response.data.user;
      // console.log("Updated----->", updatedUser);
      setAvatarIcon(updatedUser.image[0]?.url);
      // console.log("Profile updated successfully:", response.data);
      toast.success(response.data?.message);
      onUpdateUser(updatedUser);
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      console.error(
        "Failed to update profile:",
        error.response?.data || error.message,
        toast.error(error.response?.data?.error)
      );
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "90%",
          border:{
            xs:"20px solid #f0d80d8",
            sm:"20px solid #0d80d8"
          },
          maxWidth: 300,
          borderRadius: "0px 0px 0px 10px",
          height: {
            xs: "80%",
            sm: "80%",
            md: "90%",
            lg: "90%",
          },
        },
      }}
    >
      <div
        style={{
          padding: "16px",
          boxSizing: "border-box",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            marginTop: {
              xs: "5rem",
              sm: "5rem",
              md: "2rem",
              lg: "2rem",
            },
            fontWeight: 700,
          }}
        >
          Profile
        </Typography>

        {/* Avatar Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            marginTop: "50px",
          }}
        >
          <Avatar src={avatarIcon} style={{ width: 120, height: 120 }} />
          <IconButton
            onClick={handleAvatarEdit}
            style={{
              position: "absolute",
              bottom: 5,
              right: -30,
            }}
          >
            <BorderColorOutlined sx={{ fontSize: "35px", color: mainColor }} />
          </IconButton>
        </div>

        {/* Username Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            marginTop: "16px",
          }}
        >
          <Typography variant="h4">{username}</Typography>
          <IconButton
            onClick={handleUsernameEdit}
            style={{
              position: "absolute",
              bottom: 0,
              right: -43,
            }}
          >
            <EditIcon sx={{ color: mainColor }} />
          </IconButton>
        </div>

        {/* Buttons Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            marginBottom: {
              xs: "100px",
              sm: "100px",
              md: "100px",
              lg: "100px",
            },
            marginTop: "auto", // Ensure buttons are at the bottom
          }}
        >
          <Button onClick={onClose} variant="outlined" color="error">
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={handleSave}
            variant="contained"
            color="primary"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default ProfileDrawer;
