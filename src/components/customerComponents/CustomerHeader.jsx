import React, { useState, useEffect, Fragment } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import LoginForm from "src/pages/authen/Login";

const CustomerHeader = ({onLoginClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPopupLogin, setPopupLogin] = useState(false)
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.type = 'text/javascript';
  //   script.id = 'hs-script-loader';
  //   script.async = true;
  //   script.defer = true;
  //   script.src = '//js-na1.hs-scripts.com/46686268.js';
  //   document.head.appendChild(script);

  //   return () => {
  //     document.head.removeChild(script);
  //   };
  // }, []);

  return (
    <Fragment>
      <AppBar position="sticky" sx={{ backgroundColor: "#333", padding: { xs: 1, sm: 2 } ,zIndex: 49}}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "#FFA500" }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            BarBuddy
          </Link>
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, justifyContent: "center" }}>
          <Link to="/" style={{ color: "#FFA500" }}>
            Trang chủ
          </Link>
          <Link to="/contact" style={{ color: "#FFF" }}>
            Liên hệ
          </Link>
        </Box>
        <IconButton color="inherit" sx={{ ml: 2 }}>
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit" sx={{ ml: 2 }}>
          <AccountCircle />
        </IconButton>
        
        {/* Nút đăng nhập mở Popup */}
        <MenuItem onClick={onLoginClick}>Đăng nhập</MenuItem>
        
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ display: { md: "none" } }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    </Fragment>
  );
};

export default CustomerHeader;
