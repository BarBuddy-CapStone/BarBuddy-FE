import React, { useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { headerConstants } from "src/lib";
import { IconButton, Menu, MenuItem, Badge, Avatar, CircularProgress, Backdrop, Typography } from "@mui/material";
import useAuthStore from "src/lib/hooks/useUserStore";
import { toast } from "react-toastify";

const getTitlePath = (pathName, params) => {
  // Tách đường dẫn thành các phần
  const pathParts = pathName.split('/').filter(Boolean);

  switch (pathParts[1]) {
    case "table-management":
      if (pathParts[2] === "table" && params.tableTypeId) {
        return `${headerConstants.headerStaff.table}`;
      }
      return headerConstants.headerStaff.table;

    case "table-registrations":
      return headerConstants.headerStaff.table_booking_list;

    case "payment-history":
      return headerConstants.headerStaff.payment_history;

    case "table-registration-detail":
      if (params.bookingId) {
        return `${headerConstants.headerStaff.table_booking_detail}`;
      }
      return headerConstants.headerStaff.table_booking_list;

    default:
      return "Nhân Viên";
  }
};

const StaffHeader = ({ className, onMenuClick, isSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const title = getTitlePath(location.pathname, params);
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

export default StaffHeader;
