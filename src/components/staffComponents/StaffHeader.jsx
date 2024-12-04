import React, { useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { headerConstants } from "src/lib";
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  Badge, 
  Avatar, 
  CircularProgress, 
  Backdrop, 
  Typography,
  Box,
  Popover 
} from "@mui/material";
import useAuthStore from "src/lib/hooks/useUserStore";
import { toast } from "react-toastify";
import { useFCMToken } from "src/hooks/useFCMToken";
import { 
  getNotifications,
  markAsRead,
  markAllAsRead 
} from "src/lib/service/notificationService";
import { timeAgo } from "src/lib/Utils/Utils";

const getTitlePath = (pathName) => {
  // Sử dụng regex để match các pattern có chứa ID
  const bookingDetailPattern = /^\/staff\/table-registration-detail\/[^/]+$/;

  switch (true) {
    // Quản lý bàn
    case pathName === "/staff/table-management":
      return headerConstants.headerStaff.table;

    // Lịch sử thanh toán
    case pathName === "/staff/payment-history":
      return headerConstants.headerStaff.payment_history;

    // Quản lý đặt bàn
    case pathName === "/staff/table-registrations":
      return headerConstants.headerStaff.table_booking_list;

    // Chi tiết đặt bàn
    case bookingDetailPattern.test(pathName):
      return headerConstants.headerStaff.table_booking_detail;

    default:
      return "Nhân Viên";
  }
};

const StaffHeader = ({ className, onMenuClick, isSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = getTitlePath(location.pathname);
  const { userInfo, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Thêm states cho notification
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const { fcmToken } = useFCMToken();

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!fcmToken) return;

    setIsLoadingNotifications(true);
    try {
      const response = await getNotifications(fcmToken);
      if (response?.data?.statusCode === 200) {
        setNotifications(response.data.data);
        const unread = response.data.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // Handle notification click
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // Handle notification item click
  const handleNotificationItemClick = async (notification) => {
    if (!notification.isRead && fcmToken) {
      try {
        await markAsRead(notification.id, fcmToken);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    if (notification.webDeepLink) {
      navigate(notification.webDeepLink);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    if (!fcmToken || unreadCount === 0) return;

    try {
      await markAllAsRead(fcmToken);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

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
          <IconButton onClick={handleNotificationClick}>
            <Badge badgeContent={unreadCount} color="error">
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
              {isLoggingOut ? (
                <CircularProgress size={24} />
              ) : (
                "Đăng xuất"
              )}
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

      {/* Notification Popover */}
      <Popover
        open={Boolean(notificationAnchorEl)}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2, width: 320, bgcolor: "#FFFFFF" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: "#000000" }}>
              Thông báo ({notifications.length})
            </Typography>
            {unreadCount > 0 && (
              <Typography
                onClick={handleMarkAllAsRead}
                sx={{
                  color: "#1976d2",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Đánh dấu đã đọc
              </Typography>
            )}
          </Box>

          <Box sx={{ maxHeight: 400, overflow: "auto" }}>
            {isLoadingNotifications ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <Box
                  key={notification.id}
                  onClick={() => handleNotificationItemClick(notification)}
                  sx={{
                    p: 2,
                    mb: 1,
                    cursor: "pointer",
                    borderRadius: "8px",
                    backgroundColor: notification.isRead
                      ? "transparent"
                      : "rgba(25, 118, 210, 0.08)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        sx={{ 
                          color: "#1976d2",
                          fontWeight: "bold",
                          fontSize: "0.95rem",
                          mb: 0.5
                        }}
                      >
                        {notification.title}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: "#333333",
                          fontSize: "0.9rem",
                          mb: 0.5
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: "#666666",
                          fontSize: "0.8rem" 
                        }}
                      >
                        {timeAgo(notification.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography sx={{ textAlign: "center", color: "gray" }}>
                Không có thông báo
              </Typography>
            )}
          </Box>
        </Box>
      </Popover>

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
