import React, { useState, Fragment } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  MenuItem,
  Menu,
  Dialog,
  Badge,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "src/lib";
import MenuIcon from "@mui/icons-material/Menu";
import { Login, Registration } from "src/pages";
import { toast } from "react-toastify";

const CustomerHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null); // State for the dropdown menu
  const [openLogin, setOpenLogin] = useState(false); // State for login popup
  const [openRegister, setOpenRegister] = useState(false); // State for register popup
  const { isLoggedIn, userInfo, logout } = useAuthStore(); // Access logout from the store
  const navigate = useNavigate();

  // Handle opening/closing the dropdown menu when clicking on the profile icon or name
  const handleMenuClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null); // Close the dropdown if it's already open
    } else {
      setAnchorEl(event.currentTarget); // Open the dropdown
    }
  };

  // Handle closing the dropdown menu
  const handleMenuClose = () => {
    setAnchorEl(null); // Close the dropdown
  };

  // Handle logout and clear session
  const handleLogout = () => {
    logout(); // Call the logout function from useAuthStore to clear session
    setAnchorEl(null); // Close the dropdown
    toast.success("Thành công");
    navigate("/home"); // Redirect to home
  };

  // Handlers to open/close login and register popups
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);

  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);

  // Update this function to ensure closing login dialog upon successful login
  const handleLoginSuccess = (userData) => {
    setOpenLogin(false); // Close the login dialog
    setAnchorEl(null); // Ensure dropdown menu closes after login
    // Any additional login success behavior can go here
  };

  return (
    <Fragment>
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "#333", padding: { xs: 1, sm: 2 }, zIndex: 49 }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#FFA500" }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              BarBuddy
            </Link>
          </Typography>

          {/* Box container for alignment */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Link elements with consistent styles */}
            <Link
              to="/"
              style={{
                color: "#FFA500",
                fontSize: "14px",
                fontWeight: "400",
                textDecoration: "none",
                padding: "0 8px", // Padding for even spacing
              }}
            >
              Trang chủ
            </Link>
            <Link
              to="/contact"
              style={{
                color: "#FFF",
                fontSize: "14px",
                fontWeight: "400",
                textDecoration: "none",
                padding: "0 8px",
              }}
            >
              Liên hệ
            </Link>

            {/* Show login and register if not logged in */}
            {!isLoggedIn ? (
              <>
                {/* MenuItem elements with consistent styles */}
                <MenuItem
                  sx={{
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "400",
                    padding: "0 8px", // Padding for even spacing
                    "&:hover": {
                      color: "#FFA500",
                      transform: "translateY(2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={handleOpenLogin} // Mở popup đăng nhập
                >
                  Đăng nhập
                </MenuItem>
                <MenuItem
                  sx={{
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "400",
                    padding: "0 8px",
                    "&:hover": {
                      color: "#FFA500",
                      transform: "translateY(2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={handleOpenRegister} // Mở popup đăng ký
                >
                  Đăng ký
                </MenuItem>
              </>
            ) : (
              <Box display="flex" alignItems="center" sx={{ gap: 4 }}> {/* Tạo khoảng cách lớn hơn giữa các icon */}
                {/* Icon chuông thông báo */}
                <IconButton color="inherit">
                  <Badge  color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* Profile and Account Dropdown */}
                <Box
                  display="flex"
                  alignItems="center"
                  onClick={handleMenuClick} // Single click handler for the entire box (icon + name)
                  sx={{
                    cursor: "pointer",
                    padding: "0 8px", // Ensure the padding around the profile area is consistent
                    "&:hover": {
                      opacity: 0.7, // Fade the entire profile section on hover
                    },
                  }}
                >
                  <IconButton color="inherit">
                    {userInfo?.image ? (
                      <img
                        src={userInfo.image}
                        alt="Profile"
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <AccountCircle />
                    )}
                  </IconButton>
                  <Typography
                    sx={{
                      color: "#FFF",
                      marginLeft: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {userInfo?.fullname}
                  </Typography>
                </Box>

                {/* Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  sx={{
                    zIndex: 1300, // Ensure the dropdown is above other content
                  }}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { navigate("/payment"); handleMenuClose(); }}>
                    Payment
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            )}
          </Box>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Dialog
        open={openLogin}
        onClose={handleCloseLogin}
        PaperProps={{
          sx: {
            borderRadius: "16px", // Ensure the border radius is applied once
            backgroundColor: "#333",
          },
        }}
      >
        <Login onClose={handleCloseLogin} onLoginSuccess={handleLoginSuccess} />
      </Dialog>

      <Dialog
        open={openRegister}
        onClose={handleCloseRegister}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            backgroundColor: "#333",
          },
        }}
      >
        <Registration onClose={handleCloseRegister} />
      </Dialog>
    </Fragment>
  );
};

export default CustomerHeader;
