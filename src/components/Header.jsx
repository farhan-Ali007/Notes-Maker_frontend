import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { mainColor, poppins } from "../styles/Styled";
import Switch from "../styles/Switch";
import { Context } from "../main";
import {
  PersonOutlined as PersonIcon,
  LogoutOutlined as LogoutIcon,
  DeleteOutlined as DeleteIcon,
  SearchOutlined as SearchIcon,
} from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import CustomModal from "./modal/CustomModal";
import ProfileDrawer from "./Drawers/ProfileDrawer";
import Search from "../pages/Search";

const Header = ({ darkMode, handleThemeToggle }) => {
  const { user, isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  // console.log("User------>", user);
  const userId = user?._id;
  // console.log("Frontend id-->", userId);

  const theme = useTheme();
  const navigateTo = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
  };

  const handleOpen = (message, action) => {
    setModalMessage(message);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleClose = () => setModalOpen(false);

  const handleOpenDrawer = () => setDrawerOpen(true);

  const handleDrawerClose = () => setDrawerOpen(false);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "https://chambray-warp-runner.glitch.me/api/user/logout",
        {},
        { withCredentials: true }
      );
      // console.log("Logged out user------>", response.data);
      handleClose();
      localStorage.removeItem("token");
      setIsAuthorized(false);
      setUser({});
      navigateTo("/login");
      handleCloseUserMenu(true);
      toast.success(response.data.message);
    } catch (error) {
      console.log("Error in logout--->", error);
    }
  };

  const handleOpenNavMenu = (e) => {
    setAnchorElNav(e.currentTarget);
  };

  const handleOpenUserMenu = (e) => {
    if (isAuthorized) {
      setAnchorElUser(e.currentTarget);
    }
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prevUser) => ({
      ...prevUser,
      image: updatedUser.image,
      username: updatedUser.username,
    }));
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token of biing deleting user--->", token);
      setLoading(true);
      const response = await axios.delete(
        `https://chambray-warp-runner.glitch.me/api/user/delete/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log("User deleted successfully.");
        toast.success(response.data?.message);
        localStorage.removeItem("token");
        setUser({});
        setIsAuthorized(false);
        setLoading(false);
        navigateTo("/signup");
      }
    } catch (error) {
      setLoading(false);
      // console.log(error.response ? error.response.data.error : error.error);
      toast.error(error.response?.data?.error);
    }
  };

  {
    loading && (
      <div className="loader">
        <div className="scanner">
          <span>Deleting...</span>
        </div>
      </div>
    );
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: darkMode ? "background.default" : "rgba(255, 255, 255, 0.7)",
        boxShadow: darkMode ? "0 4px 2px -2px #0d80d8" : "0 3px 2px -2px gray",
        paddingInline: {
          md: "40px",
          lg: "40px",
        },
        paddingTop: "5px",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo Icon for large screens */}

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <img
              src={darkMode ? "/Notiqo-dark.png" : "/Notiqo.png"}
              alt="My Icon"
              style={{
                marginRight: "8px",
                width: "3.5rem",
                height: "auto",
                paddingBottom: ".5rem",
              }}
            />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: poppins,
              fontWeight: 800,
              letterSpacing: ".1rem",
              color: mainColor,
              textDecoration: "none",
              fontSize: "1.5rem",
            }}
            position={"absolute"}
            left={"3rem"}
          >
            Notiqo
          </Typography>
          {/* Hamburger Menu for small screens */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open navigation"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{
                padding: "none",
              }}
            >
              <MenuIcon sx={{ color: mainColor }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  to="/"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Home
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  to="/about"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  About
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  to="/notes"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Notes
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  to="/favorites"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Favorites
                </Link>
              </MenuItem>
            </Menu>
          </Box>
          {/* Logo for small screens */}
          <Typography
            variant="h5"
            noWrap
            style={{ color: darkMode ? "inherit" : "#0d80d8" }}
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              textDecoration: "none",
              marginLeft:"2rem"
            }}
          >
            Notiqo
          </Typography>

          {/* Links for larger screens */}

          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: { xs: "none", md: "flex" },
              paddingInline: "1rem",
              alignItems: "center",
              ":hover": "nonne",
            }}
          >
            <MenuItem
              sx={{
                ":hover": {
                  bgcolor: "inherit",
                  fontWeight: 500,
                  fontSize: "20px",
                  transition: "box-shadow 0.3s ease-in-out",
                },
              }}
            >
              <Link
                style={{ textDecoration: "none", color: mainColor }}
                to={"/"}
              >
                Home
              </Link>
            </MenuItem>
            <MenuItem
              sx={{
                ":hover": {
                  bgcolor: "inherit",
                  fontWeight: 500,
                  fontSize: "20px",
                  transition: "box-shadow 0.3s ease-in-out",
                },
              }}
            >
              <Link
                style={{ textDecoration: "none", color: mainColor }}
                to={"/about"}
              >
                About
              </Link>
            </MenuItem>
            <MenuItem
              sx={{
                ":hover": {
                  bgcolor: "inherit",
                  fontWeight: 500,
                  fontSize: "20px",
                  transition: "box-shadow 0.3s ease-in-out",
                },
              }}
            >
              <Link
                style={{ textDecoration: "none", color: mainColor }}
                to={"/notes"}
              >
                Notes
              </Link>
            </MenuItem>
            <MenuItem
              sx={{
                ":hover": {
                  bgcolor: "inherit",
                  fontWeight: 500,
                  fontSize: "20px",
                  transition: "box-shadow 0.3s ease-in-out",
                },
              }}
            >
              <Link
                style={{ textDecoration: "none", color: mainColor }}
                to={"/favorites"}
              >
                Favorites
              </Link>
            </MenuItem>
          </Box>
          {/* Search part*/}
          {isAuthorized && (
            <>
              <Tooltip title="Search" arrow sx={{ fontSize: "15px" }}>
                <IconButton onClick={toggleSearch} color="inherit">
                  <SearchIcon sx={{ color: theme.palette.text.primary }} />
                </IconButton>
              </Tooltip>
              <Search
                open={searchOpen}
                handleClose={() => setSearchOpen(false)}
              />
            </>
          )}
          {/* light and dark mode */}
          <Switch checked={darkMode} onChange={handleThemeToggle} />

          {/* User avatar */}

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={isAuthorized ? handleOpenUserMenu : undefined}
                sx={{
                  p: 0,
                  marginLeft: {
                    xs: "10px",
                    md: "10px",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: {
                      xs: 40,
                      sm: 48,
                      md: 54,
                      lg: 54,
                      xl: 80,
                    },
                    height: {
                      xs: 40,
                      sm: 48,
                      md: 54,
                      lg: 54,
                      xl: 80,
                    },
                  }}
                  alt="User Avatar"
                  src={
                    user && Array.isArray(user.image) && user.image.length > 0
                      ? user.image[0].url
                      : "/avatar.png"
                  }
                />
              </IconButton>
            </Tooltip>

            {isAuthorized ? (
              <Menu
                sx={{ mt: "60px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {isAuthorized && (
                  <div>
                    <MenuItem
                      onClick={handleCloseUserMenu}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Link
                        to="#"
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={handleOpenDrawer}
                      >
                        <PersonIcon
                          sx={{
                            color: darkMode
                              ? theme.palette.text.primary
                              : undefined,
                            marginRight: "8px",
                          }}
                        />
                        Profile
                      </Link>
                    </MenuItem>
                    <ProfileDrawer
                      user={user}
                      open={drawerOpen}
                      onClose={handleDrawerClose}
                      onUpdateUser={updateUserProfile}
                    />
                    <MenuItem
                      onClick={() =>
                        handleOpen("Are you sure you want to logout?", "logout")
                      }
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <span
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <LogoutIcon
                          sx={{
                            color: darkMode
                              ? theme.palette.text.primary
                              : undefined,
                            marginRight: "8px",
                          }}
                        />
                        Logout
                      </span>
                    </MenuItem>

                    <MenuItem
                      onClick={() =>
                        handleOpen(
                          "Are you sure you want to delete your account?",
                          "delete"
                        )
                      }
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <span
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <DeleteIcon
                          sx={{
                            color: darkMode
                              ? theme.palette.text.primary
                              : undefined,
                            marginRight: "8px",
                          }}
                        />
                        Delete account
                      </span>
                    </MenuItem>

                    <CustomModal
                      onConfirm={
                        modalAction === "logout" ? handleLogout : handleDelete
                      }
                      handleClose={handleClose}
                      modalOpen={modalOpen}
                      message={modalMessage}
                      darkMode={darkMode}
                    />
                  </div>
                )}
              </Menu>
            ) : undefined}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
