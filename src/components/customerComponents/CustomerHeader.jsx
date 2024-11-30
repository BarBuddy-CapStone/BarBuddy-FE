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
  Typography
} from "@mui/material";
import Cookies from "js-cookie";
import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "src/lib";
import { getNotificationByAccountId, markNotificationsAsRead } from "src/lib/service/notificationService"; // Import hàm
import { timeAgo } from "src/lib/Utils/Utils";
import { Login, Registration, ForgetPassword } from "src/pages";

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

  const [notifications, setNotifications] = useState([]); // State lưu trữ thông báo

  const [unreadCount, setUnreadCount] = useState(0);

  const [openForgetPassword, setOpenForgetPassword] = useState(false);

  useEffect(() => {
    const storedUserInfo = Cookies.get('userInfo');
    if (storedUserInfo) {
      const userInfoParsed = JSON.parse(storedUserInfo);
      setAccountId(userInfoParsed.accountId);
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotificationByAccountId();
        
        setNotifications(response.data.data.notificationResponses); // Lưu trữ dữ liệu thông báo
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (notifications) {
      const unreadNotifications = notifications.filter(notif => !notif.isRead);
      setUnreadCount(unreadNotifications.length);
    }
  }, [notifications]);

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Xóa dữ liệu và chuyển hướng
      sessionStorage.clear();
      window.location.href = '/';
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

  // Mở popup thông báo
  const handleNotificationClick = async (event) => {
    setNotificationAnchorEl(event.currentTarget);
    
    // Nếu có thông báo chưa đọc, đánh dấu tất cả là đã đọc
    if (unreadCount > 0 && accountId) {
      try {
        await markNotificationsAsRead(accountId);
        
        // Cập nhật state local
        setNotifications(notifications.map(notif => ({
          ...notif,
          isRead: true
        })));
        setUnreadCount(0);
      } catch (error) {
        console.error("Lỗi khi đánh dấu đã đọc:", error);
      }
    }
  };

  // Đóng popup thông báo
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const isNotificationOpen = Boolean(notificationAnchorEl);
  // Thêm component LoadingOverlay
  const LoadingOverlay = () => (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <CircularProgress size={60} sx={{ color: '#FFA500' }} />
      <Typography sx={{ color: 'white', fontSize: '1.2rem' }}>
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
                      '& .MuiBadge-badge': {
                        backgroundColor: '#FF4444',
                        color: 'white',
                      }
                    }}
                  >
                    <NotificationsIcon 
                      sx={{ 
                        color: unreadCount > 0 ? '#FF4444' : 'inherit',
                        transition: 'color 0.3s ease'
                      }} 
                    />
                  </Badge>
                </IconButton>

                <Popover
                  open={isNotificationOpen}
                  anchorEl={notificationAnchorEl}
                  onClose={handleNotificationClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    sx: {
                      borderRadius: '8px',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
                      mt: 1,
                      maxHeight: '80vh',
                      width: 360,
                      backgroundColor: '#242526'
                    }
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#FFF', mb: 2 }}>
                      Thông báo
                    </Typography>
                    <Box sx={{ 
                      maxHeight: 'calc(80vh - 60px)', 
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#666',
                        borderRadius: '4px',
                      },
                    }}>
                      {notifications && notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              p: 2,
                              mb: 1,
                              backgroundColor: notification.isRead ? 'transparent' : 'rgba(45, 136, 255, 0.1)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <img 
                                src={notification.image} 
                                alt=""
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  borderRadius: '8px',
                                  objectFit: 'cover'
                                }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography 
                                  variant="subtitle2" 
                                  sx={{ 
                                    color: '#FFA500',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {notification.title}
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: '#e4e6eb',
                                    fontSize: '0.8rem',
                                    mt: 0.5
                                  }}
                                >
                                  {notification.message}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: '#B0B3B8',
                                    fontSize: '0.75rem',
                                    display: 'block',
                                    mt: 0.5
                                  }}
                                >
                                  {timeAgo(notification.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" sx={{ color: '#B0B3B8', textAlign: 'center' }}>
                          Không có thông báo mới!
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
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={() => { navigate(`/profile/${accountId}`); handleMenuClose(); }}>
                    Hồ sơ
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout} 
                    disabled={isLoggingOut}
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      color: isLoggingOut ? 'gray' : 'inherit'
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
