import React, { useState } from "react";
import { login } from "../../../lib/service/authenService"; // Nhập hàm login
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "src/lib"; // Nhập useAuthStore
import { Button, CircularProgress, Alert } from "@mui/material"; // Import MUI Button, CircularProgress, and Alert
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode

function Login({ onClose, onSwitchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState(""); // Trạng thái cho email
  const [password, setPassword] = useState(""); // Trạng thái cho mật khẩu
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();
  const loginStore = useAuthStore(); // Khởi tạo useAuthStore

  // Function to handle login
  const handleLogin = async () => {
    setLoading(true); // Bắt đầu hiển thị spinner
    setError(null); // Reset lại lỗi trước khi thực hiện request
    try {
      const response = await login({ email, password });
      if (response.data.statusCode === 200) {
        const userData = response.data.data;
        loginStore.login(userData.accessToken, userData); // Lưu thông tin người dùng vào store

        // Giải mã JWT token
        const decodedToken = jwtDecode(userData.accessToken);
        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        // Hiển thị toast thành công
        toast.success("Đăng nhập thành công!");

        // Cập nhật thông tin người dùng và đóng popup
        onLoginSuccess(userData);
        onClose(); // Đóng popup đăng nhập

        // Chuyển hướng dựa trên vai trò
        switch (userRole) {
          case "ADMIN":
            navigate("/admin/dashboard");
            break;
          case "STAFF":
            navigate("/staff/table-management");
            break;
          case "CUSTOMER":
          default:
            navigate("/home");
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
      setLoading(false); // Dừng hiển thị spinner nếu đăng nhập thất bại
    }
  };

  // Handle Enter key press for both email and password fields
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !isLoginDisabled) { // Chỉ trigger đăng nhập nếu cả hai trường được điền
      handleLogin();
    }
  };

  // Check if both email and password fields have values
  const isLoginDisabled = email === "" || password === "";

  const handleSwitchToRegister = () => {
    onSwitchToRegister(); // Gọi hàm để chuyển sang form đăng ký
    onClose(); // Đóng popup đăng nhập
  };

  return (
    <div
      className={`relative flex flex-col px-7 py-11 w-full max-w-md rounded-xl bg-zinc-900 transition-transform duration-500`} // Xóa showLogin
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
        <button className="text-gray-400">Quên mật khẩu ?</button>
        <div className="flex gap-0.5">
          <div className="grow text-gray-400">Bạn chưa có tài khoản ?</div>
          <button className="text-orange-400" onClick={onSwitchToRegister}>
            Đăng ký
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center self-center mt-5 w-full max-w-[398px] text-zinc-100">
        {loading ? ( // Nếu đang tải, hiển thị spinner thay vì nút
          <CircularProgress size={40} color="inherit" />
        ) : (
          <Button
            onClick={handleLogin}
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: isLoginDisabled ? "#FFA500" : "#FF8C00",
              "&:hover": {
                backgroundColor: isLoginDisabled ? "#FFA500" : "#FF8C00",
              },
              color: "black",
              height: "48px",
              borderRadius: "64px",
              textTransform: "none",
              fontSize: "18px",
              opacity: isLoginDisabled ? 0.7 : 1,
              pointerEvents: isLoginDisabled ? "none" : "auto",
            }}
            disabled={loading || isLoginDisabled} // Disable button if loading or fields are empty
          >
            Đăng nhập
          </Button>
        )}
      </div>
    </div>
  );
}

export default Login;