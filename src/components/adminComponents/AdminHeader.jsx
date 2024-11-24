import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  Avatar,
  Backdrop,
  Badge,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { headerConstants } from "src/lib";
import useAuthStore from "src/lib/hooks/useUserStore";

const getTitlePath = (pathName) => {
  const managerDetailPattern = /^\/admin\/manager-detail\/[^/]+$/;
  const customerDetailPattern = /^\/admin\/customer-detail\/[^/]+$/;
  const feedbackDetailPattern = /^\/admin\/feedbackdetail\/[^/]+$/;

  switch (true) {
    case pathName === "/admin/dashboard":
      return headerConstants.dasboard;

    case pathName === "/admin/barmanager":
    case pathName === "/admin/addbar":
    case pathName === "/admin/barProfile":
      return headerConstants.managerBarBranch;

    // ManagerAccount - bao gồm cả list và detail
    //admin/manager-creation
    case pathName === "/admin/managers":
    case pathName === "/admin/manager-creation":
    case managerDetailPattern.test(pathName):
      return headerConstants.manager;

    case pathName === "/admin/table-type-management":
      return headerConstants.tableType;

    case pathName === "/admin/drink-categories":
      return headerConstants.drinkCategory;

    case pathName === "/admin/payment-history":
      return headerConstants.payment;

    // Customer - bao gồm cả list và detail
    case pathName === "/admin/customers":
    case pathName === "/admin/customer-creation":
    case customerDetailPattern.test(pathName):
      return headerConstants.customer;

    case pathName === "/admin/emotional":
      return headerConstants.emotional;

    // Feedback - bao gồm cả list và detail
    case pathName === "/admin/feedback":
    case feedbackDetailPattern.test(pathName):
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
      sessionStorage.clear();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất");
    } finally {
      setIsLoggingOut(false);
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
            <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? <CircularProgress size={24} /> : "Đăng xuất"}
            </MenuItem>
          </Menu>
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-sm font-medium text-gray-700">
              Welcome {userInfo?.fullname}
            </span>
            <span className="text-xs text-gray-500">
              Admin
            </span>
          </div>
        </div>
      </header>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
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
