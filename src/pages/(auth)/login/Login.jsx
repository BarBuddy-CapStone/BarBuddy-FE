import { Alert, Button, CircularProgress } from "@mui/material"; // Import MUI Button, CircularProgress, and Alert
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "src/lib"; // Nhập useAuthStore
import { googleLogin, login } from "../../../lib/service/authenService"; // Nhập hàm login
// Import icon Google (ví dụ sử dụng Material-UI icons)
import Registration from "../registration/Registration";
import { useGoogleSignIn } from 'src/hooks/useGoogleSignIn';

function Login({ onClose, onSwitchToRegister, onSwitchToForgetPassword, onLoginSuccess }) {
  const [email, setEmail] = useState(""); // Trạng thái cho email
  const [password, setPassword] = useState(""); // Trạng thái cho mật khẩu
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();
  const loginStore = useAuthStore(); // Khởi tạo useAuthStore
  const [googleLoading, setGoogleLoading] = useState(false);
  const [currentPopup, setCurrentPopup] = useState("login");

  // Memoize handleGoogleResponse với useCallback
  const handleGoogleResponse = useCallback(async (response) => {
    try {
      setGoogleLoading(true);
      setError(null);

      const token = response.credential;
      const googleLoginResponse = await googleLogin(token);

      if (googleLoginResponse.data.statusCode === 200) {
        const userData = googleLoginResponse.data.data;
        loginStore.login(userData.accessToken, userData);

        const decodedToken = jwtDecode(userData.accessToken);
        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        toast.success("Đăng nhập Google thành công!");
        onLoginSuccess(userData);
        onClose();

        switch (userRole) {
          case "ADMIN":
            navigate("/admin/dashboard");
            break;
          case "MANAGER":
            navigate("/manager/managerDrinkCategory");
            break;
          case "STAFF":
            navigate("/staff/table-management");
            break;
          case "CUSTOMER":
            setTimeout(() => {
              window.location.reload();
            }, 1500);
            break;
          default:
            navigate("/home");
            break;
        }
      }
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
    } finally {
      setGoogleLoading(false);
    }
  }, [loginStore, navigate, onClose, onLoginSuccess]); // Thêm dependencies

  // Gọi useGoogleSignIn ở đầu component, sau các useState
  useGoogleSignIn('google-signin-login', handleGoogleResponse);

  // Function to handle login
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await login({ email, password });
      if (response.data.statusCode === 200) {
        const userData = response.data.data;
        loginStore.login(userData.accessToken, userData);

        // Giải mã JWT token
        const decodedToken = jwtDecode(userData.accessToken);
        const userRole =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];

        toast.success("Đăng nhập thành công!");
        onLoginSuccess(userData);
        onClose();

        // Chuyển hướng dựa trên vai trò
        switch (userRole) {
          case "ADMIN":
            navigate("/admin/dashboard");
            window.location.reload();
            break;
          case "MANAGER": // Thêm case cho MANAGER
            navigate("/manager/table-registrations");
            window.location.reload();
            break;
          case "STAFF":
            navigate("/staff/table-registrations");
            window.location.reload();
            break;
          case "CUSTOMER":
            window.location.reload();
            break;
          default:
            navigate("/home");
            window.location.reload();
            break;
        }
      }
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        const message = error.response.data.message;

        if (statusCode === 400) {
          setError("Sai tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại.");
        } else {
          setError("Đăng nhập thất bại! Vui lòng thử lại.");
        }
      } else {
        setError("Đăng nhập thất bại! Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press for both email and password fields
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !isLoginDisabled) {
      // Chỉ trigger đăng nhập nếu cả hai trường được điền
      handleLogin();
    }
  };

  // Check if both email and password fields have values
  const isLoginDisabled = email === "" || password === "";

  const handleSwitchToRegister = () => {
    onSwitchToRegister(); // Sử dụng hm chuyển đổi từ props
  };

  return (
    <>
      {currentPopup === "registration" && (
        <Registration
          onClose={() => setCurrentPopup("default")}
          onSwitchToRegister={handleSwitchToRegister} // Đảm bảo hàm này được truyền vào
        />
      )}
      {currentPopup === "login" && (
        <div
          className={`relative flex flex-col px-7 py-6 w-full max-w-md rounded-xl bg-neutral-800 transition-transform duration-500`} // Xóa showLogin
          style={{ borderRadius: "16px" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 z-10"
          >
            X
          </button>

          <div className="flex gap-0.5 self-start text-2xl text-orange-400">
            <div className="basis-auto font-notoSansSC text-2xl">Đăng Nhập</div>
          </div>

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          <div className="col-span-2 md:col-span-1 mt-5">
            <div className="text-xs text-gray-400">Địa chỉ Email</div>
            <input
              type="email"
              className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
              placeholder="nguyenvana@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
            />
          </div>
          <div className="col-span-2 md:col-span-1 mt-5">
            <div className="text-xs text-gray-400">Mật khẩu</div>
            <input
              type="password"
              className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
            />
          </div>

          <div className="flex gap-5 justify-between mt-6 w-full max-md:mr-1 max-md:max-w-full">
            <button 
              className="text-gray-400 hover:text-orange-400"
              onClick={onSwitchToForgetPassword}
            >
              Quên mật khẩu?
            </button>
            <div className="flex gap-0.5">
              <div className="grow text-gray-400">Bạn chưa có tài khoản ?</div>
              <button
                className="text-orange-400"
                onClick={handleSwitchToRegister}
              >
                Đăng ký
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center self-center mt-5 w-full max-w-[398px] text-zinc-100">
            {loading ? ( // Nếu đang tải, hiển thị spinner thay vì nút
              <CircularProgress size={40} color="inherit" />
            ) : (
              <>
                <Button
                  onClick={handleLogin}
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: isLoginDisabled
                      ? "rgba(255, 140, 0, 0.3)"
                      : "#FF8C00", // Màu cam nhạt khi bị vô hiệu hóa
                    "&:hover": {
                      backgroundColor: isLoginDisabled
                        ? "rgba(255, 140, 0, 0.3)"
                        : "#FF7000", // Giữ nguyên màu khi hover nếu bị vô hiệu hóa
                    },
                    color: isLoginDisabled ? "rgba(0, 0, 0, 0.9)" : "black", // Màu chữ mờ hơn khi bị vô hiệu hóa
                    height: "48px",
                    borderRadius: "64px",
                    textTransform: "none",
                    fontSize: "18px",
                    opacity: 1, // Không cần opacity nữa vì chúng ta đã sử dụng rgba
                    pointerEvents: isLoginDisabled ? "none" : "auto",
                    transition: "all 0.3s ease", // Thêm hiệu ứng chuyển đổi mượt mà
                    boxShadow: "none", // Loại bỏ shadow mặc định của MUI Button
                    "&:disabled": {
                      backgroundColor: "rgba(255, 140, 0, 0.3)", // Đảm bảo mu khng thay đổi khi bị disabled
                    },
                  }}
                  disabled={loading || isLoginDisabled}
                >
                  Đăng nhập
                </Button>

                {/* Thêm dòng phân cách */}
                <div className="flex items-center w-full my-4">
                  <div className="flex-grow border-t border-gray-400"></div>
                  <span className="px-3 text-gray-400 text-sm">Hoặc</span>
                  <div className="flex-grow border-t border-gray-400"></div>
                </div>

                {/* Container cho nút đăng nhập Google */}
                <div className="google-btn-container w-full flex justify-center items-center">
                  <div 
                    id="google-signin-login" 
                    className="google-btn"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
