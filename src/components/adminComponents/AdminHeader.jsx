import React, { useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { headerConstants } from "src/lib";
import { IconButton, Menu, MenuItem, Badge, Avatar, CircularProgress, Backdrop, Typography } from "@mui/material";
import useAuthStore from "src/lib/hooks/useUserStore";
import { toast } from "react-toastify";

const getTitlePath = (pathName) => {
  switch (pathName) {
    case "/admin/dashboard":
      return headerConstants.dasboard;

    case "/admin/barmanager":
      return headerConstants.managerBarBranch;
    case "/admin/addbar":
      return headerConstants.managerBarBranch;
    case "/admin/barProfile":
      return headerConstants.managerBarBranch;

    case "/admin/table-type-management":
      return headerConstants.tableType;

    case "/admin/payment-history":
      return headerConstants.payment;

    case "/admin/customers":
      return headerConstants.customer;
    case "/admin/customer-creation":
      return headerConstants.customer;
    case "/admin/customer-detail":
      return headerConstants.customer;

    case "/admin/emotional":
      return headerConstants.emotional;

    case "/admin/feedback":
      return headerConstants.feedback;

    case "/admin/feedbackdetail":
      return headerConstants.feedback;

    default:
      return "Admin";
  }
};

const AdminHeader = ({ className, onMenuClick, isSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = getTitlePath(location.pathname);
  const { userInfo, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      handleMenuClose();
      // Thêm delay để hiển thị loading spinner
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate("/home");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <header className={`flex justify-between items-center p-4 ${className}`}>
        <div className="flex items-center">
          <button 
            className="mr-4 md:hidden" 
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <MenuIcon />
          </button>
          <h1 className="text-2xl font-bold text-sky-900 px-2">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <IconButton aria-label="Notifications">
            <Badge color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={handleMenuClick}>
            <Avatar src={userInfo?.image} alt={userInfo?.fullname}>
              {userInfo?.fullname?.charAt(0)}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Hồ sơ</MenuItem>
            <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? (
                <CircularProgress size={24} />
              ) : (
                "Đăng xuất"
              )}
            </MenuItem>
          </Menu>
        </div>
      </header>
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2 
        }}
        open={isLoggingOut}
      >
        <CircularProgress color="inherit" />
        <Typography>Đang đăng xuất...</Typography>
      </Backdrop>
    </>
  );
};

export default AdminHeader;
