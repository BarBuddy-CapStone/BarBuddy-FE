import React, { useState, Fragment, useEffect } from "react";
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
  Popover, // Thêm Popover
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "src/lib";
import MenuIcon from "@mui/icons-material/Menu";
import { Login, Registration } from "src/pages";
import { toast } from "react-toastify";
import { getNotificationByAccountId } from "src/lib/service/notificationService"; // Import hàm

const CustomerHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const { isLoggedIn, userInfo, logout } = useAuthStore();
  const navigate = useNavigate();

  const [accountId, setAccountId] = useState(null);

  // State cho popup thông báo
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const [notifications, setNotifications] = useState([]); // State lưu trữ thông báo

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('userInfo');
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

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    toast.success("Đăng xuất thành công");
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 1500);
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
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  // Đóng popup thông báo
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const isNotificationOpen = Boolean(notificationAnchorEl);

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
                  <Badge color="error">
                    <NotificationsIcon />
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
                >
                  <Box sx={{ p: 2, width: 300, backgroundColor: "#444", color: "#FFF" }}>
                    <Typography className="text-yellow-400" variant="h6">Thông báo</Typography>
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, border: '1px solid #FFA500', borderRadius: '8px', backgroundColor: "#555" }}>
                          <Typography variant="body2">
                            {notification.message} {/* Giả sử thông báo có thuộc tính message */}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2">Không có thông báo mới!</Typography>
                    )}
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
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
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
          onSwitchToRegister={handleOpenRegister} // Thêm hàm chuyển đổi
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
          onSwitchToLogin={handleOpenLogin} // Thêm hàm chuyển đổi
        />
      </Dialog>
    </Fragment>
  );
};

export default CustomerHeader;
