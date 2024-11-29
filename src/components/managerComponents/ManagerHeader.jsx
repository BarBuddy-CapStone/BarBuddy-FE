import React, { useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { headerConstants } from "src/lib";
import { IconButton, Menu, MenuItem, Badge, Avatar, CircularProgress, Backdrop, Typography } from "@mui/material";
import useAuthStore from "src/lib/hooks/useUserStore";
import { toast } from "react-toastify";

const getTitlePath = (pathName) => {
  const drinkDetailPattern = /^\/manager\/managerDrink\/DrinkDetail\/[^/]+$/;
  const staffDetailPattern = /^\/manager\/staff-detail\/[^/]+$/;
  const bookingDetailPattern = /^\/manager\/table-registration-detail\/[^/]+$/;
  const eventDetailPattern = /^\/manager\/event-management\/event-detail\/[^/]+$/;

  switch (true) {
    case pathName === "/manager/dashboard":
      return headerConstants.dasboard;

    case pathName === "/manager/managerDrinkCategory":
    case pathName.includes("/manager/managerDrinkCategory/managerDrink/"):
    case drinkDetailPattern.test(pathName):
    case pathName === "/manager/managerDrink/addDrink":
    case pathName === "/manager/emotional/drinkBaseEmo":
      return headerConstants.headerManager.drink;

    case pathName === "/manager/feedback":
    case pathName.includes("/manager/feedback/detail/"):
      return headerConstants.headerManager.feedback;

    case pathName === "/manager/staff":
    case pathName === "/manager/staff-creation":
    case staffDetailPattern.test(pathName):
      return headerConstants.headerManager.staff;

    case pathName === "/manager/table-type-management":
      return headerConstants.headerManager.tableType;
    case pathName === "/manager/table-management":
      return headerConstants.headerManager.table;

    case pathName === "/manager/table-registrations":
    case bookingDetailPattern.test(pathName):
      return headerConstants.headerManager.booking;

    case pathName === "/manager/payment-history":
      return headerConstants.headerManager.payment;

    case pathName === "/manager/event-management":
    case pathName === "/manager/event-management/add-event":
    case eventDetailPattern.test(pathName):
      return headerConstants.headerManager.event;

    case pathName === "/manager/managerDrinkCategory":
      return headerConstants.headerManager.drinkCategory;

    default:
      return "Manager";
  }
};

const ManagerHeader = ({ className, onMenuClick, isSidebarOpen }) => {
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.href = '/';
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
              tại chi nhánh {userInfo?.barName}
            </span>
          </div>
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

export default ManagerHeader;
