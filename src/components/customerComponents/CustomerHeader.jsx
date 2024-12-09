import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  AppBar,
  Badge,
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFCMToken } from "src/hooks/useFCMToken";
import { useAuthStore } from "src/lib";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "src/lib/service/notificationService";
import { timeAgo } from "src/lib/Utils/Utils";
import { ForgetPassword, Login, Registration } from "src/pages";
import { createNotificationConnection, startNotificationConnection } from "src/lib/Third-party/signalR/notificationHubConnection";

const baseURL = import.meta.env.VITE_BASE_URL;

const CustomerHeader = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const { isLoggedIn, userInfo, logout } = useAuthStore();
  const navigate = useNavigate();

  const [accountId, setAccountId] = useState(null);

  // State cho popup thông báo
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const { fcmToken } = useFCMToken();

  const [openForgetPassword, setOpenForgetPassword] = useState(false);

  useEffect(() => {
    const storedUserInfo = Cookies.get("userInfo");
    if (storedUserInfo) {
      const userInfoParsed = JSON.parse(storedUserInfo);
      setAccountId(userInfoParsed.accountId);
    }
  }, []);

  // Thêm useEffect để fetch notifications khi component mount và khi fcmToken thay đổi
  useEffect(() => {
    if (isLoggedIn && accountId) {
      // Khởi tạo SignalR connection
      const connection = createNotificationConnection(accountId);
      
      // Lắng nghe sự kiện nhận notification mới
      const handleNewNotification = (event) => {
        const newNotification = event.detail;
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      };

      // Đăng ký lắng nghe sự kiện
      document.addEventListener('notificationReceived', handleNewNotification);

      // Kết nối SignalR
      startNotificationConnection(connection);

      // Initial fetch
      fetchNotifications();

      return () => {
        // Cleanup
        document.removeEventListener('notificationReceived', handleNewNotification);
        connection?.stop();
      };
    }
  }, [isLoggedIn, accountId, fcmToken]);

  const handleMenuClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      handleMenuClose();

      // Hiển thị loading overlay trong 1 giây
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Xóa dữ liệu và chuyển hướng
      sessionStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất");
      setIsLoggingOut(false);
    }
  };

  const handleOpenLogin = () => {
    setOpenLogin(true);
    setOpenRegister(false); // Đảm bảo chỉ mở một popup
  };

  const handleCloseLogin = () => setOpenLogin(false);

  const handleOpenRegister = () => {
    setOpenRegister(true);
    setOpenLogin(false); // Đảm bảo chỉ mở một popup
  };

  const handleCloseRegister = () => setOpenRegister(false);

  const handleLoginSuccess = (userData) => {
    setOpenLogin(false);
    setAnchorEl(null);
  };

  // Sửa lại hàm fetch notifications
  const fetchNotifications = async () => {
    if (!fcmToken || !isLoggedIn) {
      console.log("No FCM token available or user not logged in");
      return;
    }

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

  // Sửa lại phần xử lý click notification icon
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

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

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // Thêm component LoadingOverlay
  const LoadingOverlay = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <CircularProgress size={60} sx={{ color: "#FFA500" }} />
      <Typography sx={{ color: "white", fontSize: "1.2rem" }}>
        Đang đăng xuất...
      </Typography>
    </div>
  );

  const handleOpenForgetPassword = () => {
    setOpenLogin(false);
    setOpenForgetPassword(true);
  };

  const handleCloseForgetPassword = () => {
    setOpenForgetPassword(false);
  };

  const handleSwitchToLogin = () => {
    setOpenForgetPassword(false);
    setOpenLogin(true);
  };

  return (
    <Fragment>
      {isLoggingOut && <LoadingOverlay />}

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

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link
              to="/"
              style={{
                color: "#FFA500",
                fontSize: "14px",
                fontWeight: "400",
                textDecoration: "none",
                padding: "0 8px",
              }}
            >
              Trang chủ
            </Link>
            {/* <Link
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
            </Link> */}

            {!isLoggedIn ? (
              <>
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
                  onClick={handleOpenLogin}
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
                  onClick={handleOpenRegister}
                >
                  Đăng ký
                </MenuItem>
              </>
            ) : (
              <Box display="flex" alignItems="center" sx={{ gap: 4 }}>
                <IconButton color="inherit" onClick={handleNotificationClick}>
                  <Badge
                    badgeContent={unreadCount}
                    color="error"
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#FF4444",
                        color: "white",
                      },
                    }}
                  >
                    <NotificationsIcon
                      sx={{
                        color: unreadCount > 0 ? "#FFA500" : "#FFF",
                        transition: "color 0.3s ease",
                      }}
                    />
                  </Badge>
                </IconButton>

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
                  <Box sx={{ p: 2, width: 320, bgcolor: "#1E1E1E" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: "#FFF" }}>
                        Thông báo ({notifications.length})
                      </Typography>
                      {unreadCount > 0 && (
                        <Typography
                          onClick={handleMarkAllAsRead}
                          sx={{
                            color: "#FFA500",
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
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            p: 2,
                          }}
                        >
                          <CircularProgress size={24} />
                        </Box>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <Box
                            key={notification.id}
                            onClick={() =>
                              handleNotificationItemClick(notification)
                            }
                            sx={{
                              p: 2,
                              mb: 1,
                              cursor: "pointer",
                              borderRadius: "8px",
                              backgroundColor: notification.isRead
                                ? "transparent"
                                : "rgba(45, 136, 255, 0.1)",
                              "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                              },
                              transition: "background-color 0.2s ease",
                            }}
                          >
                            <Box sx={{ display: "flex", gap: 2 }}>
                              {notification.imageUrl && (
                                <Box
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (notification.webDeepLink) {
                                      navigate(notification.webDeepLink);
                                    }
                                  }}
                                  sx={{
                                    width: 60,
                                    height: 60,
                                    flexShrink: 0,
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                                    cursor: notification.webDeepLink
                                      ? "pointer"
                                      : "default",
                                  }}
                                >
                                  <img
                                    src={notification.imageUrl}
                                    alt=""
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                </Box>
                              )}
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  sx={{
                                    color: "#FFA500",
                                    fontSize: "0.9rem",
                                    fontWeight: "bold",
                                    mb: 0.5,
                                  }}
                                >
                                  {notification.title}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#e4e6eb",
                                    fontSize: "0.85rem",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {notification.message}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mt: 0.5,
                                  }}
                                >
                                  {notification.barName && (
                                    <Typography
                                      sx={{
                                        color: "#FFA500",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      {notification.barName}
                                    </Typography>
                                  )}
                                  <Typography
                                    sx={{
                                      color: "#B0B3B8",
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    • {timeAgo(new Date(notification.timestamp || notification.createdAt).getTime())}
                                  </Typography>
                                </Box>
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

                <Box
                  display="flex"
                  alignItems="center"
                  onClick={handleMenuClick}
                  sx={{
                    cursor: "pointer",
                    padding: "0 8px",
                    "&:hover": {
                      opacity: 0.7,
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
                    zIndex: 1300,
                  }}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate(`/profile/${accountId}`);
                      handleMenuClose();
                    }}
                  >
                    Hồ sơ
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    sx={{
                      display: "flex",
                      gap: "8px",
                      color: isLoggingOut ? "gray" : "inherit",
                    }}
                  >
                    {isLoggingOut ? (
                      <>
                        <CircularProgress size={20} />
                        Đang đăng xuất...
                      </>
                    ) : (
                      "Đăng xuất"
                    )}
                  </MenuItem>
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
            borderRadius: "16px",
            backgroundColor: "#333",
          },
        }}
      >
        <Login
          onClose={handleCloseLogin}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={handleOpenRegister}
          onSwitchToForgetPassword={handleOpenForgetPassword}
        />
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
        <Registration
          onClose={handleCloseRegister}
          onSwitchToLogin={handleOpenLogin}
        />
      </Dialog>

      <Dialog
        open={openForgetPassword}
        onClose={handleCloseForgetPassword}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            backgroundColor: "#333",
          },
        }}
      >
        <ForgetPassword
          onClose={handleCloseForgetPassword}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </Dialog>
    </Fragment>
  );
};

export default CustomerHeader;
